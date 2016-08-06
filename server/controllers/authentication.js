const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  //sub:subject and iat: issued at time:
  return jwt.encode({sub: user.id, iat:timestamp}, config.secret);
}

exports.signin = function(req, res, next){
  //user has already had email/password authed, 
  //we just need to give them a token
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  //make sure we're getting all the data
  if(!email || !password){
    return res.status('422').send({error: "You must provide an email and password"});
  }

  //check for user with email exists
  User.findOne({email:email}, function(err, existingUser){
    if(err) { return next(err); }

    //return error if user exists
    if(existingUser){
      return res.status(422).send({error: "Email is in use"});
    }

    //otherwise, create and save user record
    const user = new User({
      email:email,
      password: password
    }); //creates user in memory

    user.save(function(err){
      if(err){return next(err);}

      //respond to request
      res.json({token: tokenForUser(user)});

    });

  })


}
