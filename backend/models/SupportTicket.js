const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const SupportTicket = new Schema({
	employee: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	creationDate: {
		type: Date,
		default: Date.now(),
	},
	reason: {
		type: String,
		required: true,
		minlength: 15,
	},
	status: {
		type: String,
		enum: ['PENDING', 'RESOLVED'],
		required: true,
		default: 'PENDING',
	},
	adminResponse: {
		type: String,
	},
});

SupportTicket.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

SupportTicket.plugin(uniqueValidator);
module.exports = mongoose.model('SupportTicket', SupportTicket);
