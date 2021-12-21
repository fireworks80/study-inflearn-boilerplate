const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxLength: 50
	},
	email: {
		type: String,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		// 1: master, other: user
		type: Number,
		default: 0
	},
	image: String,
	token: {
		typ: String
	},
	tokenExp: {
		type: Number
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;