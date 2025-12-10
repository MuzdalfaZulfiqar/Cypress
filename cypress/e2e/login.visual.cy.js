/// <reference types="cypress" />

describe("DevSta Login Tests + Visual Regression", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.viewport(1440, 900);
  });

  it("Login page loads correctly (visual)", () => {
    cy.get("input[name=email]").should("exist");
    cy.get("input[name=password]").should("exist");

    // 🔹 Visual snapshot using cypress-visual-regression
    cy.compareSnapshot("login-page");
  });

  it("Login with valid credentials (visual dashboard check)", () => {
    cy.fixture("loginData").then((data) => {
      cy.get("input[name=email]").type(data.valid.email);
      cy.get("input[name=password]").type(data.valid.password);
      cy.get("button[type=submit]").click();

      cy.wait(2000);
      cy.url().should("include", "/dashboard");
      cy.contains("Welcome").should("be.visible");
      cy.wait(1000);

      // 🔹 Visual snapshot of dashboard after login
      cy.compareSnapshot("dashboard-after-login");
    });
  });

  it("Login fails with invalid credentials (visual error modal)", () => {
    cy.fixture("loginData").then((data) => {
      data.invalid.forEach((user, index) => {
        cy.get("input[name=email]").clear().type(user.email);
        cy.get("input[name=password]").clear().type(user.password);
        cy.get("button[type=submit]").click();

        cy.wait(1000);
        cy.contains("Error!").should("be.visible");
cy.wait(1000);
        // Visual snapshot of error modal
        cy.compareSnapshot(`login-error-modal-${index}`);

        cy.contains("Close").click({ force: true });
      });
    });
  });
});
