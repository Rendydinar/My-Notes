const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db-config');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			console.log(email);
			console.log(password);
			// cari user di database
			db.query('SELECT * FROM user WHERE email = ? LIMIT 1', [String(email)], (err, user) => {
				if(user.length < 1) {
					console.log('Error => Email belum terdaftar');
					// Email akun belum terdaftar
					// Kembalikan error
					return done(null, false, { message: 'Password atau email anda salah' });
				} else {
					// Email akun user ada 
					// Tinggal kita cocokan password
					bcrypt.compare(password, user[0].password, (err, isMatch) => {
						if(err) throw err; // 500 status code
						if(isMatch) {
							// password user benar
							// kembalikan data milik user dan user memiliki session
							return done(null, user[0]);
						} else {
							// password user salah
							// kembalikan error
							return done(null, false, { message: 'Password atau email anda salah' });
						}
					});
				}
			});
		})
	);

	// serializeUser
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// deserializeUser
	passport.deserializeUser((id, done) => {
		db.query('SELECT * FROM user WHERE id = ? LIMIT 1', [Number(id)], (err, user) => {
			done(err, user[0]);
		});
	});
};
