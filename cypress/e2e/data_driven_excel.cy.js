// /// <reference types="cypress" />

// /**
//  * DATA-DRIVEN TESTING (EXCEL)
//  *
//  * Uses a custom Cypress task:  parseExcel('search_keywords.xlsx')
//  *
//  * Actual Excel structure (from your logs):
//  *
//  * Row 1: {" keyword ": " -------- ", " expectedName ": " ----------------- "}
//  * Row 2: {" keyword ": " Hadia ",   " expectedName ": " Hadia Najeeb "}
//  * Row 3: {" keyword ": " Muzdalfa "," expectedName ": " Muzdalfa Zulfiqar "}
//  *
//  * We will:
//  *  - Dynamically detect the "keyword" and "expectedName" columns
//  *  - Trim spaces
//  *  - Skip the separator row with "--------"
//  */

// describe('DevSta Community – Data-driven Explore search using Excel', () => {
//     let excelRows = [];
  
//     // 🔹 Load & parse Excel once before all tests
//     before(() => {
//       cy.task('parseExcel', 'search_keywords.xlsx').then((rows) => {
//         excelRows = rows || [];
//         cy.log(`✅ Loaded ${excelRows.length} rows from search_keywords.xlsx`);
  
//         excelRows.forEach((row, index) => {
//           cy.log(`Row ${index + 1}: ${JSON.stringify(row)}`);
//         });
//       });
//     });
  
//     // 🔹 Before EACH test: login via UI and open Community → Explore
//     beforeEach(() => {
//       cy.devstaLoginToDashboard();          // UI login → /dashboard
//       cy.devstaOpenCommunityFromSidebar();  // sidebar → Community → Explore
  
//       cy.contains('Filters').should('be.visible');
//       cy.get('input[placeholder*="Search"]')
//         .first()
//         .should('be.visible');
//     });
  
//     it('filters Community → Explore using keywords from Excel', () => {
//       // Make sure Excel rows are loaded at all
//       expect(excelRows, 'Excel rows loaded')
//         .to.be.an('array')
//         .and.not.empty;
  
//       // Helper: find column keys even if they have spaces like " keyword "
//       const getKeywordKey = (row) =>
//         Object.keys(row).find((k) => k.toLowerCase().includes('keyword'));
  
//       const getExpectedNameKey = (row) =>
//         Object.keys(row).find((k) => k.toLowerCase().includes('expectedname'));
  
//       // Normalise & clean rows
//       const cleanRows = excelRows
//         .map((row) => {
//           const keywordKey = getKeywordKey(row);
//           const expectedKey = getExpectedNameKey(row);
  
//           const keywordRaw = keywordKey ? row[keywordKey] : '';
//           const expectedRaw = expectedKey ? row[expectedKey] : '';
  
//           const keyword = (keywordRaw || '').toString().trim();
//           const expectedName = (expectedRaw || '').toString().trim();
  
//           return { keyword, expectedName };
//         })
//         .filter((r) => {
//           // skip empty keywords
//           if (!r.keyword || r.keyword.length === 0) return false;
  
//           // skip separator row like "--------"
//           if (/^-+\s*$/.test(r.keyword)) return false;
  
//           return true;
//         });
  
//       // Now we must have Hadia + Muzdalfa rows
//       expect(cleanRows, 'Usable Excel rows')
//         .to.be.an('array')
//         .and.not.empty;
  
//       cy.log(`🧮 Using ${cleanRows.length} keyword rows from Excel`);
  
//       // 🔁 Run UI flow for each dataset
//       cy.wrap(cleanRows).each((row) => {
//         const { keyword, expectedName } = row;
  
//         cy.log(
//           `🔍 Searching for keyword: "${keyword}"` +
//             (expectedName ? ` → expecting: "${expectedName}"` : '')
//         );
  
//         // Make sure we are on Explore tab
//         cy.devstaOpenCommunityTab('Explore');
//         cy.contains('Filters').should('be.visible');
  
//         // Type keyword into Search Name input
//         cy.get('input[placeholder*="Search"]')
//           .first()
//           .scrollIntoView()
//           .click({ force: true })
//           .clear({ force: true })
//           .type(keyword, { force: true });
  
//         // wait for API + UI update
//         cy.wait(3000);
  
//         if (expectedName) {
//           // assert that the expected user appears
//           cy.contains('.developer-card, .user-card, .flex', expectedName, {
//             timeout: 10000,
//           }).should('be.visible');
//         } else {
//           // fallback: at least some results exist
//           cy.get('.developer-card, .user-card, .flex')
//             .should('exist')
//             .and('be.visible');
//         }
  
//         // small pause so instructor can see each filtered state
//         cy.wait(1500);
//       });
//     });
//   });
  

/// <reference types="cypress" />

/**
 * DATA-DRIVEN TESTING (EXCEL)
 *
 * Uses a custom Cypress task:  parseExcel('search_keywords.xlsx')
 *
 * Actual Excel structure (from your logs):
 *
 * Row 1: {" keyword ": " -------- ", " expectedName ": " ----------------- "}
 * Row 2: {" keyword ": " Hadia ",   " expectedName ": " Hadia Najeeb "}
 * Row 3: {" keyword ": " Muzdalfa "," expectedName ": " Muzdalfa Zulfiqar "}
 *
 * We will:
 *  - Dynamically detect the "keyword" and "expectedName" columns
 *  - Trim spaces
 *  - Skip the separator row with "--------"
 */

describe('DevSta Community – Data-driven Explore search using Excel', () => {
    let excelRows = [];
  
    // 🔹 Load & parse Excel once before all tests
    before(() => {
      cy.task('parseExcel', 'search_keywords.xlsx').then((rows) => {
        excelRows = rows || [];
        cy.log(`✅ Loaded ${excelRows.length} rows from search_keywords.xlsx`);
  
        excelRows.forEach((row, index) => {
          cy.log(`Row ${index + 1}: ${JSON.stringify(row)}`);
        });
      });
    });
  
    // 🔹 Before EACH test: login via UI and open Community → Explore
    beforeEach(() => {
      cy.devstaLoginToDashboard();          // UI login → /dashboard
      cy.devstaOpenCommunityFromSidebar();  // sidebar → Community → Explore
  
      cy.contains('Filters').should('be.visible');
      cy.get('input[placeholder*="Search"]')
        .first()
        .should('be.visible');
    });
  
    it('filters Community → Explore using keywords from Excel', () => {
      // Make sure Excel rows are loaded at all
      expect(excelRows, 'Excel rows loaded')
        .to.be.an('array')
        .and.not.empty;
  
      // Helper: find column keys even if they have spaces like " keyword "
      const getKeywordKey = (row) =>
        Object.keys(row).find((k) => k.toLowerCase().includes('keyword'));
  
      const getExpectedNameKey = (row) =>
        Object.keys(row).find((k) => k.toLowerCase().includes('expectedname'));
  
      // Normalise & clean rows
      const cleanRows = excelRows
        .map((row) => {
          const keywordKey = getKeywordKey(row);
          const expectedKey = getExpectedNameKey(row);
  
          const keywordRaw = keywordKey ? row[keywordKey] : '';
          const expectedRaw = expectedKey ? row[expectedKey] : '';
  
          const keyword = (keywordRaw || '').toString().trim();
          const expectedName = (expectedRaw || '').toString().trim();
  
          return { keyword, expectedName };
        })
        .filter((r) => {
          // skip empty keywords
          if (!r.keyword || r.keyword.length === 0) return false;
  
          // skip separator row like "--------"
          if (/^-+\s*$/.test(r.keyword)) return false;
  
          return true;
        });
  
      // Now we must have Hadia + Muzdalfa rows
      expect(cleanRows, 'Usable Excel rows')
        .to.be.an('array')
        .and.not.empty;
  
      cy.log(`🧮 Using ${cleanRows.length} keyword rows from Excel`);
  
      // 🔁 Run UI flow for each dataset
      cy.wrap(cleanRows).each((row) => {
        const { keyword, expectedName } = row;
  
        cy.log(
          `🔍 Searching for keyword: "${keyword}"` +
            (expectedName ? ` → expecting: "${expectedName}"` : '')
        );
  
        // Make sure we are on Explore tab
        cy.devstaOpenCommunityTab('Explore');
        cy.contains('Filters').should('be.visible');
  
        // Type keyword into Search Name input
        cy.get('input[placeholder*="Search"]')
          .first()
          .scrollIntoView()
          .click({ force: true })
          .clear({ force: true })
          .type(keyword, { force: true });
  
        // ⏳ Wait 4 seconds so API + UI update fully
        cy.wait(4000);
  
        if (expectedName) {
          // assert that the expected user appears
          cy.contains('.developer-card, .user-card, .flex', expectedName, {
            timeout: 10000,
          }).should('be.visible');
        } else {
          // fallback: at least some results exist
          cy.get('.developer-card, .user-card, .flex')
            .should('exist')
            .and('be.visible');
        }
  
        // small pause so instructor can see filtered state on screen
        cy.wait(1500);
      });
    });
  });
  