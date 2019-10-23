const router = require('express').Router();
const appController = require('../controller');
const { forwardAuthenticated } = require('../config/auth');
const csrf = require('csurf');

// csrf protection
const csrfProtection = csrf({cookie: true});


// App routes

// render root view
// pasang middleware forwardAuthenticated agar user tidak login ulang ketika sudah memiliki session
router.get('/', forwardAuthenticated, appController.renderRootPage);

// render login view
// pasang middleware forwardAuthenticated agar user tidak login ulang ketika sudah memiliki session
router.get('/login', forwardAuthenticated, csrfProtection, appController.renderLoginPage);

// render register view
// pasang middleware forwardAuthenticated agar user tidak login ulang ketika sudah memiliki session 
router.get('/register', forwardAuthenticated, csrfProtection, appController.renderRegisterPage);

// handle login submit
// pasang middleware forwardAuthenticated agar user tidak login ulang ketika sudah memiliki session
router.post('/login', csrfProtection, appController.handleLoginSubmit);

// handle register submit
// pasang middleware forwardAuthenticated agar user tidak login ulang ketika sudah memiliki session
router.post('/register', csrfProtection, appController.handleRegisterSubmit);

// User routes
router.use('/user', require('./users'));
 
// middleware error status code 404
router.use((req, res, next) => { res.status(404).render('404'); });

// middleware error status code 500 
router.use((err, req, res, next) => { console.log(err); console.log('Error Status Code 500, msg.err => ', err); res.status(500).render('500'); });


module.exports = router;