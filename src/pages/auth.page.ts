import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async signUp(username: string, email: string, password: string) {
    await this.page.goto('/register');
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async signIn(email: string, password: string) {
    await this.page.goto('/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoggedInAs(username: string) {
    await expect(this.page.getByRole('link', { name: username })).toBeVisible();
  }
}