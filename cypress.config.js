// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });


const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://devsta.vercel.app",
    chromeWebSecurity: false,

    env: {
      apiUrl: "https://devsta-backend.onrender.com"
    },

    setupNodeEvents(on, config) {
      // Optional Node event listeners
    }
  }
});
