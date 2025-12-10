// API mocking in Cypress to test announcements display on dashboard
// and data-driven testing approach with array/object for announcements

/// <reference types="cypress" />
describe("Dashboard – Announcements Display Test", () => {
  // Defining announcement data directly in the test (data-driven approach)
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
    // 🔹 Intercept the announcements API and return data from array/object
    cy.intercept("GET", "/api/users/announcements", {
      statusCode: 200,
      body: announcementsData,
    }).as("getAnnouncements");

    // 🔹 Login via existing fixture (loginData.json)
    cy.fixture("loginData").then((data) => {
      cy.visit("/login");
      cy.get("input[name=email]").type(data.valid.email);
      cy.get("input[name=password]").type(data.valid.password);
      cy.get("button[type=submit]").click();
      cy.url({ timeout: 15000 }).should("include", "/dashboard");
    });

    // Wait for the announcements API call to complete
    cy.wait("@getAnnouncements");
  });

  it("Displays all announcements from the array/object", () => {
    // Iterate over announcementsData and assert each announcement is visible
    announcementsData.forEach((ann) => {
      cy.contains(ann.title).should("be.visible");
      cy.contains(ann.message).should("be.visible");
    });
  });
});
