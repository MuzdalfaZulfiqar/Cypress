/// <reference types="cypress" />

describe('DevSta Community Module', () => {
    // For every test: login → go to Community → Explore
    beforeEach(() => {
      cy.devstaLoginToDashboard();          // custom command: logs in & lands on /dashboard
      cy.devstaOpenCommunityFromSidebar();  // custom command: opens Community → Explore
    });
  
    // ---------- EXPLORE: basic UI ----------
    it('opens Community → Explore screen from sidebar', () => {
      cy.devstaOpenCommunityTab('Explore');
  
      cy.contains('Filters').should('be.visible');
      cy.wait(4000);
  
      // filter inputs (using placeholders)
      cy.get('input[placeholder*="Search"]', { 
        // timeout: 10000 
    })
        .first()
        .should('be.visible');
  
      cy.get('input[placeholder="Role"]').should('be.visible');
      cy.get('input[placeholder="Skill"]').should('be.visible');
  
      // just check that experience & sort texts exist (react-select overlay issue)
      cy.contains('Select Experience').should('exist');
      cy.contains('Recent').should('exist');
  
      // at least one profile card visible
      cy.contains(/Muzdalfa Zulfiqar|Seed User 8|Rabia Najeeb|Hadia Najeeb/)
        .should('be.visible');
        cy.wait(4000);
    });
  
    // ---------- EXPLORE: search by name ----------
    it('filters Explore list by name "Hadia Najeeb"', () => {
      cy.devstaOpenCommunityTab('Explore');
      cy.contains('Filters').should('be.visible');
      cy.wait(4000);
  
      // type into the Search Name filter (first input with "Search" placeholder)
      cy.get('input[placeholder*="Search"]', { 
        // timeout: 10000
     })
        .first()
        .scrollIntoView()
        .click({ force: true })
        .clear({ force: true })
        .type('Hadia Najeeb', { force: true });
  
      // wait a bit for backend filter to respond
      cy.wait(2000);
  
      // expect that card to be visible in the list
      cy.contains('div', 'Hadia Najeeb', { 
        // timeout: 10000 
    })
        .should('be.visible');
        cy.wait(5000);
    });
  
    // ---------- FEED: create a post ----------
    it('creates a post in Feed and shows it in the post list', () => {
      const postMessage = `Automation test post – ${Date.now()}`;
  
      // go to Feed tab
      cy.devstaOpenCommunityTab('Feed');
  
      // Post button should be disabled initially
      cy.contains('button', 'Post').should('be.disabled');
  
      // type into composer
      cy.get('textarea[placeholder*="Share something with the community"]', {
        timeout: 10000,
      })
        .scrollIntoView()
        .click({ force: true })
        .type(postMessage, { force: true });
  
      // button enabled → click Post
      cy.contains('button', 'Post')
        .should('not.be.disabled')
        .click();
  
      // new post appears in feed
      cy.contains(postMessage, {}).should('be.visible');
      cy.wait(4000);
    });
  
    // ---------- TAB SWITCHING ----------
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
  
  