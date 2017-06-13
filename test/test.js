require( './polyfills/polyfills' )()
require( './components/analytics' )()
require('./services/raygun')

const Router = require( 'routes' )
const applicationView = require('./views/application')

const router = new Router()

router.addRoute('/:lang?/?', require( './views/home' ))
router.addRoute('/:lang?/:customerType(business|personal)/book', require( './views/one-page-booking' ))
router.addRoute('/:lang?/:customerType(business|personal)/book/:bookingType/confirm', require( './views/confirm-booking' ))
router.addRoute('/:lang?/:customerType(business|personal)/thank_you*', require( './views/thank-you' ))
router.addRoute('/:lang?/:customerType(business|personal)/rides', require( './views/rides' ))
router.addRoute('/:lang?/:customerType(business|personal)/rides/:id', require( './views/rides/show' ))
router.addRoute('/:lang?/business/employees*', require( './views/business/employees' ))
router.addRoute('/:lang?/*', require( './views/home' ))

window.addEventListener( 'DOMContentLoaded', function() {
  const route = router.match( window.location.pathname )
  if (route && typeof (route.fn) === 'function') {
    route.fn(route.params)
  }

  applicationView()

})