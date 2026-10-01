import { test, expect } from '../../src/fixtures/base.fixtures';
import { generateArticle, generateUser } from '../../src/utils/data_generator';

test.describe('Permissions: Article Ownership Enforcement', () => {
  test('prevents User A from editing or deleting User B article via UI and API', async ({
    api,
    page,
    articlePage,
  }) => {
    // 1. Setup State via API: Register User B (Owner) and create an article
    const { session: userB } = await api.registerUser(generateUser('userB'));
    const userBArticle = generateArticle('UserB Protected');
    const createRes = await api.createArticle(userB.token, userBArticle);
    expect(createRes.status()).toBe(201);
    const { slug } = (await createRes.json()).article;

    // 2. Setup State via API: Register User A (Non-owner / Attacker)
    const { session: userA } = await api.registerUser(generateUser('userA'));

    // 3. API Permission Check: User A attempts to PUT (edit) and DELETE User B's article
    const updateAttempt = await api.updateArticle(userA.token, slug, {
      title: 'Hacked by User A',
    });
    expect(updateAttempt.status()).toBe(403);

    const deleteAttempt = await api.deleteArticle(userA.token, slug);
    expect(deleteAttempt.status()).toBe(403);

    // 4. UI Permission Check: Log in as User A and navigate to User B's article
    await page.addInitScript((token) => {
      window.localStorage.setItem('jwtToken', token);
    }, userA.token);

    await page.goto(`/article/${slug}`);
    await articlePage.verifyArticleDetails(userBArticle.title, userBArticle.body);

    // Verify Edit and Delete controls are not rendered for non-owners
    await expect(articlePage.editButton).toBeHidden();
    await expect(articlePage.deleteButton).toBeHidden();

    // 5. State Integrity Check: Verify User B's article is still intact via API
    const checkRes = await api.getArticle(slug);
    expect(checkRes.status()).toBe(200);
    const checkBody = await checkRes.json();
    expect(checkBody.article.title).toBe(userBArticle.title);
  });
});