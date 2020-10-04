const router = require("express").Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const { log } = require("../custom_modules/Logger");
const { getLogout } = require("../controllers/auth");
const {
  ensureGuest,
  ensureAuthenticated,
} = require("../custom_modules/AuthenticationChecker");

// Register user
router.post(
  "/register",
  ensureGuest,
  [
    check("email", "Invalid email")
      .exists({ checkFalsy: true })
      .withMessage("Missing email")
      .isEmail(),
    check("pwd1", "Passwords don't match")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters")
      .custom((value, { req }) => value === req.body.pwd2),
  ],
  // @ts-ignore
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errorMessage = "";

      for (let e in errors.array()) {
        const error = errors.array()[e];
        log(error);
        // @ts-ignore
        if (e < errors.array().length - 1) {
          errorMessage += `${error.msg}, `;
        } else {
          errorMessage += `${error.msg}`;
        }
      }

      log(errorMessage);
      //   req.flash("error_message", errorMessage);
      res.redirect("/");
    } else {
      const { email, pwd1 } = req.body;
      const password = pwd1;

      // Check if user already registered
      User.findOne({ email: `${email}` }).then((user) => {
        if (user) {
          // req.flash("error_message", "Email is already registered");
          console.log(`Email is already registered: ${email}`);
          res.redirect("/");
        } else {
          const newUser = new User({
            email,
            password,
          });

          // @ts-ignore
          bcrypt.genSalt(10, (err, salt) => {
            // @ts-ignore
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // @ts-ignore
              newUser.password = hash;
              newUser
                .save()
                // @ts-ignore
                .then((user) => {
                  /* req.flash(
                    "success_message",
                    "You are now registered, Click the menu icon to sign in"
                  ); */
                  log(`User registered successfully`);
                  res.redirect("/");
                })
                .catch((err) => {
                  log(err);
                  //   req.flash("error_message", err.message);
                  log(`Error during registration: ${err.message}`);
                  res.redirect("/");
                });
            });
          });
        }
      });
    }
  }
);

// Use passport for user login
router.post("/login", ensureGuest, (req, res, next) => {
  passport.authenticate("local-login", {
    successRedirect: "/user/dashboard",
    failureRedirect: "/about",
    failureFlash: false,
  })(req, res, next);
});

// Logout user
router.route("/logout").get(ensureAuthenticated, getLogout);

module.exports = router;
