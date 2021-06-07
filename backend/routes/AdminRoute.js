const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Holiday = require('../models/Holiday');
const Admin = require('../models/Admin');
const { adminSaltRound } = require('../config/keys');
const User = require('../models/User');
const { DECISIONS } = require('../config/constant');
const SupportTicket = require('../models/SupportTicket');

// @Route   POST api/admin/add-admin
// @desc    Add a new admin
// @access  Admin
router.post('/add-admin', async (req, res) => {
	try {
		const { username, password, email, fullName } = req.body;

		const hashedPassword = await bcrypt.hash(password, adminSaltRound);

		const newAdmin = new Admin({
			username,
			password: hashedPassword,
			email,
			fullName,
		});

		const savedNewAdmin = await newAdmin.save();
		if (!savedNewAdmin) {
			throw new Error('Could not add new admin.');
		}
		res.status(200).json(savedNewAdmin.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/profile/:adminID
// @desc    Get Admin profile
// @access  Admin
router.post('/profile/:adminID', async (req, res) => {
	try {
		const { adminID } = req.params;

		const admin = await Admin.findById(adminID);

		if (!admin) {
			throw new Error('Could not find admin.');
		}
		res.status(200).json(admin.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/list-request
// @desc    Get List of holiday requests
// @access  Admin
router.post('/list-admin', async (req, res) => {
	try {
		const adminList = await Admin.find();

		if (!adminList) {
			throw new Error('Could not find any holiday requests');
		}
		res.status(200).json(adminList.map((admin) => admin.toJSON()));
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/list-request
// @desc    Get List of holiday requests
// @access  Admin
router.post('/list-request', async (req, res) => {
	try {
		const holidayRequests = await Holiday.find()
			.populate('employee')
			.populate('decisionBy');

		if (!holidayRequests) {
			throw new Error('Could not find any holiday requests');
		}
		res.status(200).json(holidayRequests.map((request) => request.toJSON()));
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/list-users
// @desc    List users
// @access  Admin
router.post('/list-user', async (req, res) => {
	try {
		const users = await User.find();
		if (!users) {
			throw new Error('Could not find any user');
		}
		res.status(200).json(users.map((user) => user.toJSON()));
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/action-request/:reqID
// @desc    Change the status of a request
// @access  Admin
router.post('/action-request/:reqID', async (req, res) => {
	try {
		const { reqID } = req.params;
		const { decisionBy, decisionStatus, rejectionReason } = req.body;

		let request = await Holiday.findById(reqID)
			.populate('employee')
			.populate('decisionBy');

		if (!request) {
			throw new Error('Could not update the request');
		}
		// If new decision is accepted
		if (decisionStatus === DECISIONS.ACCEPTED) {
			switch (request.decisionStatus) {
				// If previous decision is also accepted
				case DECISIONS.ACCEPTED: {
					throw new Error('Holiday Request has already been accepted.');
				}
				// Else deduct the holiday from the user
				default: {
					await User.findByIdAndUpdate(request.employee.id, {
						totalHolidays:
							request.employee.totalHolidays - request.totalWorkingDays,
						completedHolidays:
							request.employee.completedHolidays + request.totalWorkingDays,
					});

					break;
				}
			}
		} else if (decisionStatus === DECISIONS.REJECTED) {
			if (!rejectionReason || rejectionReason.length < 10) {
				throw new Error(
					'Please enter a valid rejection reason and not less than 10 letters.'
				);
			}
			switch (request.decisionStatus) {
				// If previous decision is also accepted
				case DECISIONS.REJECTED: {
					throw new Error('You have already rejected the request');
				}

				// Revert the deducted holidays
				case DECISIONS.ACCEPTED: {
					await User.findByIdAndUpdate(request.employee.id, {
						totalHolidays:
							request.employee.totalHolidays + request.totalWorkingDays,
						completedHolidays:
							request.employee.completedHolidays - request.totalWorkingDays,
					});
					break;
				}
				default: {
					break;
				}
			}
		}

		request = await Holiday.findByIdAndUpdate(
			reqID,
			{
				decisionBy,
				decisionStatus,
				decisionDate: Date.now(),
				rejectionReason: rejectionReason || null,
			},
			{ new: true }
		)
			.populate('employee')
			.populate('decisionBy');
		res.status(200).json(request.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/edit-user-holiday/:reqID
// @desc    Edit User data, mostly holiday
// @access  Admin
router.post('/edit-user-holiday/:userID', async (req, res) => {
	try {
		const { userID } = req.params;
		const { totalHolidays, completedHolidays } = req.body;
		const updatedUser = await User.findByIdAndUpdate(
			userID,
			{ totalHolidays, completedHolidays },
			{ new: true }
		);
		if (!updatedUser) {
			throw new Error('Could not find any user');
		}
		res.status(200).json(updatedUser.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/list-support-ticket
// @desc    List support tickets
// @access  User
router.post('/list-support-ticket', async (req, res) => {
	try {
		const { userID } = req.params;

		const supportTicketList = await SupportTicket.find()
			.sort({ creationDate: -1 })
			.populate('employee');

		if (!supportTicketList) {
			throw new Error('Could not fetch list of support tickets.');
		}
		res.status(200).json(supportTicketList.map((ticket) => ticket.toJSON()));
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// @Route   POST api/admin/update-support-ticket/:ticketID
// @desc    Update support tickets
// @access  User
router.post('/update-support-ticket/:ticketID', async (req, res) => {
	try {
		const { ticketID } = req.params;
		const { status, adminResponse } = req.body;
		if (!status) {
			throw new Error('Please enter valid  status for the ticket.');
		}
		const updatedTicket = await SupportTicket.findByIdAndUpdate(
			ticketID,
			{
				status,
				adminResponse,
			},
			{ new: true }
		).populate('employee');

		if (!updatedTicket) {
			throw new Error('Could not fetch list of support tickets.');
		}
		res.status(200).json(updatedTicket.toJSON());
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
