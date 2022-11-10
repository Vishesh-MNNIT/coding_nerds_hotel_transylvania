const mongoose = require("mongoose");
const permissionSchema = new mongoose.Schema({
  costumerid: {
    type: String,
    require: true,
  },
  monster: {
    type: String,
    possibleValues: ["Yes", "No"],
  },
  manager: {
    type: String,
    possibleValues: ["Yes", "No"],
  },
});
const Permission = new mongoose.model("Permission", permissionSchema);
module.exports = Permission;
