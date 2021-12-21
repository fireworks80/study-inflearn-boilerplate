require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const User = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST).then(() => {
	console.log('Connected Mongodb...');
}).catch(error => {
	console.error(error);
});

app.get('/', (req, res) => res.send('hello world'));


app.post('/register', (req, res) => {
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


app.listen(port, () => {
	console.log(`listen ${port}`);
});