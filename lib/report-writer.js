const cliff = require('cliff')

/**
 * A simple reporter for Rockford data
 * @param data
 */
function reporter (data) {
  const rows = [
    ['File',  'Coverage', 'Functions', 'Status']
  ];
  console.log(cliff.stringifyRows(rows.concat(data), ['red', 'blue', 'green', 'cyan']));
}

/**
 * Writes the final code coverage report
 * @param overallCoverage
 */
function writeReport(overallCoverage) {
  writeReportHeader()
  reporter(overallCoverage.reportData)
}

/**
 * Writes the report header
 */
function writeReportHeader () {
  process.stdout.write("\n")
}

module.exports = writeReport