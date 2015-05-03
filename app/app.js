var express			= require('express');
var morgan			= require('morgan');
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');
var session			= require('express-session');
var MongoStore		= require('connect-mongo')(session);
var multer			= require('multer');
var mongoose		= require('mongoose');

var pjson			= require('./../package.json');
var passport		= require('./passport.js');


var app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

app.locals.pretty = true;
app.set('json spaces', 4);

// Sessions and Passport
var uri		= 'mongodb://127.0.0.1:27017/awesomizer-dev';
var secure	= false;
var secret	= 'whenanearlygodexplodedat40000mph';

var sessioncfg = {
	secret				: secret,
	saveUninitialized	: secure,
	resave				: secure,
	store				: new MongoStore({ url: uri }),
	cookie				: { secure: secure },
};

app.use(session(sessioncfg));
app.use(passport.initialize());
app.use(passport.session());


var START_TIME = Date.now();

// API Endpoints and Routes
app.route('/api').get(function (req, res) {
	res.json({
		'started'	: START_TIME,
		'version'	: pjson.version
	});
});

// Eventually, people will be able to log in.
// This might be how we add those paths.
//require('./routes/session')(app.route('/api/session'), passport);

// Crudy is my CRUD node module for mongoose models.
// I'll add this in soon!
//app.use('/api/mods/', crudy(require('./models/Mod')));

// Lastly, report an error 404 if nothing else matched.
app.use(function (req, res) {
	res.status(404).send('not found');
});

// Normally, we check that this was successful first.
mongoose.connect(uri, function (err) {});

// Normally, we display a success or error message.
app.listen(process.env.PORT || 3000, function (err) {});




