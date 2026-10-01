import { defineConfig, devices } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

export const UI_BASE_URL = process.env.BASE_URL || 'https://conduit.bondaracademy.com';
export const API_BASE_URL = process.env.API_URL || 'https://conduit-api.bondaracademy.com/api';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: UI_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    headless: true,
  },
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});