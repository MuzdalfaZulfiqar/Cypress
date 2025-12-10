/// <reference types="cypress" />

/**
 * DATA-DRIVEN TESTING (CSV)
 *
 * - Uses a custom Cypress task: parseCsv('login_data.csv')
 * - Iterates through multiple login datasets (invalid + 1 success)
 * - Drives the UI (login page) using the CSV rows
 *
 * Expected CSV shape (cypress/fixtures/login_data.csv):
 *
 * email,password,expected
 * wrong1@example.com,wrongpass,error
 * wrong2@example.com,123456,error
 * muzdalfazulfiqar11@gmail.com,muzdalfa,success
 */

describe('DevSta Data-Driven Login – CSV file', () => {
    let csvRows = [];
  
    // 🔹 Load & parse CSV once before all tests
    before(() => {
      cy.task('parseCsv', 'login_data.csv').then((rows) => {
        csvRows = rows;
        cy.log(`✅ Loaded ${rows.length} rows from login_data.csv`);
  
        // helpful debug: show raw values including any spaces
        rows.forEach((row, idx) => {
          cy.log(
            `Row ${idx + 1} -> email: "${row.email}", password: "${row.password}", expected: "${row.expected}"`
          );
        });
      });
    });
  
    // 🔹 Small “documentation” test (proves CSV really loaded)
    it('shows all CSV datasets in Cypress log', () => {
      expect(csvRows, 'CSV rows loaded')
        .to.be.an('array')
        .and.not.empty;
  
      cy.log('📄 Data sets from CSV (trimmed view):');
      csvRows.forEach((row, index) => {
        const email = (row.email || '').trim();
        const password = (row.password || '').trim();
        const expected = (row.expected || '').trim();
  
        cy.log(
          `Row ${index + 1}: email=${email}, password=${password}, expected=${expected}`
        );
      });
    });
  
    // 1️⃣ NEGATIVE CASES: all INVALID logins from CSV
    it('tries multiple INVALID login credentials from CSV and stays on /login', () => {
      const invalidRows = csvRows.filter(
        (row) => (row.expected || '').toLowerCase().trim() !== 'success'
      );
  
      expect(invalidRows, 'invalid rows')
        .to.be.an('array')
        .and.not.empty;
  
      // wrap → so Cypress queues commands correctly for each dataset
      cy.wrap(invalidRows).each((row) => {
        const email = (row.email || '').trim();
        const password = (row.password || '').trim();
  
        cy.log(
          `🚫 Testing INVALID dataset: "${email}" / "${password}" (expected: error)`
        );
  
        // fresh visit for EACH dataset
        cy.devstaVisitLogin();
  
        // fill & submit using your existing commands
        cy.devstaFillLoginForm(email, password);
        cy.devstaSubmitLogin();
  
        // UI ASSERTIONS for invalid login
        cy.url({ timeout: 10000 }).should('include', '/login'); // still on login
  
        // login form is still visible
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
  
        // small pause so instructor can SEE the UI state
        cy.wait(1500);
      });
    });
  
    // 2️⃣ POSITIVE CASE: VALID login from CSV (success row)
    it('performs VALID login using success row from CSV and lands on dashboard', () => {
      // find the row with expected=success
      const successRow = csvRows.find(
        (row) => (row.expected || '').toLowerCase().trim() === 'success'
      );
  
      // make sure CSV really has one
      expect(successRow, 'success row in CSV').to.exist;
  
      // TRIM any extra spaces from email/password (very important!)
      const email = (successRow.email || '').trim();
      const password = (successRow.password || '').trim();
  
      cy.log(
        `✅ Testing SUCCESS dataset from CSV: "${email}" / "${password}" (expected: dashboard)`
      );
  
      // extra debug to confirm there are no spaces
      cy.log(`Email length = ${email.length}`);
      cy.log(`Password length = ${password.length}`);
  
      // clean any old session before testing the success case
      cy.clearCookies();
      cy.clearLocalStorage();
  
      // UI FLOW: visit login → fill form → submit
      cy.devstaVisitLogin();
      cy.devstaFillLoginForm(email, password);
      cy.devstaSubmitLogin();
  
      // ASSERT: redirected to dashboard + Welcome text visible
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
      cy.contains('Welcome', { timeout: 20000 }).should('exist');
  
      // extra UI checks to look “complete” for instructor
      cy.contains('Community').should('be.visible'); // sidebar item exists
  
      // Let the dashboard be visible for a moment in headed mode
      cy.wait(2000);
    });
  
    // 3️⃣ Clean up session at the end – shows you can reset state
    it('clears auth at the end of CSV-driven tests', () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.log('🧹 Cleared cookies & localStorage after CSV tests');
    });
  });
  