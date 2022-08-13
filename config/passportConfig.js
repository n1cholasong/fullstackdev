const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function localStrategy(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ where: { email: email } })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }
                    // Match password
                    isMatch = bcrypt.compareSync(password, user.password);
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect email or password.' });
                    }

                    // Email Verified
                    // if (!user.verified) {
                    //     return done(null, false, { message: 'Please verify you email' });
                    // }

                    return done(null, user);
                })
        }));
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((user, done) => {
        // user.id is used to identify authenticated user
        done(null, user.id);
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((userId, done) => {
        User.findByPk(userId)
            .then((user) => {
                done(null, user);
                // user object saved in req.session
            })
            .catch((done) => {
                // No user found, not stored in req.session
                console.log(done);
            });
    });
}

module.exports = { localStrategy };