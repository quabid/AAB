const express = require('express');
const router = express.Router();
// @ts-ignore
const passport = require('passport');
const User = require('../models/Users');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {
  ensureGuest,
  // @ts-ignore
  ensureAuthenticated,
} = require('../custom_modules/AuthenticationChecker');
const { emailUser, emailPwd, emailProvider } = require('../config/index');

router.post('/forgot', ensureGuest, function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne(
          {
            $or: [{ email: req.body.email }, { userName: req.body.email }],
          },
          // @ts-ignore
          function (err, user) {
            if (!user) {
              /* req.flash(
                                "error_message",
                                "No account with that email address exists."
                            ); */
              console.log(`User ${req.body.email} not found\n`);
              return res.redirect('/');
            }

            // @ts-ignore
            user.resetPasswordToken = token;
            // @ts-ignore
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        );
      },
      function (token, user, done) {
        const smtpTransport = nodemailer.createTransport({
          service: emailProvider,
          auth: {
            user: emailUser,
            pass: emailPwd,
          },
        });
        const mailOptions = {
          to: user.email,
          from: `${emailUser}`,
          subject: `Password Reset`,
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' +
            req.headers.host +
            '/help/reset/' +
            token +
            '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log('mail sent');
          /* req.flash(
                        "success_message",
                        `An e-mail has been sent to ${user.email} with further instructions.`
                    ); */
          done(err, 'done');
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect('/');
    }
  );
});

router.get('/reset/:token', ensureGuest, function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    // @ts-ignore
    function (err, user) {
      if (!user) {
        /* req.flash(
                    "error",
                    "Password reset token is invalid or has expired."
                ); */
        console.log(`Password reset token is invalid or has expired.\n`);
        return res.status(200).json({
          path: `/help/reset/`,
          error: `Invalid or expired token`,
        });
      }
      return res.status(200).json({
        path: `/help/reset/${req.params.token}`,
        token: req.params.token,
      });
    }
  );
});

router.post('/reset/:token', ensureGuest, function (req, res) {
  async.waterfall(
    [
      // @ts-ignore
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          // @ts-ignore
          function (err, user) {
            if (!user) {
              // @ts-ignore
              /*  req.flash(
                "error",
                "Password reset token is invalid or has expired."
              ); */
              return res.redirect('back');
            }
            if (req.body.pwd1 === req.body.pwd2) {
              // @ts-ignore
              bcrypt.genSalt(10, (err, salt) => {
                // @ts-ignore
                bcrypt.hash(req.body.pwd1, salt, (err, hash) => {
                  // if (err) throw err;
                  // @ts-ignore
                  user.password = hash;
                  user
                    .save()
                    // @ts-ignore
                    .then(user => {
                      /*  req.flash(
                        "success_message",
                        "Your password was successfully changed"
                      ); */
                      console.log(`Your password was successfully changed`);
                      res.redirect('/');
                    })
                    .catch(err => {
                      // @ts-ignore
                      log(err);
                      // @ts-ignore
                      // req.flash("error_message", err.message);
                      console.log(err.message);
                      res.redirect('/');
                    });
                });
              });
            } else {
              // @ts-ignore
              // req.flash("error", "Passwords do not match.");
              console.log('Passwords do not match.');
              return res.redirect('back');
            }
          }
        );
      },
      function (user, done) {
        const smtpTransport = nodemailer.createTransport({
          service: emailProvider,
          auth: {
            user: emailPwd,
            pass: emailPwd,
          },
        });
        const mailOptions = {
          to: user.email,
          from: emailUser,
          subject: 'Your password has been changed',
          text:
            'Hello,\n\n' +
            'This is a confirmation that the password for your account ' +
            user.email +
            ' has just been changed.\n',
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          // @ts-ignore
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      },
    ],
    // @ts-ignore
    function (err) {
      res.redirect('/');
    }
  );
});

// @ts-ignore
/* Submit email to /service/forgot route */
router.get('/forgot', ensureGuest, (req, res, next) => {
  res.render('help/user', {
    title: 'Password Recovery',
  });
});

module.exports = router;
