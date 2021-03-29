const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,

    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
    // add any custom configurations here
};