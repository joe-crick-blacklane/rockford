#!/usr/bin/env node

const glob = require('glob-all')
const writeReport = require('./lib/report-writer')
const getConfig = require('./lib/config-reader')
const sanityStateFormatter = require('./lib/sanity-state')
const getFileCoverage = require('./lib/file-coverage-calc')
const formatDisplay = require('./lib/display-formatter')
const config = getConfig()
const sanityState = sanityStateFormatter(config.sanityLevel)

const overallCoverage = {
  functionCount: 0,
  dbcAssertions: 0,
  reportData: []
}

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
 * @param file
 */
function recordFileCoverage (file) {
  const fileCoverage = getFileCoverage(file, overallCoverage)
  overallCoverage.reportData.push([file, formatDisplay(fileCoverage.coverage), fileCoverage.functions, sanityState(fileCoverage.coverage)])
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