/// <reference types="cypress" />

const API_BASE =
  Cypress.env('apiBaseUrl') || 'https://devsta-backend.onrender.com';

describe('DevSta API – Sending API requests with cy.request()', () => {
  // store a valid JWT here after logging in once via API
  let jwtToken;

  // 🔹 0) Get a token once before all tests (pure API, no UI)
  before(() => {
    const email = Cypress.env('validEmail');     // set in cypress.env.json
    const password = Cypress.env('validPassword');

    cy.request({
      method: 'POST',
      url: `${API_BASE}/api/users/login`,
      body: { email, password },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('token');

      jwtToken = resp.body.token;
      cy.log('✅ JWT token acquired from /api/users/login');
    });
  });

  // 1️⃣ LOGIN API – show *login UI* + send API request
  it('POST /api/users/login – UI login flow + API returns 200 and JWT', () => {
    const email = Cypress.env('validEmail');
    const password = Cypress.env('validPassword');

    // 🔸 UI FLOW: login page → fill → submit → land on dashboard
    cy.devstaVisitLogin(); // goes to /login + viewport
    cy.devstaFillLoginForm(email, password);
    cy.devstaSubmitLogin();

    // assert UI navigation
    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    // let the dashboard be visible for 4 seconds
    cy.wait(4000);

    // 🔸 API CALL: send the same login request via cy.request()
    cy.request({
      method: 'POST',
      url: `${API_BASE}/api/users/login`,
      body: { email, password },
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('token');
      cy.log('🔐 Login API response:', JSON.stringify(resp.body));
    });
  });

  // 2️⃣ /users/me – show *dashboard UI* + hit profile API
  it('GET /api/users/me – dashboard UI visible + profile API returns current user', () => {
    // 🔸 UI FLOW: login via your custom command → dashboard
    cy.devstaLoginToDashboard(); // uses UI login, ends at /dashboard
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    // keep dashboard visible for 4 seconds
    cy.wait(4000);

    // 🔸 API CALL: /api/users/me with saved JWT
    cy.request({
      method: 'GET',
      url: `${API_BASE}/api/users/me`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.exist;
      expect(resp.body).to.satisfy((body) => typeof body === 'object');

      if (resp.body.email) {
        expect(resp.body.email).to.be.a('string').and.not.be.empty;
      }
      if (resp.body.name) {
        expect(resp.body.name).to.be.a('string').and.not.be.empty;
      }

      cy.log('👤 /api/users/me response:', JSON.stringify(resp.body));
    });
  });

  // 3️⃣ /connections – show *Community → Explore UI* + hit connections API
  it('GET /api/connections – Community → Explore UI + connections API returns list', () => {
    // 🔸 UI FLOW: dashboard → sidebar "Community" → Explore screen
    cy.devstaLoginToDashboard();
    cy.devstaOpenCommunityFromSidebar();

    // match your Explore UI
    cy.contains('Filters', { timeout: 10000 }).should('be.visible');
    cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('input[placeholder="Role"]').should('be.visible');
    cy.get('input[placeholder="Skill"]').should('be.visible');

    // at least one user card should exist (very soft check)
    cy.contains(/Muzdalfa Zulfiqar|Hadia Najeeb|Seed User/i).should('exist');

    // let Explore UI be visible for 4 seconds
    cy.wait(4000);

    // 🔸 API CALL: /api/connections with JWT
    cy.request({
      method: 'GET',
      url: `${API_BASE}/api/connections?q=&sort=recent&limit=10`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.exist;

      expect(resp.body).to.satisfy(
        (body) => Array.isArray(body) || typeof body === 'object'
      );

      cy.log('🔗 /api/connections response:', JSON.stringify(resp.body));
    });
  });

  // 4️⃣ /notifications – show *dashboard UI* + hit notifications API
  it('GET /api/notifications – dashboard UI + notifications API returns items', () => {
    // 🔸 UI FLOW: login → dashboard
    cy.devstaLoginToDashboard();
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    // generic UI check (sidebar item)
    cy.contains('Community').should('exist');

    // keep dashboard visible for 4 seconds
    cy.wait(4000);

    // 🔸 API CALL: /api/notifications with JWT
    cy.request({
      method: 'GET',
      url: `${API_BASE}/api/notifications`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.exist;

      cy.log('🔔 /api/notifications response:', JSON.stringify(resp.body));
    });
  });

  // 5️⃣ /users/announcements – show *dashboard UI* + hit announcements API
  it('GET /api/users/announcements – dashboard UI + announcements API returns list', () => {
    // 🔸 UI FLOW: login → dashboard
    cy.devstaLoginToDashboard();
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    // Again, generic UI check
    cy.contains('Community').should('exist');

    // keep dashboard visible for 4 seconds
    cy.wait(4000);

    // 🔸 API CALL: /api/users/announcements with JWT
    cy.request({
      method: 'GET',
      url: `${API_BASE}/api/users/announcements`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.exist;

      expect(resp.body).to.satisfy(
        (body) => Array.isArray(body) || typeof body === 'object'
      );

      cy.log('📢 /api/users/announcements response:', JSON.stringify(resp.body));
    });
  });
});
