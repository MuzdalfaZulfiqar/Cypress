/// <reference types="cypress" />

describe("API Mocking – Notifications Bell Test", () => {
    const mockList = [
        {
            _id: "n1",
            message: "A new developer sent you a connection request!",
            createdAt: new Date().toISOString(),
            read: false,
        },
        {
            _id: "n2",
            message: "Someone commented on your post.",
            createdAt: new Date().toISOString(),
            read: false,
        },
        {
            _id: "n3",
            message: "Your profile verification is in review.",
            createdAt: new Date().toISOString(),
            read: false,
        },
    ];

    beforeEach(() => {
        cy.viewport(1440, 900);

        cy.intercept("GET", "/api/notifications", {
            statusCode: 200,
            body: { items: mockList },
        }).as("getNotifications");

        cy.fixture("loginData").then((data) => {
            cy.visit("/login");

            cy.get("input[name=email]").type(data.valid.email);
            cy.get("input[name=password]").type(data.valid.password);
            cy.get("button[type=submit]").click();

            cy.url().should("include", "/dashboard");
        });

        cy.wait(1000);
        cy.wait("@getNotifications");
    });

    it("Shows correct unread count on bell", () => {
        cy.get("button.relative:has(svg)").first()
            .find("span")
            .contains(mockList.length)
            .should("be.visible");
    });

    it("Opens dropdown and shows mocked notifications", () => {
        cy.get("button.relative:has(svg)").first().click({ force: true });

        mockList.forEach((n) => {
            cy.contains(n.message).should("be.visible");
        });
    });
});
