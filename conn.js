const mongoose = require("mongoose");
mongoose
  .connect(
    // "mongodb+srv://jatingarg0410:jatingarg0410%40@cluster0.yrygdlo.mongodb.net/?retryWrites=true&w=majority"
    "mongodb://127.0.0.1:27017/signup"
  )
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((err) => {
    console.log(err);
  });
