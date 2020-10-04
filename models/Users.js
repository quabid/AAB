const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false },
});

UserSchema.index({ email: 1, userName: 1 }, { unique: true });

UserSchema.methods.withoutPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Create collection and add schema
const Users = mongoose.model("User", UserSchema, "User");
module.exports = Users;
