var passport = require('passport');
, googlestrategy = require('passport-google-oauth').Strategy;
 passport.use(new googlestrategy({
      	clientID:'282337164299-ge4p83ah2j1itrt2i1iflkarm1bdhvjj.apps.googleusercontent.com',
      	clientSecret:'5OPuG-m1jjmUr7cmvvkD7bV3',
      	callbackURL:'http://127.0.0.1:8000/auth/google/callback'
      },
      function(accesstoken,refreshToken,profile,done){
      	if(err){
      		return done(err);
      	}
      }))
