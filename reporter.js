const cliff = require('cliff')

module.exports = function (data) {

  const rows = [
    ['File',  'Coverage', 'Status']
  ];

  console.log(cliff.stringifyRows(rows.concat(data), ['red', 'blue', 'green']));
}
