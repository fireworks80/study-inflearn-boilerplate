const User = require('../models/User');

const auth = (req, res, next) => {
	// 인증 처리를 하는 곳
	// client cookie에서 token을 가져온다
	const token = req.cookies.x_auth;

	// 토큰을 복호화 한다
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({isAuth: false, error: true});

		// middleware 이후의 진행에서 사용할 데이터를 req에 넣어 준다.
		req.token = token;
		req.user = user;
		next(); // middleware에서 다음 진행을 하기 위해
	});

	// 유저를 찾는다
	// 유져가 있으면 ok
	// 유저가 없으면 no
};

module.exports = auth;