/// <reference types="cypress" />

describe("Dashboard Cards Visual Regression – Base Snapshot", () => {
  beforeEach(() => {
    cy.viewport(1440, 900); // fixed viewport for consistency
    cy.fixture("loginData").then((data) => {
      cy.visit("/login");
      cy.get('input[name="email"]').type(data.valid.email);
      cy.get('input[name="password"]').type(data.valid.password);
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/dashboard");
    });
  });

  it("Take baseline snapshot of Dashboard cards", () => {
    // Make sure cards are visible
    cy.get(".grid > .relative").should("have.length.greaterThan", 0);

    // Take visual snapshot of the first row of cards (top section)
    cy.get(".grid > .relative").first().compareSnapshot("dashboard-card-base", {
      capture: "viewport", // only visible portion
    });
  });
});
