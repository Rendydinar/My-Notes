const RateLimit = require('express-rate-limit');

const LimiterAPI = new RateLimit({
	// jeda block ip address
	windowMs: 10*60*1000, // 10 menit
	max: 500, // maksimal banyak request 500 per 10 menit, lebih dari itu blokir ip address selama 10 menit
	message: "Anda terlalu banyak melakukan request ke halaman ini, silakan tunggu beberapa saat"
});

module.exports = LimiterAPI;
