import { test, expect } from '@playwright/test';
import { ConduitApi } from '../../src/api/conduit.api';
import { generateArticle, generateUser } from '../../src/utils/data_generator';

test.describe('API: User Registration & Article CRUD Lifecycle', () => {
  test('registers a user and completes full article CRUD via REST API', async ({ request }) => {
    const api = new ConduitApi(request);

    // 1. Register a new user and verify payload
    const userPayload = generateUser('apiuser');
    const { response: regResponse, session } = await api.registerUser(userPayload);
    expect(regResponse.status()).toBe(201);

    const regBody = await regResponse.json();
    expect(regBody.user.email).toBe(userPayload.email);
    expect(regBody.user.username).toBe(userPayload.username);
    expect(regBody.user.token).toBeTruthy();

    // 2. CREATE Article
    const initialArticle = generateArticle('API CRUD');
    const createRes = await api.createArticle(session.token, initialArticle);
    expect(createRes.status()).toBe(201);

    const createdBody = await createRes.json();
    const slug = createdBody.article.slug;
    expect(slug).toBeTruthy();
    expect(createdBody.article.title).toBe(initialArticle.title);
    expect(createdBody.article.description).toBe(initialArticle.description);
    expect(createdBody.article.body).toBe(initialArticle.body);
    expect(createdBody.article.author.username).toBe(userPayload.username);

    // 3. READ Article
    const getRes = await api.getArticle(slug, session.token);
    expect(getRes.status()).toBe(200);
    const fetchedBody = await getRes.json();
    expect(fetchedBody.article.slug).toBe(slug);
    expect(fetchedBody.article.title).toBe(initialArticle.title);

    // 4. UPDATE Article
    const updatedTitle = `${initialArticle.title} - Edited`;
    const updatedBodyText = 'Updated article body via PUT request.';
    const updateRes = await api.updateArticle(session.token, slug, {
      title: updatedTitle,
      description: initialArticle.description,
      body: updatedBodyText,
    });
    expect(updateRes.status()).toBe(200);

    const updatedBody = await updateRes.json();
    const newSlug = updatedBody.article.slug;
    expect(updatedBody.article.title).toBe(updatedTitle);
    expect(updatedBody.article.body).toBe(updatedBodyText);

    // 5. DELETE Article & Verify 404
    const deleteRes = await api.deleteArticle(session.token, newSlug);
    expect(deleteRes.status()).toBe(204);

    const verifyDeletedRes = await api.getArticle(newSlug);
    expect(verifyDeletedRes.status()).toBe(404);
  });
});