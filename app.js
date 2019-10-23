const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8000;
const fs = require('fs');
const ExpressLimmiter = require('./middleware/Express-Limmter');

// init express app
const app = express();

// Cors enable
app.use(cors());

// Protection from DDOS
app.use(ExpressLimmiter)

// Protection http using helmet
app.use(helmet());

// Enviroiment Variabel
require('dotenv').config();

// Morgan logger
app.use(morgan('dev'));

// DB config
const db = require('./config/db-config');

// Passport config
require('./config/passport')(passport);

// Cookie parser
app.use(cookieParser());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'file')));

// EJS Template Engine
app.set('view engine', 'ejs');

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session
app.use(session({
	secret: process.env.SESSION_SECRET || 'my_session_secret',
	name: process.env.SESSION_NAME || 'my_session_name',
	resave: true,
	saveUninitialized: true
})); 

// Passport midleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});
	
db.connect((err, result) => {
	if(err) {
		console.log('Database tidak terkoneksi, applikasi tidak dapat digunakan');
	} else {
     	fs.mkdir('file',(err) => {
			fs.mkdir('file/users', (err) => {
				console.log('Direktori Telah Dibuatkan');
			});
    	});
		console.log('Database terkoneksi, applikasi siap digunakan');
		// Routes
		app.use(require('./routes'));
		// buat folder user-file
	}
});

// Listen 
app.listen(PORT, () => console.log(`server running on port ${PORT}`));  