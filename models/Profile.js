const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

ProfileSchema.index({ profileUrl: 1, imageUrl: 1 }, { unique: true });

// Create collection and add schema
const Profile = mongoose.model("Profile", ProfileSchema, "Profile");
module.exports = Profile;
