const passport =require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {usernameField: 'email'}

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
	//verify this username/pswd and call done with the un, pw
	//otherwise, call done with false
	User.findOne({email: email}, function(err, user){
		if(err) return done(err);
		if(!user) return done(false);

		//compare passwords - is `password` same as user.password?
		user.comparePassword(password, function(err, isMatch){
			if(err) return done(err);

			if(!isMatch) return done(null, false);

			return done(null, user);
		});

	});
});

//setup options for jwt strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey:config.secret
};

//create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	//see if user id in payload exists in db,
	//if so, call done with the user otherwise, 
	//call done without a user object
	User.findById(payload.sub, function(err, user){
		//search errored, no user
		if(err) return done(err, false);

		if(user) {
			//did search, got user
			done(null, user);
		}else{
			//did search, no user
			done(null, false);
		}
	});
});

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);