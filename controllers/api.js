const Idea = require("../../models/Idea");
const {
    objectUtils: { stringify },
} = require("../../custom_modules/utils");

// @desc        Get all ideas
// @route       GET /user/dashboard
// @access      Private
exports.getPublic = (req, res, next) => {
    Idea.find({ public: true })
        .populate("author")
        .then(data => {
            console.log(data);
            res.render("api/index", {
                title: `Ideas`,
                ideas: data,
                hasDatum: data.length > 0,
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect("/api");
        });
};
