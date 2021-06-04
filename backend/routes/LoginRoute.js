const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { secret, adminSaltRound } = require('../config/keys');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const loginAuth = require('../middleware/loginAuth');

const multer = require('multer');
const path = require('path');
//set storage engine
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: function (req, file, cb) {
		cb(
			null,
			req.params.userID + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

//check file type
const fileFilter = (req, file, cb) => {
	if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('file type must be jpeg or png'), false);
	}
};

//init upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: fileFilter,
});

// @Route   POST api/login/admin
// @desc    Login for admin
// @access  Public
router.post('/admin', loginAuth, async (req, res) => {
	try {
		//  TODO: Profile picture
		const { username, password } = req.body;

		let admin = await Admin.findOne({ username });

		if (!admin) {
			throw new Error('Could not find admin data.');
		}
		const isPasswordCorrect = await bcrypt.compare(password, admin.password);
		admin = admin.toJSON();

		if (!isPasswordCorrect) {
			throw new Error('Password do not match.');
		}

		const tokenDetails = {
			id: admin.id,
			username: admin.username,
			fullName: admin.fullName,
		};

		const token = await jwt.sign(tokenDetails, secret);

		res
			.status(200)
			.json({ token, username: tokenDetails.username, id: tokenDetails.id });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/login/user
// @desc    Login for user
// @access  Public
router.post('/user', loginAuth, async (req, res) => {
	try {
		//  TODO: Profile picture
		const { username, password } = req.body;

		let user = await User.findOne({ username });

		if (!user) {
			throw new Error('Could not find user data.');
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		user = user.toJSON();

		if (!isPasswordCorrect) {
			throw new Error('Password do not match.');
		}

		const tokenDetails = {
			id: user.id,
			username: user.username,
			fullName: user.fullName,
		};

		const token = await jwt.sign(tokenDetails, secret);

		res
			.status(200)
			.json({ token, username: tokenDetails.username, id: tokenDetails.id });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/login/new-user
// @desc    Register a new user
// @access  Public
router.post('/new-user', upload.any(), async (req, res) => {
	try {
		const profilePicture = req.files ? req.files[0].path : null;
		const { userID } = req.params;
		const { username, password, email, fullName } = req.body;

		if (password.length < 6) {
			throw new Error('Password length should not be le');
		}

		const hashedPassword = await bcrypt.hash(password, adminSaltRound);

		const newUser = new User({
			username,
			password: hashedPassword,
			email,
			fullName,
			profilePicture,
		});

		const savedUser = await newUser.save();
		if (!savedUser) {
			throw new Error('Could not register new user.');
		}
		res.status(200).json(savedUser.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
