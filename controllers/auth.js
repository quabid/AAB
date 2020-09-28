const { log } = require("../custom_modules/Logger");

// @desc        Get logout route
// @route       GET /auth/logout
// @access      Public
exports.getLogout = (req, res, next) => {
    console.log(`\n\t\tUser logged out\n\n`);
    req.logout();
    res.redirect("/");
};
