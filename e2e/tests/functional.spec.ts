import { test, expect } from '@playwright/test';
import { cleanList } from '../utils/utils';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await cleanList({ page });
});

test('add todo', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('todo-add-txt').fill('Add todo test');
  await page.getByTestId('todo-add-btn').click();
  await expect(page.getByTestId('todo-txt')).toHaveText('Add todo test');
});

test('edit todo', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('todo-add-txt').fill('Add todo test');
  await page.getByTestId('todo-add-btn').click();
  await page.getByTestId('todo-edit-btn').last().click();
  await page.getByTestId('todo-edit-txt').last().clear();
  await page.getByTestId('todo-edit-txt').last().fill('Edited todo element');
  await page.getByTestId('todo-save-edit-btn').last().click();
  await expect(page.getByTestId('todo-txt').last()).toHaveText('Edited todo element');
});

test('remove todo', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('todo-add-txt').fill('Add todo test');
  await page.getByTestId('todo-add-btn').click();
  await page.getByTestId('todo-delete-btn').click();
  await expect(page.getByTestId('todo-text')).toHaveCount(0);
});