#!/usr/bin/env node

const glob = require('glob-all')
const writeReport = require('./lib/report-writer')
const getConfig = require('./lib/config-reader')
const sanityStateFormatter = require('./lib/sanity-state')
const calculateFileCoverage = require('./lib/file-coverage-calc')
const formatDisplay = require('./lib/display-formatter')
const Option = require('giftbox').Option;
const config = getConfig()
const sanityState = sanityStateFormatter(config.sanityLevel)

/**
 * Rockford - Runs a code analysis on a set of JS files to determine the DbC code coverage
 * based on simple-assertion
 */
function rockford () {
  analyzeCoverageMetrics()
    .map(formatCoverageMetrics)
    .map(calculateTotalCoverage)
    .map(recordCoverageTotals)
    .map(writeReport)
}

/**
 * Analyzes every file, and returns a collection of coverage metrics
 * @returns {*}
 */
function analyzeCoverageMetrics () {
  const overallCoverage = {
    functionCount: 0,
    dbcAssertions: 0
  }
  return Option(filesUnderAnalysis().reduce(calculateFileCoverage(overallCoverage), {metrics: []}))
}

/**
 * Formats the coverage metrics for display
 * @param coverageData
 * @returns {*}
 */
function formatCoverageMetrics (coverageData) {
  coverageData.reportData = coverageData.metrics.map(metric => [metric.file, formatDisplay(metric.coverage), metric.functions, sanityState(metric.coverage)])
  return coverageData
}

/**
 * Calculates the total coverage for all files analyzed
 * @returns {*}
 */
function calculateTotalCoverage(coverageData) {
  const coverageTotals = coverageData.overallCoverage
  coverageData.totalPercent = ((coverageTotals.dbcAssertions / 2) / coverageTotals.functionCount)
  return coverageData
}

/**
 * Records coverage totals
 * @param coverageData
 * @returns {*}
 */
function recordCoverageTotals (coverageData) {
  const totalPercent = coverageData.totalPercent
  coverageData.reportData.push(['Total'.yellow, formatDisplay(totalPercent).yellow, coverageData.overallCoverage.functionCount, sanityState(totalPercent)])
  return coverageData
}

/**
 * Returns a collection of the files under analysis
 * @returns {*}
 */
function filesUnderAnalysis () {
  return glob.sync([config.glob])
}

module.exports = rockford

if (require.main === module) {
  rockford()
}