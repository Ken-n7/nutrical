import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5185';
const DIST_DIR = '/home/ken/Workspace/nutrical-react/dist';
const ARTIFACT_DIR = '/home/ken/Workspace/nutrical-react/test-results/swipe';

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568, dpr: 2 },
  { name: '360x640', width: 360, height: 640, dpr: 2 },
  { name: '375x667', width: 375, height: 667, dpr: 2 },
  { name: '390x844', width: 390, height: 844, dpr: 3 },
  { name: '393x851', width: 393, height: 851, dpr: 2.75 },
  { name: '412x915', width: 412, height: 915, dpr: 2.625 },
  { name: '430x932', width: 430, height: 932, dpr: 3 },
  { name: '480x800', width: 480, height: 800, dpr: 2 },
].filter((v) => !process.env.SWIPE_ONLY || v.name === process.env.SWIPE_ONLY);

let browser;
let server;

beforeAll(async () => {
  if (!existsSync(ARTIFACT_DIR)) mkdirSync(ARTIFACT_DIR, { recursive: true });
  const { spawn } = await import('child_process');
  server = spawn('python3', ['-m', 'http.server', '5185'], {
    cwd: DIST_DIR,
    stdio: 'pipe',
  });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(BASE_URL, { signal: AbortSignal.timeout(1500) });
      if (r.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  server?.kill();
});

async function cdpSwipe(client, { x1, y1, x2, y2, steps = 10, stepMs = 10 }) {
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
  for (let i = 1; i <= steps; i++) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await new Promise((r) => setTimeout(r, stepMs));
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await new Promise((r) => setTimeout(r, 350));
}

const currentStepId = (page) =>
  page.evaluate(() => document.querySelector('section.wizard-step:not(.hidden)')?.id || null);

const ACTIVE_SECTION = 'section.wizard-step:not(.hidden)';

const scrollY = (page) => page.evaluate(() => window.scrollY);

async function pageDiagnostics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const winW = window.innerWidth;
    const overflow = {
      pageHorizontal: doc.scrollWidth > doc.clientWidth + 1,
      delta: doc.scrollWidth - doc.clientWidth,
      scrollLeft: doc.scrollLeft,
      clientWidth: doc.clientWidth,
      scrollWidth: doc.scrollWidth,
    };

    const isExcluded = (el) => Boolean(el.closest('.meal-plan-print')) || Boolean(el.closest('.sr-only'));

    const clipped = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (isExcluded(el)) return;
      const cs = getComputedStyle(el);
      if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
        clipped.push({
          tag: el.tagName,
          cls: typeof el.className === 'string' ? el.className.slice(0, 120) : '',
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          overflowX: cs.overflowX,
        });
      }
    });

    const outside = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (isExcluded(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > winW + 1 || r.left < -1)) {
        outside.push({
          tag: el.tagName,
          cls: typeof el.className === 'string' ? el.className.slice(0, 120) : '',
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
          inRecap: Boolean(el.closest('#recap-content')),
          inSheet: Boolean(el.closest('.fixed.inset-x-0.bottom-0.z-50')),
          ancestor: (() => {
            let p = el.parentElement;
            const out = [];
            for (let i = 0; i < 4 && p; i++, p = p.parentElement) {
              out.push(typeof p.className === 'string' ? p.className.slice(0, 50) || p.tagName : p.tagName);
            }
            return out;
          })(),
        });
      }
    });

    return {
      overflow,
      clipped: clipped.slice(0, 10),
      outside: outside.slice(0, 10),
      maxScroll: doc.scrollHeight - doc.clientHeight,
    };
  });
}

async function battery(page, client, vp, step, errors) {
  const findings = [];
  const add = (msg, detail) => findings.push({ step, msg, detail });
  const log = (m) => console.log(`    [${vp.name}/${step}] ${m}`);

  const stepId = await currentStepId(page);
  const errsAtStart = errors.length;

  if (process.env.SWIPEDEBUG) {
    await page.waitForTimeout(1600);
    const anim = await page.evaluate(() => {
      const moving = [];
      const n = document.getAnimations();
      for (const a of n) {
        const t = a.animationName || 'none';
        const prop = a.effect && a.effect.target && a.effect.target.id ? a.effect.target.id : '';
        moving.push(`${t} target=${a.effect && a.effect.target ? String(a.effect.target.tagName || a.effect.target.className).slice(0, 24) : ''} playState=${a.playState}`);
      }
      return moving;
    });
    console.log(`    [${vp.name}/${step}] running animations: ${JSON.stringify(anim)}`);
  }

  const diag0 = await pageDiagnostics(page);
  if (diag0.overflow.pageHorizontal) add('Page-level horizontal overflow', diag0.overflow);
  if (diag0.clipped.length) add('Clipped content in non-scrollable container', diag0.clipped);
  if (diag0.outside.length) add('Elements partially outside viewport', diag0.outside);

  const cx = Math.round(vp.width / 2);
  const cy = Math.round(vp.height * 0.5);
  const stepperY = Math.round(Math.min(84, Math.max(60, vp.height * 0.14)));

  // --- Horizontal swipes (page + stepper) ---
  await cdpSwipe(client, { x1: vp.width - 18, y1: cy, x2: 18, y2: cy });
  await cdpSwipe(client, { x1: 18, y1: cy, x2: vp.width - 18, y2: cy });
  await cdpSwipe(client, { x1: vp.width - 18, y1: stepperY, x2: 18, y2: stepperY });

  // --- Vertical scrolling ---
  const maxScroll = diag0.maxScroll;
  const yTop = await scrollY(page);
  if (maxScroll > 10) {
    await cdpSwipe(client, { x1: cx, y1: cy, x2: cx, y2: Math.max(20, cy - Math.round(cy * 0.7)), steps: 18 });
    const yDown = await scrollY(page);
    if (yDown <= yTop) add('Swipe-up did not scroll the page down', { yTop, yDown, maxScroll });
    await cdpSwipe(client, { x1: cx, y1: cy, x2: cx, y2: Math.min(vp.height - 20, cy + Math.round(cy * 0.7)), steps: 18 });
  }

  // --- Recap bottom sheet (steps 2-4, mobile only) ---
  const handle = page.locator(`${ACTIVE_SECTION} .lg\\:hidden button[aria-expanded]`).first();
  const hasSheet = (await handle.count()) > 0;
  const sheetSel = `${ACTIVE_SECTION} .lg\\:hidden .fixed.inset-x-0.bottom-0.z-50`;
  if (hasSheet) {
    const sheetYRef = await scrollY(page);
    const expandedBefore = await handle.getAttribute('aria-expanded');
    if (expandedBefore !== 'false') add('Sheet expected closed but aria-expanded=' + expandedBefore);
    const openGeo = await page.evaluate(
      (sels) => {
        const [sheetSel2, handleSel] = sels;
        const s = document.querySelector(sheetSel2);
        const r = s ? s.getBoundingClientRect() : null;
        const hb = document.querySelector(handleSel);
        const hr = hb ? hb.getBoundingClientRect() : null;
        const rc = document.querySelector(`${handleSel.replace('button[aria-expanded]', '')} #recap-content`);
        const at = document.elementFromPoint(Math.round(innerWidth / 2), innerHeight - 25);
        return {
          sheetTop: r ? Math.round(r.top) : null,
          sheetH: r ? Math.round(r.height) : null,
          sheetTransform: s ? s.style.transform : null,
          handleTop: hr ? Math.round(hr.top) : null,
          handleBottom: hr ? Math.round(hr.bottom) : null,
          recapCh: rc ? rc.clientHeight : null,
          recapSh: rc ? rc.scrollHeight : null,
          recapOh: rc ? rc.offsetHeight : null,
          atStart: at ? String(at.className || at.tagName).slice(0, 60) : null,
        };
      },
      [sheetSel, `${ACTIVE_SECTION} .lg\\:hidden button[aria-expanded]`]
    );
    log('sheet open geo: ' + JSON.stringify(openGeo));
    if (process.env.SHOT) await page.screenshot({ path: `${ARTIFACT_DIR}/pre-open-${vp.name.replace(/[^\w]+/g, '_')}-${step}.png`, fullPage: true });
    if (process.env.SWIPEDEBUG) {
      const preScrollY = await page.evaluate(() => window.scrollY);
      const pre = await page.evaluate(async (o) => {
        const probe = () => {
          const s = document.querySelector(o.sheetSel);
          const h = s ? s.querySelector('button[aria-expanded]') : null;
          const rc = s ? s.querySelector('#recap-content') : null;
          return {
            inline: s ? s.style.transform : null,
            top: s ? Math.round(s.getBoundingClientRect().top) : null,
            handleTop: h ? Math.round(h.getBoundingClientRect().top) : null,
            recapOh: rc ? rc.offsetHeight : null,
            recapSh: rc ? rc.scrollHeight : null,
            y: window.scrollY,
          };
        };
        const samples = [probe()];
        const start = performance.now();
        while (performance.now() - start < 1400) {
          await new Promise((r) => setTimeout(r, 100));
          samples.push(probe());
        }
        return samples;
      }, { sheetSel, y0: preScrollY });
      console.log(`    [${vp.name}/${step}] SWIPE LIVE PRE: ${JSON.stringify(pre)}`);
    }

    await cdpSwipe(client, {
      x1: cx,
      y1: vp.height - 25,
      x2: cx,
      y2: Math.max(60, Math.round(vp.height * 0.12)),
      steps: 14,
    });
    if (process.env.SWIPEDEBUG) {
      console.log(`    [${vp.name}/${step}] SWIPE LIVE AFTER OPEN-ATTEMPT: ${JSON.stringify(await page.evaluate((sel) => {
        const s = document.querySelector(sel);
        const h = document.querySelector(`${sel.split('.fixed')[0]} .lg\\:hidden button[aria-expanded]`);
        const mk = (x) => ({ top: x ? Math.round(x.getBoundingClientRect().top) : null, bottom: x ? Math.round(x.getBoundingClientRect().bottom) : null });
        return { inline: s?.style.transform, computed: s ? getComputedStyle(s).transform : null, sheet: mk(s), handle: mk(h) };
      }, sheetSel))}`);
    }
    const expandedOpen = await handle.getAttribute('aria-expanded');
    const dialogOpen = await page.locator(`${ACTIVE_SECTION} [role="dialog"]`).isVisible().catch(() => false);
    if (expandedOpen !== 'true' || !dialogOpen) {
      add('Bottom sheet did not open via swipe-up', { expandedOpen, dialogOpen });
      if (process.env.SWIPEDEBUG) {
        const dbg = await page.evaluate((activeSel) => {
          const handles = [...document.querySelectorAll(`${activeSel} button[aria-expanded]`)].map((b) => ({
            cls: String(b.className).slice(0, 60),
            top: Math.round(b.getBoundingClientRect().top),
            bottom: Math.round(b.getBoundingClientRect().bottom),
          }));
          const s = document.querySelector(`${activeSel} .fixed.inset-x-0.bottom-0.z-50`);
          const chain = [];
          let p = s;
          for (let i = 0; i < 6 && p; i++, p = p.parentElement) {
            const cs = getComputedStyle(p);
            chain.push({
              tag: p.tagName,
              cls: typeof p.className === 'string' ? p.className.slice(0, 60) : '',
              id: p.id || null,
              position: cs.position,
              transform: cs.transform,
            });
          }
          const pts = [];
          for (let y0 = 0; y0 < 1600; y0 += 40) {
            const at = document.elementFromPoint(195, y0);
            const cls = at ? String(at.className || '') : '';
            if (/cursor-poin|aria-expanded|handle|drag|summary-tab/i.test(cls) && cls.indexOf('fel-td') < 0) {
              pts.push({ y: y0, cls: cls.slice(0, 50) });
            }
          }
          return { handles, chain, pts };
        }, ACTIVE_SECTION);
        console.log(`    [${vp.name}/${step}] SWIPE HANDLES: ${JSON.stringify(dbg, null, 1)}`);
      }
    } else {
      const bodyLocked = await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
      if (!bodyLocked) add('Body not scroll-locked while sheet open');
      const pageMoved = await scrollY(page);
      if (pageMoved !== sheetYRef) add('Page scrolled behind open sheet', { sheetYRef, pageMoved });

      const content = page.locator(`${ACTIVE_SECTION} #recap-content`);
      const scrollable = await content.evaluate((el) => el.scrollHeight > el.clientHeight).catch(() => false);
      if (scrollable) {
        const st0 = await content.evaluate((el) => el.scrollTop);
        await cdpSwipe(client, { x1: cx, y1: Math.round(vp.height * 0.6), x2: cx, y2: Math.round(vp.height * 0.25), steps: 16 });
        const st1 = await content.evaluate((el) => el.scrollTop);
        if (st1 <= st0) add('Sheet content did not scroll on swipe-up', { st0, st1 });
        const pageWhileSheet = await scrollY(page);
        if (pageWhileSheet !== sheetYRef) add('Page scrolled while dragging sheet content', { sheetYRef, pageWhileSheet });
      } else {
        log('recap content fits, no inner scroll expected');
      }
    }

    const sheetOpenRect = await page.evaluate(
      ({ sel, fb }) => {
        const s = document.querySelector(sel);
        if (!s) return { top: fb, height: 0 };
        const r = s.getBoundingClientRect();
        return { top: r.top || fb, height: r.height };
      },
      { sel: sheetSel, fb: vp.height }
    );
    await cdpSwipe(client, {
      x1: cx,
      y1: Math.max(16, Math.round(sheetOpenRect.top + 22)),
      x2: cx,
      y2: vp.height - 20,
      steps: 14,
    });
    const expandedClosed = await handle.getAttribute('aria-expanded');
    if (expandedClosed !== 'false') add('Bottom sheet did not close via swipe-down', { expandedClosed });
    const bodyUnlocked = await page.evaluate(() => getComputedStyle(document.body).overflow !== 'hidden');
    if (!bodyUnlocked) add('Body scroll not restored after closing sheet');
  }

  // --- Step must be unchanged by swipes ---
  const stepAfter = await currentStepId(page);
  if (stepAfter !== stepId) add('Swipe gestures changed the wizard step', { stepId, stepAfter });

  // --- Floating recap bar: does it cover the bottom nav buttons at max scroll? ---
  if (hasSheet) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(300);
    const obscured = await page.evaluate((sel) => {
      const sheet = document.querySelector(sel);
      if (!sheet) return [];
      const barTop = sheet.getBoundingClientRect().top;
      if (barTop <= 0) return [];
      return [...document.querySelectorAll('.btn-nav-back, .btn-continue')]
        .filter((b) => b.offsetParent !== null)
        .filter((b) => {
          const r = b.getBoundingClientRect();
          return r.top + r.height / 2 > barTop;
        })
        .map((b) => `${b.classList.value} centerY=${Math.round(b.getBoundingClientRect().top + b.getBoundingClientRect().height / 2)} barTop=${Math.round(barTop)}`);
    }, sheetSel);
    if (obscured.length) add('Bottom nav buttons hidden behind recap bar at max scroll', { obscured });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
  }

  // --- Console/page errors during battery ---
  const stepErrors = errors.slice(errsAtStart).filter(Boolean);
  if (stepErrors.length) add('Console/page errors during swipes', stepErrors.slice(0, 5));

  const diag1 = await pageDiagnostics(page);
  if (diag1.overflow.pageHorizontal && !diag0.overflow.pageHorizontal) {
    add('Horizontal overflow appeared after swipes', diag1.overflow);
  }
  if (!hasSheet && findings.length === 0) log('OK');

  return findings;
}

async function probeInteractive(page, step) {
  switch (step) {
    case 'patient': {
      await page.locator('#f-weight').fill('150');
      const v = await page.locator('#f-weight').inputValue();
      return v === '150' ? null : 'weight input not editable after swipes';
    }
    case 'assessment': {
      const btn = page.locator('button:has-text("Continue to Exchanges")');
      const enabled = await btn.isEnabled().catch(() => false);
      return enabled ? null : 'Continue-to-Exchanges button not enabled after swipes';
    }
    case 'prescription': {
      await page.locator('input[aria-label="Vegetable exchanges"]').first().fill('4');
      const v = await page.locator('input[aria-label="Vegetable exchanges"]').first().inputValue();
      return v === '4' ? null : 'exchange input not editable after swipes';
    }
    case 'meal-plan': {
      const btn = page.locator('button:has-text("Generate Plan")');
      const enabled = await btn.isEnabled().catch(() => false);
      const rows = await page.locator('#meal-plan table.meal-table tbody tr').count();
      return enabled && rows > 0 ? null : 'meal plan controls not functional after swipes';
    }
    default:
      return null;
  }
}

async function runViewport(vp, aggregate) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    screen: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  const log = (m) => console.log(`  [${vp.name}] ${m}`);
  const report = [];

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('#patient.wizard-step').waitFor({ state: 'visible', timeout: 15000 });

    // Step 1 - Patient
    log('step patient');
    report.push(...(await battery(page, client, vp, 'patient', errors)));
    const pErr = await probeInteractive(page, 'patient');
    if (pErr) report.push({ step: 'patient', msg: `[probe] ${pErr}` });

    // Step 2 - Assessment
    await page.locator('button:has-text("Continue to Assessment")').tap();
    await page.locator('#assessment.wizard-step').waitFor({ state: 'visible', timeout: 8000 });
    log('step assessment');
    report.push(...(await battery(page, client, vp, 'assessment', errors)));
    const aErr = await probeInteractive(page, 'assessment');
    if (aErr) report.push({ step: 'assessment', msg: `[probe] ${aErr}` });

    // Step 3 - Exchanges (unlock via assessment)
    await page.locator('button[aria-label="Step 3: Exchanges"]').tap();
    await page.locator('#prescription.wizard-step').waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('button:has-text("Suggest from targets")').tap();
    await page.waitForTimeout(600);
    log('step prescription');
    report.push(...(await battery(page, client, vp, 'prescription', errors)));
    const xErr = await probeInteractive(page, 'prescription');
    if (xErr) report.push({ step: 'prescription', msg: `[probe] ${xErr}` });

    // Step 4 - Meal Plan (with generated rows)
    await page.locator('button[aria-label="Step 4: Meal Plan"]').tap();
    await page.locator('#meal-plan.wizard-step').waitFor({ state: 'visible', timeout: 8000 });
    await page.locator('button:has-text("Generate Plan")').tap();
    await page.waitForFunction(
      () => document.querySelectorAll('#meal-plan table.meal-table tbody tr').length >= 3,
      null,
      { timeout: 8000 }
    );
    log('step meal-plan');
    report.push(...(await battery(page, client, vp, 'meal-plan', errors)));
    const mErr = await probeInteractive(page, 'meal-plan');
    if (mErr) report.push({ step: 'meal-plan', msg: `[probe] ${mErr}` });

    const clean = report.map((r) => `[${r.step ?? '?'}] ${r.msg}${r.detail ? ' :: ' + JSON.stringify(r.detail).slice(0, 250) : ''}`);
    if (clean.length) {
      log(`issues (${clean.length}):`);
      for (const f of clean) console.log(`      FIND [${vp.name}] ${f}`);
    } else {
      log('no issues found');
    }

    aggregate.push({
      viewport: vp.name,
      findings: clean,
    });
  } finally {
    await context.close();
  }
}

describe('E2E: Mobile swipe gestures on all wizard steps', () => {
  it('swipes up/down/left/right on every step across many screen sizes', async () => {
    const aggregate = [];
    for (const vp of VIEWPORTS) {
      console.log(`— ${vp.name} —`);
      await runViewport(vp, aggregate);
    }

    console.log('\n==== SWIPE QA SUMMARY ====');
    for (const a of aggregate) {
      if (a.findings.length) console.log(JSON.stringify(a, null, 2));
      else console.log(`  ${a.viewport}: clean`);
    }

    const problems = aggregate.flatMap((a) => a.findings);
    expect(problems).toEqual([]);
  }, 900000);
});