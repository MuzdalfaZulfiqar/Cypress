/// <reference types="cypress" />

const API_BASE =
  Cypress.env('apiBaseUrl') || 'https://devsta-backend.onrender.com';

describe('DevSta API – Sending API requests with cy.request()', () => {
  let jwtToken;

  before(() => {
    const email = Cypress.env('validEmail');
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
      cy.log('JWT token acquired from /api/users/login');
    });
  });

  it('POST /api/users/login – UI login flow + API returns 200 and JWT', () => {
    const email = Cypress.env('validEmail');
    const password = Cypress.env('validPassword');

    cy.devstaVisitLogin();
    cy.devstaFillLoginForm(email, password);
    cy.devstaSubmitLogin();

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    cy.wait(4000);

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

  it('GET /api/users/me – dashboard UI visible + profile API returns current user', () => {
    cy.devstaLoginToDashboard();
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    cy.wait(4000);

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

  it('GET /api/connections – Community → Explore UI + connections API returns list', () => {
    cy.devstaLoginToDashboard();
    cy.devstaOpenCommunityFromSidebar();

    cy.contains('Filters', { timeout: 10000 }).should('be.visible');
    cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.get('input[placeholder="Role"]').should('be.visible');
    cy.get('input[placeholder="Skill"]').should('be.visible');

    cy.contains(/Muzdalfa Zulfiqar|Hadia Najeeb|Seed User/i).should('exist');

    cy.wait(4000);

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

  it('GET /api/notifications – dashboard UI + notifications API returns items', () => {
    cy.devstaLoginToDashboard();
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    cy.contains('Community').should('exist');

    cy.wait(4000);

    cy.request({
      method: 'GET',
      url: `${API_BASE}/api/notifications`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.exist;

      cy.log('/api/notifications response:', JSON.stringify(resp.body));
    });
  });

  it('GET /api/users/announcements – dashboard UI + announcements API returns list', () => {
    cy.devstaLoginToDashboard();
    cy.contains('Welcome', { timeout: 10000 }).should('exist');

    cy.contains('Community').should('exist');

    cy.wait(4000);

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

      cy.log('/api/users/announcements response:', JSON.stringify(resp.body));
    });
  });
});
