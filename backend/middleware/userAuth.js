const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/keys');
const User = require('../models/User');

module.exports = async (request, response, next) => {
	try {
		const token = request.header('x-auth-token');

		if (!token) {
			throw new Error('You are not authorized. Try again after logging in');
		}

		const decodedToken = jwt.verify(token, secret);
		const user = await User.findById(decodedToken.id);
		if (!user) {
			throw new Error('Cannot find the user account.');
		}
		request.user = user;

		next();
	} catch (err) {
		return response.status(400).send({ error: err.message });
	}
};
