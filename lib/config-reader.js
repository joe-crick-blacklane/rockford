const defaultConfig = require('../default-config')
const fs = require('fs')

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

module.exports = getConfig