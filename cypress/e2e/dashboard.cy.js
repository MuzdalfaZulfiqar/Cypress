
/// <reference types="cypress" />

describe("Testing Profile - Edit Profile: Resume Upload", () => {
    
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

    it("Testing if the user can replace resume", () => {
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

    it("Testing if the user can edit the profile fields", () => {
        cy.contains("Profile").click();
        cy.get('#root div.py-2 button:nth-child(2)').click();
        cy.get('#root main.px-4').click();
        cy.get('#root div.gap-10 > div:nth-child(1) > div.items-center > button.transition > svg.lucide').click();
        cy.get('#root [name="phone"]').click();
        cy.get('#root div:nth-child(1) > div.grid').click();
        cy.get('#root [name="phone"]').clear();
        cy.get('#root [name="phone"]').type('03456526272');
        cy.get('#root svg.lucide-check').click();
        cy.get('#root div:nth-child(4) svg.lucide').click();
        cy.get('#root button:nth-child(6)').click();
        cy.get('#root div:nth-child(4) div.flex-wrap').click();
        cy.get('#root button:nth-child(15)').click();
        cy.get('#root button.gap-1\\.5').click();
        cy.get('#root input.border').click();
        cy.get('#root input.border').type('TS');
        cy.get('#root button.rounded-lg.text-white').click();
        cy.get('#root button.px-6').click();
        cy.get('#root button.bg-transparent').click();
        cy.get('#root div.flex.px-4 button:nth-child(1)').click();
});
});