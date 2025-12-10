/// <reference types="cypress" />

describe("DevSta Login Tests", () => {
  beforeEach(() => {
    cy.devstaVisitLogin();
  });

  it("Login page loads correctly", () => {
    cy.get("input[name=email]").should("exist");
    cy.get("input[name=password]").should("exist");
  });

  it("Login fails with invalid credentials (fixture)", () => {
    cy.devstaTryInvalidLogins();
  });

  it("Login with valid credentials", () => {
    cy.devstaFillLoginForm(
      Cypress.env("validEmail"),
      Cypress.env("validPassword")
    );
    cy.devstaSubmitLogin();
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.contains("Welcome", { timeout: 10000 }).should("be.visible");
  });
});

