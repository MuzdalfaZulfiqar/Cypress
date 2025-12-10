/// <reference types="cypress" />

describe('DevSta Community Module', () => {
    beforeEach(() => {
      cy.devstaLoginToDashboard();          
      cy.devstaOpenCommunityFromSidebar();  
    });
    it('opens Community → Explore screen from sidebar', () => {
      cy.devstaOpenCommunityTab('Explore');
  
      cy.contains('Filters').should('be.visible');
      cy.wait(4000);
      cy.get('input[placeholder*="Search"]', { 
    })
        .first()
        .should('be.visible');
  
      cy.get('input[placeholder="Role"]').should('be.visible');
      cy.get('input[placeholder="Skill"]').should('be.visible');
      cy.contains('Select Experience').should('exist');
      cy.contains('Recent').should('exist');
  
      cy.contains(/Muzdalfa Zulfiqar|Seed User 8|Rabia Najeeb|Hadia Najeeb/)
        .should('be.visible');
        cy.wait(4000);
    });
  
    it('filters Explore list by name "Hadia Najeeb"', () => {
      cy.devstaOpenCommunityTab('Explore');
      cy.contains('Filters').should('be.visible');
      cy.wait(4000);
  
      cy.get('input[placeholder*="Search"]', { 
     })
        .first()
        .scrollIntoView()
        .click({ force: true })
        .clear({ force: true })
        .type('Hadia Najeeb', { force: true });
  
      cy.wait(2000);
  
      cy.contains('div', 'Hadia Najeeb', { 
    })
        .should('be.visible');
        cy.wait(5000);
    });
  
    it('creates a post in Feed and shows it in the post list', () => {
      const postMessage = `Automation test post – ${Date.now()}`;
  
      cy.devstaOpenCommunityTab('Feed');
  
      cy.contains('button', 'Post').should('be.disabled');
  
      cy.get('textarea[placeholder*="Share something with the community"]', {
        timeout: 10000,
      })
        .scrollIntoView()
        .click({ force: true })
        .type(postMessage, { force: true });
  
      cy.contains('button', 'Post')
        .should('not.be.disabled')
        .click();
  
      cy.contains(postMessage, {}).should('be.visible');
      cy.wait(4000);
    });
  
    it('can switch between Community tabs', () => {
      cy.devstaOpenCommunityTab('Feed');
      cy.wait(4000);
      cy.devstaOpenCommunityTab('Connections');
      cy.wait(4000);
      cy.devstaOpenCommunityTab('Messaging');
      cy.wait(4000);
      cy.devstaOpenCommunityTab('Explore'); 
      cy.wait(4000);
    });
  });
  
  