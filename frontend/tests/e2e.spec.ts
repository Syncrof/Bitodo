import { test, expect } from '@playwright/test';

test('register -> login -> create task -> list -> logout', async ({ page }) => {
  const email = `test+${Date.now()}@example.com`;
  const password = 'Sifre123!';

  await page.goto('/register');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('text=Kayıt Ol');

  // after register, should be redirected (depends on backend behavior)
  await page.waitForURL('/inbox');

  // create a task via UI
  await page.fill('input[placeholder="Add a new task..."]', 'E2E Task');
  await page.click('text=Add Task');

  // check task appears
  await expect(page.locator('text=E2E Task')).toHaveCount(1);

  // logout
  await page.click('text=Logout');
  await page.waitForURL('/login');
});
