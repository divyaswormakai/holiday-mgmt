const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/keys');
const Admin = require('../models/Admin');

module.exports = async (request, response, next) => {
	try {
		const token = request.header('x-auth-token');

		if (!token) {
			throw new Error('You are not authorized. Use an admin account.');
		}

		const decodedToken = jwt.verify(token, secret);
		const admin = await Admin.findById(decodedToken.id);
		if (!admin) {
			throw new Error('Cannot find admin account.');
		}
		request.admin = admin;

		next();
	} catch (err) {
		return response.status(400).send({ error: err.message });
	}
};
