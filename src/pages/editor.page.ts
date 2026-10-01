import { Page, Locator, expect } from '@playwright/test';
import { ArticleData } from '../utils/data_generator';

export class EditorPage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;

  constructor(private page: Page) {
    this.titleInput = page.getByPlaceholder('Article Title');
    this.descriptionInput = page.getByPlaceholder("What's this article about?");
    this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
    this.tagsInput = page.getByPlaceholder('Enter tags');
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async createArticle(article: ArticleData) {
    await this.page.getByRole('link', { name: 'New Article' }).click();
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);

    for (const tag of article.tagList) {
      await this.tagsInput.fill(tag);
      await this.tagsInput.press('Enter');
    }

    await this.publishButton.click();
  }

  async editArticle(updatedTitle: string, updatedBody: string) {
    // Wait for existing article data to populate the form before clearing/filling
    await expect(this.titleInput).not.toHaveValue('');
    await this.titleInput.fill(updatedTitle);
    await this.bodyInput.fill(updatedBody);
    await this.publishButton.click();
  }
}