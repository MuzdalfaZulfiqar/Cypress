/// <reference types="cypress" />

describe("DevSta Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Loads the DevSta homepage", () => {
    cy.contains("DevSta").should("be.visible");
  });

  it("Opens login page", () => {
    cy.contains("Login").click();
    cy.url().should("include", "/login");
  });
});
