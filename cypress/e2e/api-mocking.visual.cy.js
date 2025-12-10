// /// <reference types="cypress" />
// describe("Dashboard – Announcements Display Test + Visual Regression", () => {
//   const announcementsData = [
//     {
//       _id: "ann1",
//       title: "Welcome to DevSta!",
//       message: "This announcement is mocked by Cypress!",
//       category: "general",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "ann2",
//       title: "New Feature",
//       message: "Check out our new dashboard feature.",
//       category: "update",
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "ann3",
//       title: "Maintenance Notice",
//       message: "Scheduled maintenance on 10th Dec",
//       category: "alert",
//       createdAt: new Date().toISOString(),
//     },
//   ];

//   beforeEach(() => {
//     cy.viewport(1440, 900);

//     cy.intercept("GET", "/api/users/announcements", {
//       statusCode: 200,
//       body: announcementsData,
//     }).as("getAnnouncements");

//     cy.fixture("loginData").then((data) => {
//       cy.visit("/login");
//       cy.get("input[name=email]").type(data.valid.email);
//       cy.get("input[name=password]").type(data.valid.password);
//       cy.get("button[type=submit]").click();
//       cy.url({ timeout: 15000 }).should("include", "/dashboard");
//     });

//     cy.wait("@getAnnouncements");
//   });

//   it("Displays all announcements correctly + visual snapshot", () => {
//     // Check announcements content
//     announcementsData.forEach((ann) => {
//       cy.contains(ann.title).should("be.visible");
//       cy.contains(ann.message).should("be.visible");
//     });

//     // Take visual snapshot of top viewport only
//     cy.compareSnapshot("dashboard-announcements", { capture: "viewport" });
//   });
// });


/// <reference types="cypress" />
describe("Dashboard – Announcements Display Test + Visual Regression", () => {
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
      title: "New Feature update",
      message: "Check out our new dashboard feature. on DevSta platform.",
      category: "update",
      createdAt: new Date().toISOString(),
    },
    
  ];

  beforeEach(() => {
    cy.viewport(1440, 900);

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

  it("Displays all announcements correctly + visual snapshot", () => {
    // Check announcements content
    announcementsData.forEach((ann) => {
      cy.contains(ann.title).should("be.visible");
      cy.contains(ann.message).should("be.visible");
    });
    cy.wait(1000);
    // Take snapshot of the announcements grid only
    cy.get('div.mt-8 > div.grid') // target the grid of announcement cards
      .compareSnapshot("dashboard-announcements", { capture: "viewport" });
  });
});
