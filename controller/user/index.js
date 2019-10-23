const db = require('../../config/db-config');
const moment = require('moment');

// Fungsi mengambil informasi akun user di database
const getUserInfo = (id) => (new Promise((resolve, reject) => {
	db.query('SELECT * FROM user WHERE id = ?', [id], (err, user) => {
		if(err) reject(err);
		else resolve(user[0]);
	});
}));

// Fungsi mengupdate url image profile user
const updateImgUrlProfile = (id, url) => (new Promise((resolve, reject) => {
	db.query('UPDATE user SET file_image_profile_url = ? WHERE id = ?', [ String(url), Number(id) ], (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi mengupdate user name 
const updateUserName = (id, name) => (new Promise((resolve, reject) => {
	db.query('UPDATE user SET name = ? WHERE id = ?', [ String(name), Number(id) ] , (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi mengupdate user bio
const updateUserBio = (id, bio) => (new Promise((resolve, reject) => {
	db.query('UPDATE user SET bio = ? WHERE id = ?', [ String(bio), Number(id) ], (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi mengupdate user hobby
const updateUserHobby = (id, hobby) => (new Promise((resolve, reject) => {
	db.query('UPDATE user SET hobby = ? WHERE id = ?', [ String(hobby), Number(id) ], (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi untuk menambakan note user
const addUserNote = (id, judul, content, kategori, file_image_note_url) => (new Promise((resolve, reject) => {
	const created = moment().format('llll'); // set format waktu buat

	db.query('INSERT INTO notes (judul, content, file_image_note_url , user_id, kategori, created) VALUES(?, ?, ?, ?, ?, ?)', [ String(judul), String(content), String(file_image_note_url), Number(id), String(kategori), String(created) ], (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi untuk mengambil seluruh notes milik user berdasarkan id user
const getAllNotes = (id) => (new Promise((resolve, reject) => {
	db.query('SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC', [ Number(id) ], (err, notes) => {
		if(err) reject(err);
		else resolve(notes);
	});
}));

//  Fungsi untuk menambil 1 note milik user berdarsarkan id
const getNoteById = (id) => (new Promise((resolve, reject) => {
	db.query('SELECT * FROM notes WHERE id = ?', [ Number(id) ], (err, note) => {
		if(err) reject(err);
		else resolve(note[0]);
	});
}));
	
		
// Fungsi untuk mengupdate note milik user
const updateUserNote = (id, judul, content, kategori, img_note_url) => (new Promise((resolve, reject) => {
	db.query('UPDATE notes SET judul = ?, content = ?, kategori = ?, file_image_note_url = ? WHERE id = ?', [ String(judul), String(content), String(kategori), String(img_note_url), Number(id) ], (err, result) => {
		if(err) reject(err); 
		else resolve(result);
	});
}));

// Fungsi menghapus note milik user
const deleteNote = (id) => (new Promise((resolve, reject) => {
	db.query('DELETE FROM notes WHERE id = ?', [ Number(id) ], (err, results) => {
		if(err) reject(err);
		else resolve(results);
	});
}));

// Fungsi untuk mengambil note milik user berdasarkan kategori
const getNoteByKategori = (user_id , kategori) => (new Promise((resolve, reject) => {
	db.query("SELECT * FROM notes WHERE user_id = ? AND kategori LIKE '%" + String(kategori) + "%' ORDER BY id DESC", [ Number(user_id) ], (err, notes) => {
		if(err) reject(err);
		else resolve(notes);
	});
}));

// Fungsi untuk merender dashboard view
async function renderDashboard(req, res, next) {
	try {
		const resultGetUserInfo = await getUserInfo(Number(req.session.passport.user)); // ambil info akun milik user
		const { name } = resultGetUserInfo;
		let file_image_profile_url = resultGetUserInfo.file_image_profile_url;

		if(file_image_profile_url === null) {
			// jika user belum memiliki foto profile
			// gunakan foto profile default untuk user
			file_image_profile_url = '/img/default-user-1494243238_350x300_.png';
		} 

		res.render('user-dashboard', { name, file_image_profile_url });
	} catch(err) {
		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
 }

// Fungsi untuk merender profile view milik user
async function renderProfile(req, res, next) {
	try {
		const resultGetUserInfo = await getUserInfo(Number(req.session.passport.user)); // ambil info akun milik user
		const { name, email } = resultGetUserInfo;
		let bio = resultGetUserInfo.bio;
		let hobby = resultGetUserInfo.hobby;
		let img_profile_url = resultGetUserInfo.file_image_profile_url;

 		if(bio === null) {
			// jika user belum mengisi bio
			// gunakan bio default
			bio = 'Tambahkan Bio Anda';
		} 

		if(hobby === null) {
			// jika user belum mengisi hobby
			// gunakan hobby default
			hobby = 'Tambahkan Hobby Anda';
		} 

		if(img_profile_url === null) {
			// jika user belum memiliki foto profile
			// gunakan foto profile default untuk user
			img_profile_url = '/img/default-user-1494243238_350x300_.png';
		} 

		res.render('user-profile', { name, email, bio: bio, hobby: hobby, img_profile_url: img_profile_url, csrfToken:  req.csrfToken() });
	} catch(err) {
		// Error Status Code 500
		console.log('Err => ', err);
		next(err);
	}	
}

// Fungsi untuk merender notes milik user berdasarkan kategori
async function renderNotesByKategori(req, res, next) {
	try {
		const { kategori } = req.query;
		const notes = await getAllNotes(req.session.passport.user); // ambil seluruh notes milik user
		const resultGetUserInfo = await getUserInfo(Number(req.session.passport.user));
		const { name } = resultGetUserInfo;
		let file_image_profile_url = resultGetUserInfo.file_image_profile_url;

		if(file_image_profile_url === null) {
			// jika user belum memiliki foto profile
			// gunakan foto profile default untuk user
			file_image_profile_url = '/img/default-user-1494243238_350x300_.png';
		} 

		if(kategori.length < 1) {
			// jika kategori tidak dimasukan
			// kembalikan pesan kesalahan pada user bahwa kategori tidak ditemukan
			req.flash('error_msg', 'Kategori Tidak Boleh Kosong!');
			res.redirect('/user/notes');
		} else {
			const resultGetNotesByKategori = await getNoteByKategori(req.session.passport.user ,kategori.toLowerCase()); // cari note bersadarkan kategori

			if(resultGetNotesByKategori.length === 0) {
				// jika kategori note tidak ditemukan
				// kembalikan pesan kesalahan pada user bahwa kategori note tidak ditemukan
				req.flash('error_msg', 'Kategori Tidak Ditemukan!');
				res.redirect('/user/notes');
			} else {
				// jika ketegori notes ada
				// kembalikan notes berdasarkan kategori yang dicari
				res.render('user-notes', { name, file_image_profile_url, csrfToken:  req.csrfToken(), notes: resultGetNotesByKategori, success_msg: `Ditemukan ${resultGetNotesByKategori.length} Notes Dengan Kategori ${kategori}` });
			}	
 		}
 	} catch(err) {
 		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}

// Fungsi untuk merender seluruh notes milik user 
async function renderAllNotes(req, res, next) {
	const resultGetAllNotes = await getAllNotes(req.session.passport.user); // ambil seluruh notes milik user
	const resultGetUserInfo = await getUserInfo(Number(req.session.passport.user)); // ambil info akun milik user
	const { name } = resultGetUserInfo;
	let file_image_profile_url = resultGetUserInfo.file_image_profile_url;

	if(file_image_profile_url === null) {
		// jika user belum memiliki foto profile
		// gunakan foto profile default untuk user
		file_image_profile_url = '/img/default-user-1494243238_350x300_.png';
	} 
	// render user notes		
	res.render('user-notes', { name, file_image_profile_url, csrfToken: req.csrfToken(), notes: resultGetAllNotes });
}

// Fungsi untuk menghandle logout user
async function handleLogout(req, res, next) {
	req.logout();
	// tampilkan pesan kepada user bahwa user berhasil login
	// sambil redirect ke rute login
	req.flash('success_msg', 'Anda Berhasil Keluar');
	res.redirect('/login');
}

// Fungsi untuk merender statistik notes milik user
async function renderStatistikNotes(req, res, next) {
	const resultGetUserInfo = await getUserInfo(Number(req.session.passport.user));
	const { name } = resultGetUserInfo;
	let file_image_profile_url = resultGetUserInfo.file_image_profile_url;

	if(file_image_profile_url === null) {
		file_image_profile_url = '/img/default-user-1494243238_350x300_.png';
	} 	
	res.render('user-statistik-notes', { name, file_image_profile_url });

	// res.render('user-statistik-notes', { data });

	
}

// Fungsi untuk menghandle update name milik user
async function handleUpdateNameSubmit(req, res, next) {
	try {
		const { name } = req.body;
	 	if(!name) {
			req.flash('error_msg', 'Nama Tidak Boleh Kosong');
			res.redirect('/user/profile');
		} else {
			const resultUpdateUserName = await updateUserName(req.session.passport.user, name); // update nama user
			// redirect ke rute profile user
			res.redirect('/user/profile');
		}
	} catch(err) {
		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}

// Fungsi untuk menghandle update foto profile milik user
async function handleUpdatePhotoProfileSubmit(req, res, next) {
	try {
		const { path } = req.file;
		fileUrl = path.substr(4, req.file.path.length); // ubah path agar dapat dibaca kedalam static file
		const resultUpdateImgUrlProfile = await updateImgUrlProfile(req.session.passport.user, fileUrl); // update url foto profile milik user
		// redirect ke rute profile user
		res.redirect('/user/profile');
	} catch (err) {
		// Error Status Code 500
		console.log(err);
		next(err);
	}
}

// fungsi untuk menghandle update bio milik user
async function handleUpdateBioSubmit(req, res, next) {
	try {
		const { bio } = req.body;

		if(!bio) {
			// jika bio kosong
			req.flash('error_msg', 'Masukan Bio Dengan Lengkap');
			res.redirect('/user/profile');
		} else {
			// update bio milik user kedalam database milik user
			const resultUpdateUserBio = await updateUserBio(req.session.passport.user, bio);  
			// redirect ke rute profile milik user
			res.redirect('/user/profile');
		}
	} catch(err) {
		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}

// Fungsi untuk menghandle update hobby milik user
async function handleUpdateHobbySubmit(req, res, next) {
	try {
		const { hobby } = req.body;

		if(!hobby) {
			// Jika hobby kosong
			req.flash('error_msg', 'Masukan Hobby Dengan Lengkap');
			res.redirect('/user/profile');
		} else {
			// Update hobby user kedalam database milik user
			const resultUpdateUserHobby = await updateUserHobby(req.session.passport.user, hobby);
			// refirect ke rute profile milik user
			res.redirect('/user/profile');
		}
	} catch(err) {
		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}

// Fungsi untuk menghandle tambah note milik user
async function handleAddNoteSubmit(req, res, next) {
	try {
		const resultGetAllNotes = await getAllNotes(req.session.passport.user);

		const { judul, content, kategori } = req.body;
		let errors = [];
		let img_note_url = req.file === undefined ? '/img/nyankomik_cover.jpg' : req.file.path.substr(4, req.file.path.length);
		
		// validasi form submit add note	 		
		if(!judul) { errors.push( 'Judul Note Harus Dimasukan' ); }
		if(!content) { errors.push( 'Content Note Harus Dimasukan' ); }
		if(!kategori) { errors.push( 'Kategori Note Harus Dimasukan' ); }

		if(errors.length > 0) { 
			// jika terjadi kesalahan
			// kembalikan pesan kesalahan kedada user, gagalkan tambah no
			req.flash('error_msg', errors.join(', '));
			res.redirect('/user/notes');
		} else {
			// tambah note milik user kedalam database
			const resultAddUserNote = await addUserNote(req.session.passport.user, judul.toUpperCase(), content, kategori.toLowerCase(), img_note_url);

			req.flash('success_msg', 'Note Berhasil Ditambahkan');
			// redirect ke rute notes milik user
			res.redirect('/user/notes');
		}

	} catch(err) {
		// Erorr Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}

// Fungsi untuk menghandle update note milik user
async function handleUpdateNoteSubmit(req, res, next) {
	const { judul, content, kategori, idNote } = req.body;
	const resultGetNoteById = await getNoteById(idNote);
 	let errors = [];
	let img_note_url = req.file === undefined ? resultGetNoteById.file_image_note_url : req.file.path.substr(4, req.file.path.length);

	// Validasi form update note
	if(!judul) { errors.push( 'Judul Note Harus Dimasukan' ); }
	if(!content) { errors.push( 'Content Note Harus Dimasukan' ); }
	if(!kategori) { errors.push( 'Kategori Note Harus Dimasukan' ); }

	if(errors.length > 0 ) {
		// Jika terjadi kesalahan
		// kembalikan pesan kesalahan kepada user, gagalkan update note
		req.flash('error_msg', errors.join(', '));
		res.redirect('/user/notes');
	} else {
		// Update note milik user kedalam database
		const resultUpdateUserNote = await updateUserNote(idNote, judul.toUpperCase(), content, kategori.toLowerCase(), img_note_url);

		req.flash('success_msg', 'Note Berhasil Diupdate');
		// redirect ke rute notes milik user
		res.redirect('/user/notes');
	}
}

// Fungsi untuk menghandle delete note milik user
async function handleDeleteNoteSubmit(req, res, next) {
	try {
		const { id } = req.body;
		if(!id) {
			req.flash('error_msg','Note Tidak Ditemukan!');
			res.redirect('/user/notes');
		} else {
			// hapus note milik user didalam database
			const resultDeleteNote = await deleteNote(id);

			req.flash('success_msg', 'Note Berhasil Dihapus');
			// redirect ke rute notes
			res.redirect('/user/notes');
		}
	} catch(err) {
		// Error Status Code 500
		console.log('Error => ', err);
		next(err);
	}
}


// exports
module.exports = {
	renderDashboard,
	renderProfile,
	renderNotesByKategori,
	renderAllNotes,
	handleLogout,
	renderStatistikNotes,
	handleUpdateNameSubmit,
	handleUpdatePhotoProfileSubmit,
	handleUpdateBioSubmit,
	handleUpdateHobbySubmit,
	handleAddNoteSubmit,
	handleUpdateNoteSubmit,
	handleDeleteNoteSubmit
}; 
 