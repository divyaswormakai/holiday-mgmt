require('dotenv').config();

module.exports = {
	mongoURI: process.env.MONGO_URI,
	saltRound: 10 || process.env.SALTROUND,
	secret: process.env.SECRET || 'holidaymgmt',
	adminSaltRound: 13,
};
