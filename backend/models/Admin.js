const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const AdminSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 5,
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
		minlength: 6,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

AdminSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject.password;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});
AdminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Admin', AdminSchema);
