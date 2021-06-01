const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Holiday = require('../models/Holiday');
const Admin = require('../models/Admin');
const { adminSaltRound } = require('../config/keys');
const User = require('../models/User');
const mongoose = require('mongoose');

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
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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

// @Route   POST api/user/:userID
// @desc    Get User data
// @access  User
router.post('/profile/:userID', async (req, res) => {
	try {
		//  TODO: Profile picture
		const { userID } = req.params;

		const user = await User.findById(userID);

		if (!user) {
			throw new Error('Could not find user data');
		}
		res.status(200).json(user.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   PUT api/user/update-password/:userID
// @desc    Update user password
// @access  User
router.put('/update-password/:userID', async (req, res) => {
	try {
		const { userID } = req.params;
		const { password } = req.body;

		const hashedPassword = await bcrypt.hash(password, adminSaltRound);

		const updatedUser = await User.findByIdAndUpdate(
			userID,
			{
				password: hashedPassword,
			},
			{ new: true }
		);
		if (!updatedUser) {
			throw new Error('Could not update profile');
		}
		res.status(200).json(updatedUser.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   PUT api/user/update-profile-photo/:userID
// @desc    Update user profile
// @access  User
router.put('/update-profile-photo/:userID', upload.any(), async (req, res) => {
	try {
		const image = req.files[0].path;
		const { userID } = req.params;

		const updatedUser = await User.findByIdAndUpdate(
			userID,
			{
				profilePicture: image,
			},
			{ new: true }
		);
		if (!updatedUser) {
			throw new Error('Could not update profile');
		}
		res.status(200).json(updatedUser.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/user/request-history/:userID
// @desc    Get Request History
// @access  User
router.post('/request-history/:userID', async (req, res) => {
	try {
		//  TODO: Profile picture
		const { userID } = req.params;

		const holidayRequests = await Holiday.find({
			employee: userID,
		})
			.populate('employee')
			.populate('decisionBy');

		if (!holidayRequests) {
			throw new Error('Could not fetch request history');
		}

		res.status(200).json(holidayRequests.map((request) => request.toJSON()));
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/user/add-request
// @desc    Add New Holiday Request for the user
// @access  User
router.post('/add-request', async (req, res) => {
	try {
		const { userID, year, department, fromDate, toDate, totalWorkingDays } =
			req.body;

		const newHolidayRequest = new Holiday({
			employee: userID,
			year,
			department,
			fromDate,
			toDate,
			totalWorkingDays,
		});
		const savedHolidayRequest = await newHolidayRequest.save();

		if (!savedHolidayRequest) {
			throw new Error('Could not fetch request history');
		}
		res.status(200).json(savedHolidayRequest.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/user/delete-request
// @desc    Add New Holiday Request for the user
// @access  User
router.delete('/delete-request/:reqID', async (req, res) => {
	try {
		const { reqID } = req.params;
		const deletedRequest = await Holiday.findByIdAndDelete(reqID);

		if (!deletedRequest) {
			throw new Error('Could not fetch request history');
		}
		res.status(200).json({ msg: 'Successfully deleted request.' });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
