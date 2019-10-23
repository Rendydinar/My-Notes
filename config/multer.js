const multer = require('multer');

// reqex to match just file extension
const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

const storage = multer.diskStorage({
	
	destination: (req, file, cb) => {
		cb(null, `file/users/${String( req.session.passport.user )}`);
	}, 
	filename: (req, file, cb) => {
		const date  = new Date();
		const newFileName = date.getTime() + file.originalname.match(fileExtensionPattern)[0];
		cb(null, newFileName);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
			if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
				 // file berupa gambar
            	cb(null, true); 
			} 
			else {
				cb(null, false);
				return cb(new Error({ msg: 'File Harus Berformat .jpg, .png, .jpeg, .gif' }));
			} 
	}
});

module.exports = {
	upload
}