const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/keys');
const Admin = require('../models/Admin');

module.exports = async (request, response, next) => {
	try {
		const { password } = request.body;

		if (!password || password.length < 6) {
			throw new Error('Password length should be greater than 6.');
		}

		next();
	} catch (err) {
		return response.status(400).send({ error: err.message });
	}
};
