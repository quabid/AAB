const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { log, table } = require('../custom_modules/Logger');

module.exports = localLogin = User => {
  return new LocalStrategy(
    {
      usernameField: 'usernameOrEmail',
      passwordField: 'password',
      passReqToCallback: false,
    },
    (usernameOrEmail, password, done) => {
      log(`\n\tMade it to Passport Local Login\n`);

      // Match the user
      User.findOne({
        $or: [{ email: usernameOrEmail }, { userName: usernameOrEmail }],
      })
        .then(user => {
          log(`\n\tLooking for user: ${usernameOrEmail}\n`);
          if (!user) {
            log(`\n\tDid not find user: ${usernameOrEmail}\n`);
            // req.flash("error_message", "User does not exist");
            return done(null, false, {
              message: 'User does not exists',
            });
          }

          log(`\n\tFound User: ${user.email} ... checking password\n`);

          // Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            // if (err) throw err;

            if (isMatch) {
              log(
                `\n\n\t\tPassword was matched .... signing in ${user.email}\n\n`
              );
              return done(null, user.withoutPassword());
            } else {
              log(`\n\n\t\tPassword Failed!!!!\n\n\n`);
              // req.flash("error_message", "Authentication Failed");
              return done(null, false, {
                message: 'Authentication Failed',
              });
            }
          });
        })
        .catch(err => {
          // req.flash("error_message", "Authentication Failed");
          done(null, false, { message: 'Authentication Failed' });
        });
    }
  );
};
