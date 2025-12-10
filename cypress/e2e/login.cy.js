
/// <reference types="cypress" />

describe("DevSta Login Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.viewport(1440, 900); // optional for desktop layout
  });

  it("Login page loads correctly", () => {
    cy.get("input[name=email]").should("exist");
    cy.get("input[name=password]").should("exist");
  });

  it("Login with valid credentials", () => {
    cy.fixture("loginData").then((data) => {
      cy.get("input[name=email]").type(data.valid.email);
      cy.get("input[name=password]").type(data.valid.password);
      cy.get("button[type=submit]").click();
      cy.wait(1000);

      cy.url().should("include", "/dashboard");
      cy.contains("Welcome").should("be.visible"); 
    });
  });

  it("Login fails with invalid credentials (fixture)", () => {
    cy.fixture("loginData").then((data) => {
      data.invalid.forEach((user) => {
        cy.get("input[name=email]").clear({ force: true }).type(user.email, { force: true });
        cy.get("input[name=password]").clear({ force: true }).type(user.password, { force: true });
        cy.get("button[type=submit]").click();
        cy.wait(1000);

        cy.contains("Error!").should("be.visible");
        cy.get("button").contains("Close").click({ force: true }); 
      });
    });
  });
});
