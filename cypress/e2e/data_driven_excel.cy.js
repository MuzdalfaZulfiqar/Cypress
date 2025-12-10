
/// <reference types="cypress" />

describe('DevSta Community – Data-driven Explore search using Excel', () => {
    let excelRows = [];

    before(() => {
      cy.task('parseExcel', 'search_keywords.xlsx').then((rows) => {
        excelRows = rows || [];
        cy.log(`Loaded ${excelRows.length} rows from search_keywords.xlsx`);
  
        excelRows.forEach((row, index) => {
          cy.log(`Row ${index + 1}: ${JSON.stringify(row)}`);
        });
      });
    });

    beforeEach(() => {
      cy.devstaLoginToDashboard();          
      cy.devstaOpenCommunityFromSidebar();  
  
      cy.contains('Filters').should('be.visible');
      cy.get('input[placeholder*="Search"]')
        .first()
        .should('be.visible');
    });
  
    it('filters Community → Explore using keywords from Excel', () => {
      expect(excelRows, 'Excel rows loaded')
        .to.be.an('array')
        .and.not.empty;

      const getKeywordKey = (row) =>
        Object.keys(row).find((k) => k.toLowerCase().includes('keyword'));
  
      const getExpectedNameKey = (row) =>
        Object.keys(row).find((k) => k.toLowerCase().includes('expectedname'));

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

          if (!r.keyword || r.keyword.length === 0) return false;

          if (/^-+\s*$/.test(r.keyword)) return false;
  
          return true;
        });
  
      // Now we must have Hadia + Muzdalfa rows
      expect(cleanRows, 'Usable Excel rows')
        .to.be.an('array')
        .and.not.empty;
  
      cy.log(`Using ${cleanRows.length} keyword rows from Excel`);
  
      cy.wrap(cleanRows).each((row) => {
        const { keyword, expectedName } = row;
  
        cy.log(
          `🔍 Searching for keyword: "${keyword}"` +
            (expectedName ? ` → expecting: "${expectedName}"` : '')
        );

        cy.devstaOpenCommunityTab('Explore');
        cy.contains('Filters').should('be.visible');
 
        cy.get('input[placeholder*="Search"]')
          .first()
          .scrollIntoView()
          .click({ force: true })
          .clear({ force: true })
          .type(keyword, { force: true });
  
        cy.wait(4000);
  
        if (expectedName) {

          cy.contains('.developer-card, .user-card, .flex', expectedName, {
            timeout: 10000,
          }).should('be.visible');
        } else {
          cy.get('.developer-card, .user-card, .flex')
            .should('exist')
            .and('be.visible');
        }
  
        cy.wait(1500);
      });
    });
  });
  