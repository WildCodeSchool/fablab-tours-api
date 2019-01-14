const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const connection = require('../configuration/database');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt
const { JWT_SECRET } = require('../configuration/constant');


passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    connection.query("SELECT * FROM `user` WHERE `username` = '" + username + "'",
        function (error, results, fields) {
            if (error) {
                return done(null, false, { message: 'User not found' });
            } else {
                if (results.length > 0) {
                    if (results[0].password === password) {
                        return done(null, results[0], { message: 'Logged in Successfully' });
                    } else {
                        return done(null, false, { message: 'Wrong Password' });
                    }
                } else {
                    return done(null, false, { message: 'User not found' });
                }
            }
        })
}));

passport.use(new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: JWT_SECRET,
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(JWT_SECRET)
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));