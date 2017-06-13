const esprima = require('esprima')
const fs = require('fs')

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
 * @param js
 * @return {*}
 */
function parseJsFile (js) {
  return esprima.parse(js)
}

/**
 * An AST parser
 * @param filename
 * @returns {*}
 */
function astParser(filename) {
  return parseJsFile(getJsFiles(filename))
}

module.exports = astParser