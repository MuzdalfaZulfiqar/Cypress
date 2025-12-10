
/// <reference types="cypress" />
describe("Dashboard – Announcements Display Test", () => {
  const announcementsData = [
    {
      _id: "ann1",
      title: "Welcome to DevSta!",
      message: "This announcement is mocked by Cypress!",
      category: "general",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "ann2",
      title: "New Feature",
      message: "Check out our new dashboard feature.",
      category: "update",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "ann3",
      title: "Maintenance Notice",
      message: "Scheduled maintenance on 10th Dec",
      category: "alert",
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "/api/users/announcements", {
      statusCode: 200,
      body: announcementsData,
    }).as("getAnnouncements");
    cy.fixture("loginData").then((data) => {
      cy.visit("/login");
      cy.get("input[name=email]").type(data.valid.email);
      cy.get("input[name=password]").type(data.valid.password);
      cy.get("button[type=submit]").click();
      cy.url({ timeout: 15000 }).should("include", "/dashboard");
    });
    cy.wait("@getAnnouncements");
  });

  it("displays all announcements from the array/object", () => {
    announcementsData.forEach((ann) => {
      cy.contains(ann.title).should("be.visible");
      cy.contains(ann.message).should("be.visible");
    });
  });
});
