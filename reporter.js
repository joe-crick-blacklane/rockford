const cliff = require('cliff')

/**
 * A simple reporter for Rockford data
 * @param data
 */
module.exports = function (data) {
  const rows = [
    ['File',  'Coverage', 'Status']
  ];
  console.log(cliff.stringifyRows(rows.concat(data), ['red', 'blue', 'cyan']));
}
