const router = require("express").Router();
const { getDashboard, getProfile } = require("../controllers/user");
const {
  ensureAuthenticated,
} = require("../custom_modules/AuthenticationChecker");

router.route("/dashboard").get(ensureAuthenticated, getDashboard);

router.route("/profile").get(ensureAuthenticated, getDashboard);

module.exports = router;
