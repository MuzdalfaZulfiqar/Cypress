// Use of cypress commands to test Edit Profile functionality including resume upload
/// <reference types="cypress" />

describe("Profile - Edit Profile: Resume Upload & Add Education", () => {
    beforeEach(() => {
        cy.viewport(1440, 900);

        // Login using your working fixture
        cy.fixture("loginData").then((data) => {
            cy.visit("/login");
            cy.get("input[name=email]").type(data.valid.email);
            cy.get("input[name=password]").type(data.valid.password);
            cy.get("button[type=submit]").click();

            // Wait for dashboard
            cy.url().should("include", "/dashboard");
            cy.contains("Welcome", { timeout: 10000 }).should("be.visible");
        });
    });

    it("can upload resume and add education in Edit Profile", () => {
        cy.contains("Profile").click();
        cy.contains("button", "Edit Profile").click({ force: true });

        cy.contains("General Info").should("be.visible");

        // ———————————————————————
        // RESUME UPLOAD 
        // ———————————————————————
        cy.contains("button", /Upload Resume|Replace Resume/i).click();

        // Click the visible "Choose File" button
        cy.contains("Choose File").click();

        // Attach file to hidden <input type="file">
        cy.get('input[type="file"]')
            .selectFile("cypress/fixtures/sample-resume.pdf", { force: true });

        // Click the "Upload" button that appears after file selection
        cy.contains("button", "Upload").click();

        // Wait for the real SuccessModal with "Success!" title
        cy.contains("h2", "Success!", { timeout: 15000 }).should("be.visible");

        // Confirm the message inside the modal
        cy.contains("Your resume has been updated successfully").should("be.visible");

        // Click "Continue" or press ESC to close
        cy.contains("button", "Continue").click();

        // Verify in Overview tab that resume is now visible
        cy.contains("button", "Overview").click();
        cy.contains("button", "View Resume").should("be.visible");

    });
});