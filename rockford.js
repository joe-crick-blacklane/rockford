#!/usr/bin/env node

const glob = require('glob-fs')({gitignore: true})
const fs = require('fs')
const esprima = require('esprima')
const estraverse = require('estraverse')
const defaultConfig = require('./default-config')
const reporter = require('./reporter')

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
  const config = getConfig()
  glob.readdirStream(config.glob, {})
    .on('data', (file) => recordFileCoverage(file))
    .on('end', () => calculateTotalCoverage())
}

/**
 * Sets Rockford's configuration
 */
function getConfig () {
  return getConfigFromArgs() || defaultConfig
}

/**
 * Gets the name of a config file from the command line args
 * @returns {*|null}
 */
function getConfigFromArgs () {
  const configFileName = process.argv[2] || '.rockford-file'
  const configFile = fs.readFileSync(configFileName, 'utf8')
  return configFileName ? JSON.parse(configFile) : null
}

/**
 * Writes out an indicator as files are processed
 */
function writeProgress () {
  process.stdout.write(".")
}

/**
 * Records DbC coverage for a file
 * @param file
 */
function recordFileCoverage (file) {
  const ast = parseJsFile(getJsFiles(file.path))
  const baseAssertionCount = overallCoverage.dbcAssertions
  const baseFunctionCount = overallCoverage.functionCount
  estraverse.traverse(ast, {
    enter: function (node) {
      writeProgress()
      recordFunctions(node)
      recordDbcAssertions(node)
    }
  })
  const fileCoverage = calculateFileCoverage(baseAssertionCount, baseFunctionCount, overallCoverage)
  overallCoverage.reportData.push([file.relative, fileCoverage, fileCoverage > .8 ? 'Sane'.rainbow : 'Needs Help!'.yellow])
}

function calculateCoverageDelta (overallCount, baseCount) {
  return Math.abs(overallCount - baseCount)
}
/**
 * Calculates the coverage for an individual file
 * @param baseDbcAssertions
 * @param baseFunctionCount
 * @param overallCoverage
 */
function calculateFileCoverage(baseDbcAssertions, baseFunctionCount, overallCoverage) {
  const assertions = calculateCoverageDelta(overallCoverage.dbcAssertions, baseDbcAssertions)
  const functions = calculateCoverageDelta(overallCoverage.functionCount, baseFunctionCount)
  return (assertions /2) / functions
}

/**
 * Writes the report header
 */
function writeReportHeader () {
  process.stdout.write("\n\n")
}
/**
 * Calculates the code coverage
 */
function calculateTotalCoverage () {
  const totalCoverage = (overallCoverage.dbcAssertions / 2) / overallCoverage.functionCount
  overallCoverage.reportData.push(['Total'.yellow, totalCoverage.toString().yellow, (totalCoverage > .8 ? 'Sane'.rainbow : 'Needs Help!').yellow])
  writeReportHeader()
  reporter(overallCoverage.reportData)
}

/**
 * Records the number of DbC assertions in the set of files
 * @param node
 */
function recordDbcAssertions (node) {
  if (node.type === 'ExpressionStatement') {
    let calleeName = node.expression.callee.name
    if (calleeName === 'pre' || calleeName === 'post') {
      overallCoverage.dbcAssertions++
    }
  }
}

/**
 * Records the number of functions in the set of files
 * @param node
 */
function recordFunctions (node) {
  if (node.type === 'FunctionDeclaration') {
    overallCoverage.functionCount++
  }
}

/**
 * Gets a file and returns its string representation
 * @param filename
 * @return {*}
 */
function getJsFiles (filename) {
  return fs.readFileSync(filename, 'utf8')
}

/**
 * Parses the file into an AST string
 * @param file
 * @return {*}
 */
function parseJsFile (file) {
  return esprima.parse(file)
}

module.exports = rockford

if(require.main === module) {
  rockford()
}