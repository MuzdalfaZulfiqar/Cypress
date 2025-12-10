
const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const xlsx = require("xlsx");
// const { addMatchImageSnapshotPlugin } = require('cypress-image-diff-js/dist/plugin');
import { configureVisualRegression } from 'cypress-visual-regression'
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://devsta.vercel.app",
    chromeWebSecurity: false,
    screenshotsFolder: './cypress/snapshots/actual',

    env: {
      apiUrl: "https://devsta-backend.onrender.com",
      // SNAPSHOT_UPDATE: false
      visualRegressionType:'regression',
      visualRegressionBaseDirectory: 'cypress/snapshots/base',
      visualRegressionDiffDirectory: 'cypress/snapshots/diff',
      visualRegressionGenerateDiff: 'always',
      visualRegressionFailSilently: true
    },

    setupNodeEvents(on, config) {
    //  const { initPlugin } = require('cypress-plugin-snapshots/plugin');
    //   initPlugin(on, config);

    configureVisualRegression(on)
      // TASK: Parse CSV from fixtures
      on("task", {
        parseCsv(fileName) {
          return new Promise((resolve, reject) => {
            const filePath = path.resolve(
              __dirname,
              "cypress",
              "fixtures",
              fileName
            );

            try {
              const csvContent = fs.readFileSync(filePath, "utf8");
              const result = Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
              });

              // result.data is an array of objects → return to Cypress
              resolve(result.data);
            } catch (err) {
              console.error("Error reading CSV:", err);
              reject(err);
            }
          });
        },

        // TASK: Parse Excel from fixtures (Sheet1)
        parseExcel(fileName) {
          try {
            const filePath = path.resolve(
              __dirname,
              "cypress",
              "fixtures",
              fileName
            );

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0] || "Sheet1";
            const sheet = workbook.Sheets[sheetName];

            const jsonData = xlsx.utils.sheet_to_json(sheet, {
              defval: "", // empty cells → empty string
            });

            return jsonData; // array of row objects
          } catch (err) {
            console.error("Error reading Excel:", err);
            throw err;
          }
        },
      });

      return config;
    },
  },
});
