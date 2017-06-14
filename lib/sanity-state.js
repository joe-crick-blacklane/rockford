/**
 * Given a coverage amount, returns a sanity state rating
 * @param coverageLevel
 */
const createSanityFormatter = coverageLevel => coverage =>
  coverage >= coverageLevel ? 'Sane'.rainbow : 'Needs Help!'.red

module.exports = createSanityFormatter