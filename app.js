var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');

configDB = require('./configDB/database');
mongoose.connect(configDB.url);

var app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(session({
	secret : 'this is a chrip app',
	saveUninitialized : true,
	resave :true
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/route')(app,passport);
require('./routes/api')(app);
var initPassport = require('./passport-init');
initPassport(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');



app.listen(4000)
console.log("server started");