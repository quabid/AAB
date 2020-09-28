const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

ClientSchema.index({ profileUrl: 1, imageUrl: 1 }, { unique: true });

// Create collection and add schema
const Clients = mongoose.model("Client", ClientSchema, "Client");
module.exports = Clients;
