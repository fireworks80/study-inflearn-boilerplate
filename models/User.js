const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

// user model에 user 정보를 저장하기 전에 cb를 한다.
// 그 다음 ./src/index.js에서 user.save()로 간다
userSchema.pre('save', function (next) {
	const user = this;

	// 비밀번호를 바꾸는 것이 아니면 그냥 넘어간다.
	if (!user.isModified('password')) return next();

	// saltRountd를 이용해서 salt 생성
	bcrypt.genSalt(saltRounds, (err, salt) => {
		if (err) return next(err);

		// salt를 이용해서 비밀 번호를 암호화 시킨다.
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);

			user.password = hash;

			// ./src/index.js로 보낸다
			next();
		});
	});
});

const User = mongoose.model('User', userSchema);

module.exports = User;