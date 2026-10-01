import { Page, Locator, expect } from '@playwright/test';

export class ArticlePage {
  readonly heading: Locator;
  readonly content: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(private page: Page) {
    this.heading = page.locator('h1');
    this.content = page.locator('.article-content');
    this.editButton = page.getByRole('link', { name: 'Edit Article' }).first();
    this.deleteButton = page.getByRole('button', { name: 'Delete Article' }).first();
  }

  async verifyArticleDetails(title: string, body: string) {
    await expect(this.heading).toHaveText(title);
    await expect(this.content).toContainText(body);
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async deleteArticle() {
    await this.deleteButton.click();
    await expect(this.page).toHaveURL('/');
  }
}