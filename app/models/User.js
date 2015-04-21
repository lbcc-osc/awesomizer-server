var mongoose	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');

var usernameregex = /^[\w\d]{3,16}$/;
var tmpwset = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';

var schema = mongoose.Schema({

	username		: { type:String, match:usernameregex, required: true },

	localAuth		: {
		password	: { type:String, required: true },
		temppass	: { type:String }
	}

}, {

	toObject	: { virtuals: false },
	toJSON		: { virtuals: true }

});

/* ============================================================================
	Virtuals
============================================================================ */

schema.virtual('meta.created').get(function () {
	if (!this._id) return;
	return this._id.getTimestamp();
});

/* ============================================================================
	Indices
============================================================================ */

schema.index({ username: 1 }, { unique: true });

/* ============================================================================
	Internal Functions
============================================================================ */

function draftTempPass (n, a) {
	var index = (Math.random() * (a.length - 1)).toFixed(0);
	return n > 0 ? a[index] + draftTempPass(n - 1, a) : '';
}

/* ============================================================================
	Statics
============================================================================ */

schema.statics.DESELECT = '-_id -__v -localAuth -meta';

/* ============================================================================
	Methods
============================================================================ */

schema.methods.setPassword = function(password) {
	var salt = bcrypt.genSaltSync(8);
	this.localAuth.password = bcrypt.hashSync(password, salt, null);
	this.localAuth.temppass = '';
	return this.localAuth.password;
};

schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.localAuth.password);
};

schema.methods.resetPassword = function() {
	var pass = draftTempPass(12, tmpwset);
	this.setPassword(pass);
	this.localAuth.temppass = pass; // saves password plaintext!
	return pass;
};

/* ============================================================================
	Model
============================================================================ */

module.exports = mongoose.model('User', schema);
