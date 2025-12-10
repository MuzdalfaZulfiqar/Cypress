

import './commands'
import 'cypress-file-upload';
// import 'cypress-plugin-snapshots/commands';
const { addCompareSnapshotCommand } = require('cypress-visual-regression/dist/command')

addCompareSnapshotCommand({
  capture: 'fullPage',       // take full-page screenshots
  errorThreshold: 0.01,      // 1% pixel difference allowed
  pixelmatchOptions: {
    threshold: 0             // pixelmatch threshold
  }
})