// @desc        Get the home route
// @route       GET /
// @access      Public
exports.getIndex = (req, res, next) => {
  try {
    res.status(200).json({ path: "/" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
};

// @desc        Get the contact route
// @route       GET /
// @access      Public
exports.getAbout = (req, res, next) => {
  try {
    res.status(200).json({ path: "/about" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
};

exports.getContact = (req, res, next) => {
  try {
    res.status(200).json({ path: "/contact" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
};

// @desc        Post to the contact route
// @route       POST /
// @access      Public
exports.postContact = (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    console.log(`\n\t\tInputs: ${name}, ${email}, ${message}\n\n`);

    res.status(200).json({ name: name, email: email, message: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message,
      cause: err.stackTrace,
    });
  }
};
