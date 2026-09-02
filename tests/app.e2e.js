import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5184';

let browser;
let server;

beforeAll(async () => {
  const { spawn } = await import('child_process');
  server = spawn('python3', ['-m', 'http.server', '5184'], {
    cwd: '/home/ken/Workspace/nutrical-react/dist',
    stdio: 'pipe',
  });
  await new Promise(r => setTimeout(r, 2000));
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  server?.kill();
});

function createPage() {
  return browser.newPage({ viewport: { width: 1440, height: 900 } });
}

// Default patient data is valid, so Assessment unlocks every later step.
async function goToStep(page, num, name) {
  await page.click(`button[aria-label="Step ${num}: ${name}"]`);
  await page.waitForTimeout(200);
}

describe('E2E: Page loads correctly', () => {
  it('loads the page with correct title', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(await page.title()).toBe('NutriCal — FEL Calculator');
    await page.close();
  });

  it('shows all four wizard steps', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(await page.locator('#patient').count()).toBe(1);
    expect(await page.locator('#assessment').count()).toBe(1);
    expect(await page.locator('#prescription').count()).toBe(1);
    expect(await page.locator('#meal-plan').count()).toBe(1);
    await page.close();
  });

  it('has no console errors', async () => {
    const page = await createPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
    await page.close();
  });
});

describe('E2E: Wizard navigation', () => {
  it('shows only the patient step first, then each section when visited', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    expect(await page.locator('#patient').isVisible()).toBe(true);
    expect(await page.locator('#assessment').isVisible()).toBe(false);
    expect(await page.locator('#prescription').isVisible()).toBe(false);

    await goToStep(page, 2, 'Assessment');
    expect(await page.locator('#assessment').isVisible()).toBe(true);
    expect(await page.locator('#patient').isVisible()).toBe(false);

    await goToStep(page, 3, 'Exchanges');
    expect(await page.locator('#prescription').isVisible()).toBe(true);

    await goToStep(page, 4, 'Meal Plan');
    expect(await page.locator('#meal-plan').isVisible()).toBe(true);
    await page.close();
  });

  it('navigates back with the Continue button from patient step', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.click('text=Continue to Assessment');
    await page.waitForTimeout(300);
    expect(await page.locator('#assessment').isVisible()).toBe(true);
    await page.close();
  });
});

describe('E2E: Default values', () => {
  it('shows default BMI of 28.3', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('28.3');
    await page.close();
  });

  it('shows default TER of 1,670', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('1,670');
    await page.close();
  });

  it('shows default CHO target of 271', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('271');
    await page.close();
  });
});

describe('E2E: Patient form interactions', () => {
  it('recalculates when sex changes to male', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.selectOption('#f-sex', 'male');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('1,780');
    await page.close();
  });

  it('recalculates when activity factor changes', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.selectOption('#f-activity', '40');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('1,910');
    await page.close();
  });

  it('recalculates when frame changes', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.selectOption('#f-frame', '0.9');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('1,500');
    await page.close();
  });

  it('recalculates when distribution changes', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.selectOption('#f-distribution', '50,20,30');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('208.8');
    await page.close();
  });
});

describe('E2E: Exchange table', () => {
  it('allows changing vegetable exchanges', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 3, 'Exchanges');
    const vegInput = page.locator('input[aria-label="Vegetable exchanges"]');
    await vegInput.clear();
    await vegInput.fill('5');
    await page.waitForTimeout(500);
    expect(await vegInput.inputValue()).toBe('5');
    await page.close();
  });

  it('allows changing fruit exchanges', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 3, 'Exchanges');
    const fruitInput = page.locator('input[aria-label="Fruit exchanges"]');
    await fruitInput.clear();
    await fruitInput.fill('3');
    await page.waitForTimeout(500);
    expect(await fruitInput.inputValue()).toBe('3');
    await page.close();
  });

  it('accepts fractional exchange values', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 3, 'Exchanges');
    const vegInput = page.locator('input[aria-label="Vegetable exchanges"]');
    await vegInput.clear();
    await vegInput.fill('2.5');
    await page.waitForTimeout(500);
    expect(await vegInput.inputValue()).toBe('2.5');
    await page.close();
  });

  it('updates totals when exchanges change', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 3, 'Exchanges');
    const vegInput = page.locator('input[aria-label="Vegetable exchanges"]');
    await vegInput.clear();
    await vegInput.fill('10');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Prescription vs Entered');
    await page.close();
  });
});

describe('E2E: Accessibility', () => {
  it('has skip link', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const skipLinkCount = await page.locator('text=Skip to main content').count();
    expect(skipLinkCount).toBe(1);
    await page.close();
  });

  it('has proper heading hierarchy', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 2, 'Assessment');
    const h2s = await page.locator('h2').allTextContents();
    expect(h2s).toContain('Energy Assessment');
    await goToStep(page, 3, 'Exchanges');
    const h2sLater = await page.locator('h2').allTextContents();
    expect(h2sLater).toContain('Exchange Distribution');
    await page.close();
  });

  it('has aria-live on comparison section', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const ariaLiveCount = await page.locator('[aria-live="polite"]').count();
    expect(ariaLiveCount).toBeGreaterThanOrEqual(1);
    await page.close();
  });

  it('has aria-labels on all exchange inputs', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await goToStep(page, 3, 'Exchanges');
    const labels = [
      'Vegetable exchanges',
      'Fruit exchanges',
      'Whole Milk exchanges',
      'Low-Fat Milk exchanges',
      'Skim Milk exchanges',
      'Sugar exchanges',
      'Rice A (Low-Protein) exchanges',
      'Low-Fat Meat exchanges',
      'Fat exchanges',
    ];
    for (const label of labels) {
      const count = await page.locator(`input[aria-label="${label}"]`).count();
      expect(count).toBe(1);
    }
    await page.close();
  });
});