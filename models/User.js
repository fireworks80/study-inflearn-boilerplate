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

	// next()하지 않으면 현재 페이지에서 머물게 된다.
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

userSchema.methods.comparePassword = function(password, cb) {
	// 사용자 비밀번호를 userSchema password와 비교한다.
	console.log(password);
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return cb(err);

		cb(null, isMatch);
	});

	// 암호화한 번호와 사용자 번호가 맞는지 확인

	// 맞으면 ...
};

const User = mongoose.model('User', userSchema);

module.exports = User;