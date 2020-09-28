const {
  objectUtils: { stringify },
} = require("../custom_modules/utils");

// @desc        Get all ideas
// @route       GET /user/dashboard
// @access      Private
exports.getDashboard = (req, res, next) => {
  res.status(200).json({ path: "/user/dashboard" });
};

// @desc        Get all ideas
// @route       GET /user/dashboard
// @access      Private
exports.getProfile = (req, res, next) => {
  res.status(200).json({ path: "/user/profile" });
};
