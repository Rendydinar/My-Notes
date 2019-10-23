const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../config/db-config');
const fs = require('fs');

// Fungsi untuk membuat direktori user
const makeUserDirektori = (email) => (new Promise((resolve, reject) => {
	db.query('SELECT * FROM user WHERE email = ?', [String(email)], (err, user) => {
		if(err) reject(err);	
		else {
			console.log(typeof(String(user[0].id)));
			fs.mkdir(`file/users/${String(user[0].id)}`, (err, results) => {
				if(err) reject(err);
				else resolve(results);
			});
		}	
 	});
}));

// Fungsi Mencari Email Di Database
const findUserEmail = (emailRegister) => (new Promise((resolve, reject) => {
	db.query('SELECT * FROM user WHERE email = ?  ', [String(emailRegister)], (err, results) => {
		if(err) reject(err); 
		else resolve(results);
	});
}));

// Fungsi Menambah User Di Database
const registerAccount = (name, email, password) => (new Promise((resolve, reject) => {
	db.query('INSERT INTO user (name, email, password) VALUES(?,?,?)',[String(name), String(email), String(password)], (err, results) => {
		if(err) reject(err);
		else 
			resolve(results);
	});
}));

// Fungsi untuk menghashing password user
const handlePasswordHash = (passowrd) => (new Promise((resolve, reject) => {
	bcrypt.genSalt(15, (err, salt) => {
		bcrypt.hash(passowrd, salt, (err, hash) => {
			if(err) reject(err);
			else resolve(hash);
		});
	});
}));

// Fungsi untuk merender root view
async function renderRootPage(req, res, next) {
	res.render('root');
}

// Fungsi untuk merender login view
async function renderLoginPage(req, res, next) {
	res.render('user-login', { csrfToken: req.csrfToken() });
}

// Fungsi untuk merender register view
async function renderRegisterPage(req, res, next) {
	res.render('user-register', { csrfToken: req.csrfToken() });
}

// Fungsi untuk menghandle login submit
async function handleLoginSubmit(req, res, next) {
  passport.authenticate('local', { failureRedirect: '/login' }),
	  function(req, res) {
	    res.redirect('/');
  };
	// authentikasi login 
	passport.authenticate('local', {
		successRedirect: '/user/dashboard', // jika berhasil login 
		failureRedirect: '/login', // jika gagal login
		failureFlash: true
	})(req, res, next); 
}

// Fungsi untuk menghandle register submit
async function handleRegisterSubmit(req, res, next) {
	try {
		const { name, email, password, confirm_password } = req.body;
		let errors = [];

		// validasi 
		if(!name || !email || !password || !confirm_password) {
			errors.push({ msg: 'Tolong Masukan Formulir Register Dengan Lengkap!' });
			console.log('error formulir register tidak lengkap');
		}

		if(password !== confirm_password) {
			errors.push({ msg: 'Password Tidak Sama!' });
			console.log('error password register tidak sama');
		}

		if(password.length <= 6) {
			errors.push({ msg: 'Password Harus Lebih Dari 6 Karakter!' });
			console.log('error password register <= 6');
		}

		if(email.indexOf('@') === -1 || email.indexOf('.') === -1) {
			errors.push({ msg: 'Email Tidak Benar' });
			console.log('error email register tidak benar');
		}

		if(password.search(/[0-9]/) == -1) {
			errors.push({ msg: 'Password Harus Mempunyai Angka' });
			console.log('error password register tidak valid');
		}

		if(password.search(/[a-zA-Z]/) == -1) {
			errors.push({ msg: 'Password Harus Mempunyai Karakter/Huruf' });
			console.log('error password register tidak valid');
		}

		const getEmailInfo = await findUserEmail(email); // ambil seluruh email yang sudah terdaftar
 
		if(getEmailInfo.length !== 0) {
			// jika email sudah terdaftar
 			errors.push({ msg: 'Email Sudah Terdaftar Di Akun Lain, Silakan Ganti Email!' });
			console.log('error register email sudah terdaftar');
		}

		if(errors.length > 0 ) {
			// Kembalikan pesan kesalahan register kepada user
			// gagalkan register
			res.render('user-register', { csrfToken: req.csrfToken(), errors, name, email, password, confirm_password });
		} else {
			// Akun siap didaftarkan
 	    	passwordHash = await handlePasswordHash(password); // buat hash untuk password user
 	    	// Promise untuk menyimpan akun user di database dan membuat direktori user
			const resultRegisterAccountAndMakeUserDirektori = await Promise.all([ registerAccount(name, email, passwordHash), makeUserDirektori(email) ]); 
			if(resultRegisterAccountAndMakeUserDirektori[0].affectedRows === 1) {
				// akun sudah terdaftar pergi ke halaman login untuk login
				req.flash('success_msg', 'Anda Telah Berhasil Register, Silakan Lakukan Login Akun Baru');
                res.redirect('/login');
			}
	    }
	} catch(err) {
		// 505 Status Code 
		console.log('Error => ', err);
		next(err);
	}
}

// exports
module.exports = {
	renderRootPage,
	renderLoginPage,
	renderRegisterPage,
	handleLoginSubmit,
	handleRegisterSubmit
};
 
