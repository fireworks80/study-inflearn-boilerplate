const User = require('../models/User');

const auth = (req, res, next) => {

	// 인증 처리를 하는 곳
	// client cookie에서 token을 가져온다

	const token = req.cookies.x_auth;

	// 토큰을 복호화 한다
	// findByToken은 static method이다
	// new User를 하지 않았기 때문에 instance method는 가져 올 수 없다.
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({isAuth: false, error: true});

		// middleware 이후의 진행에서 사용할 데이터를 req에 넣어 준다.
		req.token = token;
		req.user = user;
		next(); // middleware에서 다음 진행을 하기 위해
	});
};

module.exports = auth;