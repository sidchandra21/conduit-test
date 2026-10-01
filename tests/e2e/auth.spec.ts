import { test } from '../../src/fixtures/base.fixtures';
import { generateUser } from '../../src/utils/data_generator';

test.describe('E2E: Authentication Journeys', () => {
  test('allows a new user to sign up via UI', async ({ authPage }) => {
    const newUser = generateUser('uisignup');

    await authPage.signUp(newUser.username, newUser.email, newUser.password);
    await authPage.expectLoggedInAs(newUser.username);
  });

  test('allows an existing API-seeded user to sign in via UI', async ({ authPage, authSession }) => {
    const { email, password, username } = authSession.user;

    await authPage.signIn(email, password);
    await authPage.expectLoggedInAs(username);
  });
});