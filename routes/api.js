const router = require("express").Router();
const { ensureGuest } = require("../../custom_modules/AuthenticationChecker");
const { getPublic } = require("../controllers/api");

router.route("/").get(ensureGuest, getPublic);

module.exports = router;
