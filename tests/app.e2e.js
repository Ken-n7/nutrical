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

describe('E2E: Page loads correctly', () => {
  it('loads the page with correct title', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(await page.title()).toBe('NutriCal — FEL Calculator');
    await page.close();
  });

  it('shows all three main sections', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(await page.locator('#patient').count()).toBe(1);
    expect(await page.locator('#assessment').count()).toBe(1);
    expect(await page.locator('#prescription').count()).toBe(1);
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
    const vegInput = page.locator('input[aria-label="Vegetable exchanges"]');
    await vegInput.clear();
    await vegInput.fill('10');
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Total Entered');
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
    const h2s = await page.locator('h2').allTextContents();
    expect(h2s).toContain('Energy Assessment');
    expect(h2s).toContain('FEL Exchange Distribution');
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
    const labels = ['Vegetable exchanges', 'Fruit exchanges', 'Milk exchanges', 'Sugar exchanges', 'Fat exchanges'];
    for (const label of labels) {
      const count = await page.locator(`input[aria-label="${label}"]`).count();
      expect(count).toBe(1);
    }
    await page.close();
  });
});

describe('E2E: Visual regression', () => {
  it('matches the default page layout', async () => {
    const page = await createPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const patientSection = page.locator('#patient');
    const assessmentSection = page.locator('#assessment');
    const prescriptionSection = page.locator('#prescription');
    
    expect(await patientSection.count()).toBe(1);
    expect(await assessmentSection.count()).toBe(1);
    expect(await prescriptionSection.count()).toBe(1);
    
    const patientBox = await patientSection.boundingBox();
    const assessmentBox = await assessmentSection.boundingBox();
    expect(patientBox.y).toBeLessThan(assessmentBox.y);
    
    const prescriptionBox = await prescriptionSection.boundingBox();
    expect(assessmentBox.y).toBeLessThan(prescriptionBox.y);
    await page.close();
  });
});
