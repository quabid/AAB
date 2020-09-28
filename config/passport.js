const mongoose = require("mongoose");
// Load Models
require("../models/Users");
const User = mongoose.model("User");
const localLogin = require("./passportLocalLoginStrategy")(User);

module.exports = passport => {
    // Local login strategy
    passport.use("local-login", localLogin);

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
};
