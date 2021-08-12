const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	profilePicture: {
		type: String,
		defaul: null,
	},
	totalHolidays: {
		type: Number,
		required: true,
		default: 0,
	},
	completedHolidays: {
		type: Number,
		required: true,
		default: 0,
	},
});

UserSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject.password;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
