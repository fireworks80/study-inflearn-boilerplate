require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST).then(() => {
	console.log('Connected Mongodb...');
}).catch(error => {
	console.error(error);
});

app.get('/', (req, res) => res.send('hello world'));

app.listen(port, () => {
	console.log(`listen ${port}`);
});