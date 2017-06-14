const astGenerator = require('./ast-generator')
const estraverse = require('estraverse')

/**
 * Records DbC coverage for a file
 * @param overallCoverage
 */
const fileCoverageCalculator = overallCoverage => (coverage, file) => {
  const ast = astGenerator(file)
  const baseAssertionCount = overallCoverage.dbcAssertions
  const baseFunctionCount = overallCoverage.functionCount
  estraverse.traverse(ast, {
    enter: function (node) {
      incrementFunctions(node, overallCoverage)
      incrementDbcAssertions(node, overallCoverage)
    }
  })
  coverage.metrics.push({
    coverage: calculateFileCoverage(baseAssertionCount, baseFunctionCount, overallCoverage),
    functions: calculateCoverageDelta(overallCoverage.functionCount, baseFunctionCount),
    file
  })
  coverage.overallCoverage = overallCoverage
  return coverage
}

/**
 * Calculates the coverage for an individual file
 * @param baseDbcAssertions
 * @param baseFunctionCount
 * @param overallCoverage
 */
function calculateFileCoverage (baseDbcAssertions, baseFunctionCount, overallCoverage) {
  const assertions = calculateCoverageDelta(overallCoverage.dbcAssertions, baseDbcAssertions)
  const functions = calculateCoverageDelta(overallCoverage.functionCount, baseFunctionCount)
  // Take the number of assertions per file, and the number of functions. Calculate the quotient.
  return functions > 0 ? ((assertions / 2) / functions) : 0
}

/**
 * Calculates the delta between what has been marked as covered, and what was covered for a given file
 * @param overallCount
 * @param baseCount
 * @returns {number}
 */
function calculateCoverageDelta (overallCount, baseCount) {
  return Math.abs(overallCount - baseCount)
}

/**
 * Records the number of functions in the set of files
 * @param node
 * @param overallCoverage
 */
function incrementFunctions (node, overallCoverage) {
  if (isFunction(node)) {
    overallCoverage.functionCount++
  }
}

/**
 * Records the number of DbC assertions in the set of files
 * @param node
 * @param overallCoverage
 */
function incrementDbcAssertions (node, overallCoverage) {
  if (isNodeCalleeExpression(node) && isDbcCallExpression(node.expression.callee.name)) {
    overallCoverage.dbcAssertions++
  }
}

/**
 * Determines whether or not this is a callee node expression
 * @param node
 * @returns {boolean|*|Function}
 */
function isNodeCalleeExpression (node) {
  return node.type === 'ExpressionStatement' && node.expression && node.expression.callee
}

/**
 * Whether or not the call expression is a simple-assert DBC call expression
 * @param calleeName
 * @returns {boolean}
 */
function isDbcCallExpression (calleeName) {
  return calleeName === 'pre' || calleeName === 'post'
}

/**
 * Determines if a node is a function
 * @param node
 * @returns {boolean}
 */
function isFunction (node) {
  return node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression'
}

module.exports = fileCoverageCalculator