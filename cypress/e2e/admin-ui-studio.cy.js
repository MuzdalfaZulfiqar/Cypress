/// <reference types="cypress" />

describe("Admin Panel – Stable Cypress Tests With Modal Handling", () => {

  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit("/admin");
  });

  it("Admin UI full interactions including modals", () => {

    // ===== LOGIN =====
    cy.get('#root [name="username"]').type('devsta_admin');
    cy.get('#root [name="password"]').type('SuperSecret123');
    cy.get('#root button.flex').click();

    // ===== NAVIGATE TO USERS =====
    cy.contains('a', 'Users').click();
    cy.get('tbody tr').should('have.length.greaterThan', 0);

    // ===== DELETE USER =====
    cy.get('tbody tr').last().within(() => {
      cy.get('button[title="Delete user"]').click();
    });
    // Confirm delete in modal
    cy.get('button').contains('Delete Forever').click();

    // ===== BLOCK USER =====
    cy.get('tbody tr').last().within(() => {
      cy.get('button[title="Block user"]').click();
    });
    // Confirm block in modal
    cy.get('button').contains('Confirm').click();

    // ===== UNBLOCK USER =====
    cy.get('tbody tr').last().within(() => {
      cy.get('button[title="Unblock user"]').click();
    });
    // Confirm unblock in modal
    cy.get('button').contains('Confirm').click();

    // ===== NAVIGATE TO POSTS =====
    cy.contains('a', 'Posts').click();
    cy.get('tbody tr').should('have.length.greaterThan', 0);

    // Delete post
    cy.get('tbody tr').last().within(() => {
  cy.get('button[title="Delete"]').click(); // match your React button
});

    cy.get('button').contains('Delete Forever').click();
    // ===== NAVIGATE TO REPORTS =====
    cy.contains('a', 'Reports').click();
    cy.get('div > button.flex').first().click();

    // ===== NAVIGATE TO ANNOUNCEMENTS =====
    cy.contains('a', 'Announcements').click();

    // Create a new announcement
    cy.get('input[placeholder="Platform update..."]').type('New Update');
    cy.get('div.css-se8pu2-singleValue').click();
    cy.contains('#react-select-2-option-2', 'News').click(); // category
    cy.get('textarea[placeholder="Write the announcement message..."]').type(
      'There will be a new update on 20th December 2025'
    );
    cy.get('button.bg-primary').contains('Create Announcement').click();

    // Post the first draft announcement
    cy.get('button[title="Post on Platform"]').first().click();
  });

});
