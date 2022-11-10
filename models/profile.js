const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  costumerid: {
    type: String,
  },
  contact: {
    type: Number,
  },
  facebook: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: Number,
  },
});
const Profile = new mongoose.model("Profile", profileSchema);
module.exports = Profile;
