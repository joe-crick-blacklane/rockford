#!/usr/bin/env node

const glob = require('glob-all')
const writeReport = require('./lib/report-writer')
const getConfig = require('./lib/config-reader')
const sanityStateFormatter = require('./lib/sanity-state')
const fileCoverageCalculator = require('./lib/file-coverage-calc')
const formatDisplay = require('./lib/display-formatter')
const config = getConfig()
const compose = require('ramda/src/compose')

const sanityState = sanityStateFormatter(config.sanityLevel)
const overallCoverage = {
  functionCount: 0,
  dbcAssertions: 0,
  reportData: []
}
const getFileCoverage = fileCoverageCalculator(overallCoverage)
const recordFileCoverage = compose(appendFileCoverageMetrics, getFileCoverage)

/**
 * Rockford - Runs a code analysis on a set of JS files to determine the DbC code coverage
 * based on simple-assertion
 */
function rockford () {
  glob.sync([config.glob]).forEach(file => {
    writeProgress()
    recordFileCoverage(file)
  })
  recordTotalCoverage(overallCoverage)
  writeReport(overallCoverage)
}

/**
 * Records file coverage for a given file
 * @param metrics
 */
function appendFileCoverageMetrics (metrics) {
  overallCoverage.reportData.push([metrics.file, formatDisplay(metrics.coverage), metrics.functions, sanityState(metrics.coverage)])
}

/**
 * Calculates the code coverage
 * @param overallCoverage
 */
function recordTotalCoverage (overallCoverage) {
  const totalCoverage = ((overallCoverage.dbcAssertions / 2) / overallCoverage.functionCount)
  overallCoverage.reportData.push(['Total'.yellow, formatDisplay(totalCoverage).yellow, overallCoverage.functionCount, sanityState(totalCoverage)])
}

/**
 * Writes out an indicator as files are processed
 */
function writeProgress () {
  process.stdout.write('.')
}

module.exports = rockford

if (require.main === module) {
  rockford()
}