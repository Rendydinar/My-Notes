module.exports = {
	// fungsi untuk melihat apakah user sudah memiliki session atau belum
	// fungsi ini untuk melindingu rute yang membutuhkan akses session
	ensureAuthenticated: (req, res, next) => {
		if(req.isAuthenticated()) {
			// user memliki session
			// user berhak mengakses endpoint routes
			return next();
		} else {
			// user belum memiliki session
			// user tidak berhak mengakses endpoint routes
			// redirect user untuk melakukan login sambil memerikan pesan kesalahan
			req.flash('error_msg', 'Silahkan lakukan login terlebih dahulu');
			res.redirect('/login');
		}
	},
	// fungsi untuk melihat apakah user suda memiliki session
	// fungsi ini untuk mencegah user melakukan login ketika user sudah memiliki session
	forwardAuthenticated: (req, res, next) => {
		if(!req.isAuthenticated()) {
			// user belum meliki session
			// user dapat lanjut mengakses rute login
			return next();
		} else {
			// user sudah mempunya session
			// user dilarang mengakses rute login untuk login ulang
			// redirect ke dashboard
			res.redirect('/user/dashboard');
		}
	}
};