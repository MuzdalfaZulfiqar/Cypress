// 1) Visit DevSta login page with desktop viewport
Cypress.Commands.add('devstaVisitLogin', () => {
  const baseUrl = Cypress.env('baseUrl') || 'https://devsta.vercel.app';

  cy.visit(`${baseUrl}/login`);
  cy.viewport(1440, 900); // same as your tests
});

// 2) Fill login form fields
Cypress.Commands.add('devstaFillLoginForm', (email, password) => {
  cy.get('input[name=email]').clear().type(email);
  cy.get('input[name=password]').clear().type(password);
});

// 3) Click the login button
Cypress.Commands.add('devstaSubmitLogin', () => {
  cy.get('button[type=submit]').click();
});

// 4) Full login flow using given email & password
Cypress.Commands.add('devstaLogin', (email, password) => {
  cy.devstaVisitLogin();
  cy.devstaFillLoginForm(email, password);
  cy.devstaSubmitLogin();
});

// 5) Login with VALID credentials from env (cypress.env.json)
Cypress.Commands.add('devstaLoginWithValidFixture', () => {
  const email = Cypress.env('validEmail');
  const password = Cypress.env('validPassword');

  cy.devstaLogin(email, password);
});

// 6) Try all INVALID logins from fixture: LoginData.json
Cypress.Commands.add('devstaTryInvalidLogins', () => {
  cy.fixture('LoginData').then((data) => {

    const invalidUsers = Array.isArray(data) ? data : data.invalid;

    // Safety check – make sure we actually have some invalid users
    expect(invalidUsers, 'invalid users in fixture').to.be.an('array').and.not.be.empty;

    invalidUsers.forEach((user) => {
      // fill form with invalid credentials
      cy.devstaFillLoginForm(user.email, user.password);
      cy.devstaSubmitLogin();

      // wait for and assert error popup
      cy.contains('Invalid credentials', { timeout: 8000 }).should('be.visible');
      cy.contains('button', 'Close').click({ force: true });

      // still on login page, inputs visible for next iteration
      cy.url().should('include', '/login');
      cy.get('input[name=email]').should('be.visible');
      cy.get('input[name=password]').should('be.visible');
    });
  });
});



/********************************
 * COMMUNITY / DASHBOARD FLOW
 ********************************/

Cypress.Commands.add('devstaLoginToDashboard', () => {
  const email = Cypress.env('validEmail');
  const password = Cypress.env('validPassword');

  cy.devstaVisitLogin();
  cy.devstaFillLoginForm(email, password);
  cy.devstaSubmitLogin();

  // URL is enough here
  cy.url({ timeout: 10000 }).should('include', '/dashboard');

  // Just check it exists, not necessarily visible at that exact millisecond
  cy.contains('Welcome', { timeout: 10000 }).should('exist');
});


Cypress.Commands.add('devstaOpenCommunityFromSidebar', () => {
  // Click the left sidebar item "Community"
  // (we don’t restrict to nav/aside anymore)
  cy.contains('a, button, li, div, span', 'Community')
    .first()
    .click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/community');
    cy.contains('Filters', { timeout: 10000 }).should('be.visible');
  
});


Cypress.Commands.add('devstaOpenCommunityTab', (tabName) => {
  // Use case-insensitive regex for tab text
  const tabRegex = new RegExp(tabName, 'i');

  cy.contains('button, [role="tab"], a', tabRegex, { timeout: 10000 })
    .click({ force: true });

  // Light sanity check that something related to that tab is visible
  if (/Explore/i.test(tabName)) {
    cy.contains('Filters', { timeout: 10000 }).should('be.visible');
  } else if (/Feed/i.test(tabName)) {
    cy.contains(/Feed/i, { timeout: 10000 }).should('exist');
  } else if (/Connections/i.test(tabName)) {
    cy.contains(/Connections/i, { timeout: 10000 }).should('exist');
  } else if (/Messaging/i.test(tabName)) {
    cy.contains(/Messaging/i, { timeout: 10000 }).should('exist');
  }
});


/********************************
 * COMMUNITY – FEED HELPERS
 ********************************/

// Open Community → Feed tab
Cypress.Commands.add('devstaOpenFeed', () => {
  cy.devstaOpenCommunityTab('Feed');

  cy.get('textarea[placeholder*="Share something with the community"]', {
    timeout: 10000,
  }).should('be.visible');
});

// Create a feed post and assert it appears in the list
Cypress.Commands.add('devstaCreateFeedPost', (message) => {
  cy.devstaOpenFeed();

  // Type message in composer
  cy.get('textarea[placeholder*="Share something with the community"]')
    .clear()
    .type(message);

  // Post button becomes enabled → click
  cy.contains('button', 'Post')
    .should('not.be.disabled')
    .click();

  // Verify that the new post appears in the feed list
  cy.contains(message, { timeout: 10000 }).should('be.visible');
});

// Token-based Auth (Captcha Bypass)


Cypress.Commands.add('devstaLoginWithToken', () => {
  const baseUrl = Cypress.env('baseUrl') || 'https://devsta.vercel.app';

  const token =
    Cypress.env('authToken') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MmU2ZjkxZTA3Y2ViZDZjZjI4MmEyZSIsImlhdCI6MTc2NTI2NTk3NywiZXhwIjoxNzY1MzUyMzc3fQ.L0Di999NSyHNVG-pF7tMx9mtW4jN-vrtw2OnfNSZKeU';

  const STORAGE_KEY = 'devsta_token';

  //  /dashboard, but inject token BEFORE the app loads
  cy.visit(`${baseUrl}/dashboard`, {
    onBeforeLoad(win) {
      win.localStorage.setItem(STORAGE_KEY, token);
    },
  });

  // route guard should consider you logged in
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
  cy.contains('Welcome', { timeout: 10000 }).should('exist');
});
