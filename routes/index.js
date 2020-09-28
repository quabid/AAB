const router = require("express").Router();
const { ensureGuest } = require("../custom_modules/AuthenticationChecker");
const {
  getIndex,
  getContact,
  postContact,
  getAbout,
} = require("../controllers/index");

router.route("/").get(ensureGuest, getIndex);

router.route("/about").get(ensureGuest, getAbout);

router.route("/contact").get(ensureGuest, getContact).post(postContact);

module.exports = router;
