/// <reference types="cypress" />

describe("Community Connections – Cypress Studio Test", () => {

  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit("/login"); // start at login page
  });

  it("Community Filters working (recorded via Studio)", () => {
    const email = Cypress.env("validEmail")
    const password = Cypress.env("validPassword");


    cy.get('input[name="email"]').type(email, { force: true });


    cy.get('input[name="password"]').type(password, { force: true });


    cy.get('button[type="submit"]').click();


    cy.get('#root a[href="/dashboard/community"] span').click();


    cy.get('#root input[placeholder="Search Name"]').click();


    cy.get('#root input[placeholder="Search Name"]').type('Hadia{enter}');


    cy.get('#root input[placeholder="Search Name"]').click();


    cy.get('#root input[placeholder="Search Name"]').type(' Najeeb{enter}');


    cy.get('#root aside.border').click();


    cy.get('#root input[placeholder="Search Name"]').clear();


    cy.get('#root input[placeholder="Role"]').click();


    cy.get('#root input[placeholder="Role"]').type('Mobile{enter}');


    cy.get('#root input[placeholder="Role"]').click();


    cy.get('#root input[placeholder="Role"]').clear();


    cy.get('#root input[placeholder="Skill"]').click();


    cy.get('#root input[placeholder="Skill"]').type('Node{enter}');


    cy.get('#root input[placeholder="Skill"]').type('{enter}');


    cy.get('#root button.text-sm').click();
  });

});
