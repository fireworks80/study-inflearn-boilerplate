const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const tokenKey = 'secretToken';


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
		type: String
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

userSchema.methods.comparePassword = function (password, cb) {
	// 사용자 비밀번호를 userSchema password와 비교한다.
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateToken = function (cb) {
	// jsonwebtoken을 이용해서 토큰 생성하기
	const user = this;
	// token field에 넣는다
	user.token = jwt.sign(user._id.toHexString(), tokenKey);
	// user에 토큰을 저장한다.
	user.save((err, user) => {
		if (err) return cb(err);
		cb(null, user);
	});
};

userSchema.methods.findByToken = function (token, cb) {
	const user = this;

	// token을 decode한다.
	jwt.verify(token, tokenKey, (err, decoded) => {
		console.log(decoded);
		// decode한 token을 user의 토큰과 비교한다
		user.findOne({"_id": decoded, "token": token}, (err, user) => {
		// 비교후 cb로 던쳐준다.
			if (err) return cb(err);
			cb(null, user);
		});
	});


};

const User = mongoose.model('User', userSchema);

module.exports = User;