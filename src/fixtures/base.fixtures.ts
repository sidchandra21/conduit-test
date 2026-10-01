import { test as base, Page } from '@playwright/test';
import { ConduitApi, AuthSession } from '../api/conduit.api';
import { AuthPage } from '../pages/auth.page';
import { EditorPage } from '../pages/editor.page';
import { ArticlePage } from '../pages/article.page';

type ConduitFixtures = {
  api: ConduitApi;
  authPage: AuthPage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
  authSession: AuthSession;
  authenticatedPage: Page;
};

export const test = base.extend<ConduitFixtures>({
  api: async ({ request }, use) => {
    await use(new ConduitApi(request));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  // Registers a brand-new isolated user via API for the current test
  authSession: async ({ api }, use) => {
    const { session } = await api.registerUser();
    await use(session);
  },

  // Pre-authenticates the browser page via localStorage token injection
  authenticatedPage: async ({ page, authSession }, use) => {
    await page.addInitScript((token) => {
      window.localStorage.setItem('jwtToken', token);
    }, authSession.token);
    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';