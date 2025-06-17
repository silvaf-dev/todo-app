export async function cleanList({ page }) {
  const deleteBtns = page.getByTestId('todo-delete-btn');
  const count = await deleteBtns.count();

  for (let i = 0; i < count; i++) {
    await deleteBtns.nth(i).click();
  }
}