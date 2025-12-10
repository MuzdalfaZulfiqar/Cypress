/// <reference types="cypress" />

describe('DevSta Token-based Authentication (Captcha Bypass)', () => {
    it('logs in using saved JWT token without using the login form', () => {
      cy.devstaLoginWithToken();
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome', { timeout: 10000 }).should('be.visible');
      cy.wait(3000);
      cy.devstaOpenCommunityFromSidebar();
      cy.contains('Filters').should('be.visible');
      cy.wait(3000);
    });
  });
  
  