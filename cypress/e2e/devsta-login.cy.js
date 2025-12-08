// /// <reference types="cypress" />

// describe("DevSta Login Tests", () => {
//   // use our custom command before each test
//   beforeEach(() => {
//     cy.devstaVisitLogin();   // instead of cy.visit + cy.viewport
//   });

//   it("Login page loads correctly", () => {
//     cy.get("input[name=email]").should("exist");
//     cy.get("input[name=password]").should("exist");
//   });

//   // (optional but good) – invalid email format check
//   it("shows validation message for invalid email format", () => {
//     cy.get('input[name=email]')
//       .type('najeeb_hadia')
//       .blur();

//     cy.get('button[type=submit]').click();

//     cy.get('input[name=email]').then(($input) => {
//       const input = $input[0];
//       expect(input.checkValidity()).to.be.false;
//       expect(input.validity.typeMismatch).to.be.true;
//       // you can relax this line if browser wording is slightly different
//       expect(input.validationMessage).to.contain("include an '@' in the email address");
//     });
//   });

//   it("Login with valid credentials", () => {
//     // custom command that uses env validEmail/validPassword
//     cy.devstaLoginWithValidFixture();
//     cy.wait(1000);

//     cy.url().should("include", "/dashboard");
//     cy.contains("Welcome").should("be.visible");
//   });

//   it("Login fails with invalid credentials (fixture)", () => {
//     // custom command that loops through LoginData.json
//     cy.devstaTryInvalidLogins();
//   });
// });

/// <reference types="cypress" />

describe("DevSta Login Tests", () => {
  // go to login page before every test
  beforeEach(() => {
    cy.devstaVisitLogin();
  });

  it("Login page loads correctly", () => {
    cy.get("input[name=email]").should("exist");
    cy.get("input[name=password]").should("exist");
  });

  // 🔸 FIRST: check invalid credentials (fixture)
  it("Login fails with invalid credentials (fixture)", () => {
    cy.devstaTryInvalidLogins();
  });

  // 🔸 THEN: check valid credentials
  it("Login with valid credentials", () => {
    cy.devstaFillLoginForm(
      Cypress.env("validEmail"),
      Cypress.env("validPassword")
    );
    cy.devstaSubmitLogin();

    // wait for redirect to dashboard
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.contains("Welcome", { timeout: 10000 }).should("be.visible");
  });
});

