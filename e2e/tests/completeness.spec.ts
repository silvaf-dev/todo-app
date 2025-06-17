import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('todo-title')).toHaveText(/Todo List/);
});

test('has input bar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect.soft(page.getByTestId('todo-add-txt')).toHaveAttribute('placeholder', 'Add a todo');
  await expect(page.getByTestId('todo-add-txt')).toBeVisible();
});

test('has add button', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect.soft(page.getByTestId('todo-add-btn')).toHaveText('Add');
  await expect(page.getByTestId('todo-add-btn')).toBeVisible();
});