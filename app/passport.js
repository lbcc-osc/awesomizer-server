var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;
var User			= require('./models/User');

// =========================================================================
// Passport session - Loads user info into request objects.
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Local - A username and password for ~this~ site.
passport.use(new LocalStrategy({
        usernameField		: 'username',
        passwordField		: 'password',
        passReqToCallback	: true
    },
	function(req, username, password, done) {
		if (!username || !password) return done(null, false);
		User.findOne({ 'username' : username.toLowerCase() },
		function(err, user) {
			if (err) return done(err);
			if (!user || !user.validPassword(password)) {
				return done(null, false, 'Username or password incorrect.');
			} else {
				return done(null, user);
			}
		});
	}
));

User.findOne({ 'username':'admin' }, function (err, user) {
	if (err) throw err;
	if (user) return;
	user = new User({ username: 'admin' });
	user.setPassword('password');
	user.save(function (err) {
		if (err) throw err;
		console.log('Admin account created.');
	});
});

module.exports = passport;
