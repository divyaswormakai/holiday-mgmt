const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const { DECISIONS } = require('../config/constant');

const HolidaySchema = new Schema({
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	department: {
		type: String,
		required: true,
	},
	fromDate: {
		type: Date,
		required: true,
	},
	toDate: {
		type: Date,
		required: true,
	},
	totalWorkingDays: {
		type: Number,
		required: true,
	},
	requestDate: {
		type: Date,
		default: Date.now(),
	},
	reason: {
		type: String,
		required: true,
		minlength: 15,
	},
	decisionStatus: {
		type: String,
		enum: Object.keys(DECISIONS),
		required: true,
		default: DECISIONS.PENDING,
	},
	decisionDate: {
		type: Date,
	},
	decisionBy: {
		type: Schema.Types.ObjectId,
		ref: 'Admin',
		default: null,
	},
	rejectionReason: {
		type: String,
	},
});

HolidaySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

HolidaySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Holiday', HolidaySchema);
