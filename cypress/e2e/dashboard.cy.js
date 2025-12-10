
/// <reference types="cypress" />

describe("Profile - Edit Profile: Resume Upload & Add Education", () => {
    beforeEach(() => {
        cy.viewport(1440, 900);

        cy.fixture("loginData").then((data) => {
            cy.visit("/login");
            cy.get("input[name=email]").type(data.valid.email);
            cy.get("input[name=password]").type(data.valid.password);
            cy.get("button[type=submit]").click();

            cy.url().should("include", "/dashboard");
            cy.contains("Welcome", { timeout: 10000 }).should("be.visible");
        });
    });

    it("can upload resume and add education in Edit Profile", () => {
        cy.contains("Profile").click();
        cy.contains("button", "Edit Profile").click({ force: true });

        cy.contains("General Info").should("be.visible");

        cy.contains("button", /Upload Resume|Replace Resume/i).click();

        cy.contains("Choose File").click();

        cy.get('input[type="file"]')
            .selectFile("cypress/fixtures/sample-resume.pdf", { force: true });

        cy.contains("button", "Upload").click();

        cy.contains("h2", "Success!", { timeout: 15000 }).should("be.visible");

        cy.contains("Your resume has been updated successfully").should("be.visible");

        cy.contains("button", "Continue").click();

        cy.contains("button", "Overview").click();
        cy.contains("button", "View Resume").should("be.visible");

    });
});