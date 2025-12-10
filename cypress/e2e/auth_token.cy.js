/// <reference types="cypress" />

describe('DevSta Token-based Authentication (Captcha Bypass)', () => {
    it('logs in using saved JWT token without using the login form', () => {
      // ✅ This command injects JWT → opens /dashboard directly
      cy.devstaLoginWithToken();
  
      // 👀 For instructor demo: clearly show we are on dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome', { timeout: 10000 }).should('be.visible');
      cy.wait(3000);
  
      // Optionally show we can keep using the app (e.g. open Community)
      cy.devstaOpenCommunityFromSidebar();
      cy.contains('Filters').should('be.visible');
      cy.wait(3000);
    });
  });
  
  