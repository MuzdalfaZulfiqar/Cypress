/// <reference types="cypress" />

describe('DevSta Data-Driven Login – CSV file', () => {
    let csvRows = [];
  
    before(() => {
      cy.task('parseCsv', 'login_data.csv').then((rows) => {
        csvRows = rows;
        cy.log(`Loaded ${rows.length} rows from login_data.csv`);
  
        rows.forEach((row, idx) => {
          cy.log(
            `Row ${idx + 1} -> email: "${row.email}", password: "${row.password}", expected: "${row.expected}"`
          );
        });
      });
    });
  
    it('shows all CSV datasets in Cypress log', () => {
      expect(csvRows, 'CSV rows loaded')
        .to.be.an('array')
        .and.not.empty;
  
      cy.log('Data sets from CSV (trimmed view):');
      csvRows.forEach((row, index) => {
        const email = (row.email || '').trim();
        const password = (row.password || '').trim();
        const expected = (row.expected || '').trim();
  
        cy.log(
          `Row ${index + 1}: email=${email}, password=${password}, expected=${expected}`
        );
      });
    });
  
    it('tries multiple INVALID login credentials from CSV and stays on /login', () => {
      const invalidRows = csvRows.filter(
        (row) => (row.expected || '').toLowerCase().trim() !== 'success'
      );
  
      expect(invalidRows, 'invalid rows')
        .to.be.an('array')
        .and.not.empty;
  
      cy.wrap(invalidRows).each((row) => {
        const email = (row.email || '').trim();
        const password = (row.password || '').trim();
  
        cy.log(
          `Testing INVALID dataset: "${email}" / "${password}" (expected: error)`
        );
  
        cy.devstaVisitLogin();
  
        cy.devstaFillLoginForm(email, password);
        cy.devstaSubmitLogin();
  
        cy.url({ timeout: 10000 }).should('include', '/login'); 
  
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
  
        cy.wait(1500);
      });
    });
  
    it('performs VALID login using success row from CSV and lands on dashboard', () => {
     
      const successRow = csvRows.find(
        (row) => (row.expected || '').toLowerCase().trim() === 'success'
      );
  
      expect(successRow, 'success row in CSV').to.exist;
  
      const email = (successRow.email || '').trim();
      const password = (successRow.password || '').trim();
  
      cy.log(
        `Testing SUCCESS dataset from CSV: "${email}" / "${password}" (expected: dashboard)`
      );
  
      cy.log(`Email length = ${email.length}`);
      cy.log(`Password length = ${password.length}`);
  
      cy.clearCookies();
      cy.clearLocalStorage();
  
      cy.devstaVisitLogin();
      cy.devstaFillLoginForm(email, password);
      cy.devstaSubmitLogin();
  
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
      cy.contains('Welcome', { timeout: 20000 }).should('exist');
  
      cy.contains('Community').should('be.visible'); // sidebar item exists
  
      cy.wait(2000);
    });
  
    // Clean up session at the end – shows you can reset state
    it('clears auth at the end of CSV-driven tests', () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.log('Cleared cookies & localStorage after CSV tests');
    });
  });
  