require('dotenv').config();

module.exports = {
	mongoURI: process.env.MONGO_URI,
	saltRound: 10 || process.env.SALTROUND,
	secret: process.env.SECRET || 'holidaymgmt',
	adminSaltRound: 13,
	aws_access_key_id: process.env.AWS_SECRET_KEY_ID,
	aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
};
