/**
 * Given a coverage amount, returns a sanity state rating
 * @param coverage
 * @returns {Array}
 */
function sanityState (coverage) {
  return coverage > .8 ? 'Sane'.rainbow : 'Needs Help!'.yellow
}

module.exports = sanityState