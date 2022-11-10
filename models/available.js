const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  costumerid: {
    type: String,

    require: true,
  },
  checkin: {
    type: Date,
  },
  checkout: {
    type: Date,
  },
  room: {
    type: String,
    possibleValues: ["1", "2", "3"],
  },
  roomtype: {
    type: String,
    possibleValues: ["Special room", "General room"],
  },
  price: {
    type: String,
    possibleValues: ["100$", "200$"],
  },
});
const Book = new mongoose.model("Book", bookingSchema);
module.exports = Book;
