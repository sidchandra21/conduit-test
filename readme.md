# Running the Test
* Run the entire test suite (API + E2E + Permissions) headless
npx playwright test

* Run only the pure REST API suite
npx playwright test tests/api/

* Run only the E2E UI journeys
npx playwright test tests/e2e/

* Run only the permission & ownership suite
npx playwright test tests/permissions/

* Run in interactive UI mode for debugging
npx playwright test --ui

* Open the HTML test report after a run
npx playwright show-report


# Test Organisation

├── .github/workflows/playwright.yml  # CI pipeline running on every push with HTML report artifact
├── docs/PART_2_GSP_STRATEGY.md       # Part 2: GSP scenario architectural responses
├── src/
│   ├── api/conduit.api.ts            # Typed wrapper around Playwright's APIRequestContext
│   ├── fixtures/base.fixture.ts      # Shared fixtures for Page Objects, API client, & JWT injection
│   ├── pages/                        # Page Object Model (AuthPage, EditorPage, ArticlePage)
│   └── utils/data_generator.ts       # Dynamic, collision-free test data generator
└── tests/
    ├── api/articles-crud.api.spec.ts         # Pure REST API registration & article CRUD lifecycle
    ├── e2e/auth.spec.ts                      # UI sign-up and sign-in journeys
    ├── e2e/article-lifecycle.spec.ts         # UI create → edit → verify → delete journey
    └── permissions/article-ownership.spec.ts # User A vs. User B authorization enforcement


# Prerequisites
Node.js (v18+)
npm

# Installation
npm ci
npx playwright install --with-deps chromium

# Known Limitations
Configured to run solely on Chromium 
Focused on verifying only the 'Happy Path'. No coverage for negative form validation
