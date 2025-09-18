const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { CLIENT_URL, NODE_ENV } = require('./lib/config');

const app = express();

if (NODE_ENV === 'production') {
	app.set('trust proxy', 1);
}

app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: CLIENT_URL,
	credentials: true,
	methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
	allowedHeaders: ['Content-Type','Authorization'],
}));

app.options(/^.*$/, cors({
	origin: CLIENT_URL,
	credentials: true,
}));

module.exports = app;
