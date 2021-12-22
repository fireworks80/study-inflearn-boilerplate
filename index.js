require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const auth = require('./middleware/auth');
const dbHost = process.env.NODE_ENV === 'development' ? process.env.DB_HOST : process.env.MONGO_URI;

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(dbHost).then(() => {
	console.log('Connected Mongodb...');
}).catch(error => {
	console.error(error);
});

app.get('/', (req, res) => res.send('hello world1'));


app.post('/api/user/register', (req, res) => {
	// 회원가입 할때 필요한 정보들을 client에서 가져온다
	// 정보들을 데이터 베이스에 넣어 준다.

	const user = new User(req.body);

	user.save((err, userInfo) => {
		if (err) return res.json({success: false, err});

		return res.status(200).json({
			success: true
		});

	});
});


// login
app.post('/api/user/login', (req, res) => {
	// 사용자의 로그인 정보를 가져온다.
	const {email, password} = req.body;

	// db에서 사용자의 email이 맞는지 검색한다.
	User.findOne({email}, (err, user) => {
		if (err) return res.json({loginSuccess: false, message: '해당 유저가 없음', err});

		// email이 맞으면 비밀번호가 맞는지 확인 한다.
		user.comparePassword(password, (err, isMatch) => {
			if (!isMatch) return res.json({loginSucess: false, message: '비밀번호가 틀렸습니다.'});

			// 비밀번호가 맞으면 토큰 생성
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);

				// 토큰을 저장한다 where: cookie, localStorage
				res.cookie('x_auth', user.token).status(200).json({loginSuccess: true, userId: user._id});
			}); // generateToken()
		});
	});
});

// auth router 만들기
// middlewar : endpoint에 request하기 전에 중간에서 어떠한 것을 하는 것
app.get('/api/user/auth', auth, (req, res) => {
	const {_id, role, email, name, lastname, image} = req.user;
	// middleware가 성공 (auth 완료)
	res.status(200).json({
		_id,
		isAdmin: !!role,
		email,
		name,
		lastname,
		role,
		image
	});
});


app.listen(port, () => {
	console.log(`listen ${port}`);
});