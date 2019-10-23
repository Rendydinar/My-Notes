const router = require('express').Router();
const userController = require('../../controller/user')
const { ensureAuthenticated } = require('../../config/auth');
const multer = require('../../config/multer');
const csrf = require('csurf');

// csrf protection
const csrfProtection = csrf({cookie: true});

// render user-dashboard view
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.get('/dashboard', ensureAuthenticated, userController.renderDashboard);

// render user-profile view
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.get('/profile', ensureAuthenticated, csrfProtection, userController.renderProfile);

// render user-notes view
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
// lakukan juga pengecekan apakah user ingin menampilkan notes berdasarkan kategori atau tidak
router.get('/notes', ensureAuthenticated, csrfProtection, (req, res, next) => {
	// cek properti kategori di object request
	// apakah ada properti kategori atas tidak (menandakan bahwa user ingin mencari note bersadarkan kategori)
	let reqProperti = Object.keys(req.query);
	let isGetKetegoriNote = reqProperti.includes("kategori");
	console.log(isGetKetegoriNote);

	if(isGetKetegoriNote) {
		// user ingin menampilkan notes berdasarkan kategori
		console.log('cari kategori')
		userController.renderNotesByKategori(req, res, next);
	} else {
		// menampilkan seluruh notes
		userController.renderAllNotes(req, res, next);
	}
});

// handle user-logout 
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.get('/logout', ensureAuthenticated, userController.handleLogout);

// render user-statistik-notes view
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.get('/statistik-notes', ensureAuthenticated, userController.renderStatistikNotes);

// handle update-name-user submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/update-user-name', ensureAuthenticated, csrfProtection, userController.handleUpdateNameSubmit);

// handle update-photo-profile-user submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/update-user-photo-profile', ensureAuthenticated, multer.upload.single('file_image_profile_url'), userController.handleUpdatePhotoProfileSubmit);

// handle update-bio-user submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/update-user-bio', ensureAuthenticated, csrfProtection, userController.handleUpdateBioSubmit);

// handle update-user-hobby submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/update-user-hobby', ensureAuthenticated, csrfProtection, userController.handleUpdateHobbySubmit);

// handle add-user-note submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/add-user-note', ensureAuthenticated, multer.upload.single('file_img_note_url'), userController.handleAddNoteSubmit);

// handle update-user-note submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/update-user-note', ensureAuthenticated, multer.upload.single('file_img_note_url'), userController.handleUpdateNoteSubmit);

// handle delete-user-note submit
// pasang midleware ensureAuthenticated agar user yang mengakses rute ini sudah memiliki session
router.post('/delete-user-note', ensureAuthenticated, userController.handleDeleteNoteSubmit);


module.exports = router;