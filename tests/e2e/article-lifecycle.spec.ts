import { test, expect } from '../../src/fixtures/base.fixtures';
import { generateArticle } from '../../src/utils/data_generator';

test.describe('E2E: Full Article Lifecycle', () => {
  test('creates, edits, verifies, and deletes an article', async ({
    authenticatedPage,
    editorPage,
    articlePage,
  }) => {
    const article = generateArticle('E2E Lifecycle');

    // 1. Create Article & Verify
    await editorPage.createArticle(article);
    await articlePage.verifyArticleDetails(article.title, article.body);

    // 2. Edit Article & Verify Updated Content
    const updatedTitle = `${article.title} (Updated)`;
    const updatedBody = 'This article body was updated during the E2E lifecycle test.';

    await articlePage.clickEdit();
    await editorPage.editArticle(updatedTitle, updatedBody);
    await articlePage.verifyArticleDetails(updatedTitle, updatedBody);

    // 3. Delete Article & Verify Removal from Global Feed
    await articlePage.deleteArticle();
    await expect(authenticatedPage.getByText(updatedTitle)).toHaveCount(0);
  });
});