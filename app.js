require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");

const Signup = require("./models/register");
const Profile = require("./models/profile");
const Book = require("./models/available");
const Permission = require("./models/permission");
const { setTheUsername } = require("whatwg-url");
const { Console } = require("console");
const { equal } = require("assert");

const port = process.env.PORT || 7000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
require("./conn.js");
app.set("view engine", "hbs");
const template_path = path.join(__dirname, "/template/views");
const partials_path = path.join(__dirname, "/template/partials");
console.log(process.env.SECRET_KEY);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public/images"));
app.get("/", function (req, res) {
  res.render("index");
});
app.get("/home.html", auth, async (req, res) => {
  try {
    const user = req.user;
    const iid = user._id;
    console.log("this is the id" + iid);
    const bookroom = new Book({
      costumerid: iid,
    });
    const resulted = await bookroom.save();
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});
app.get("/signup.html", function (req, res) {
  res.render("signup");
});
app.get("/GALLERY.HTML", function (req, res) {
  res.render("gallery");
});
app.get("/contactus.html", function (req, res) {
  res.render("contactus");
});
app.get("/ABOUTUS.HTML", function (req, res) {
  res.render("aboutus");
});
app.get("/signup.html", function (req, res) {
  res.render("signup");
});

app.get("/login.html", function (req, res) {
  res.render("login");
});
app.get("/Profile.html", auth, async (req, res) => {
  /* console.log(`the cookie is ${req.cookies.jwt} `);
  res.status(201).render("profile", { name: req.user.fname }); */
  try {
    const user = req.user;
    const iid = user._id;
    console.log("this is the id" + iid);
    const profilee = new Profile({
      costumerid: iid,
    });
    const profiled = await profilee.save();
    res.render("profile");
  } catch (error) {
    console.log(error);
  }
});
app.get("/profiledetails.html", auth, function (req, res) {
  res.render("profiledetails", {
    name: req.user.fname,
    contact: req.user.contact,
    identity: req.user.identity,
    email: req.user.email,
  });
});

// app.get("/general.html", auth, async (req, res) => {
//   try {
//     const user = req.user;
//     const iid = user._id;
//     console.log("this is the id" + iid);
//     const permissiongrant = new Permission({
//       costumerid: iid,
//     });
//     const resulted = await permissiongrant.save();
//     res.render("general");
//   } catch (error) {
//     console.log(error);
//   }
// });
// app.get("/special.html", auth, async (req, res) => {
//   try {
//     const user = req.user;
//     const iid = user._id;
//     console.log("this is the id" + iid);
//     const bookroom = new Book({
//       costumerid: iid,
//     });
//     const resulted = await bookroom.save();
//     res.render("index");
//   } catch (error) {
//     console.log(error);
//   }
// });
app.get("/logout", auth, async (req, res) => {
  try {
    res.clearCookie("jwt");
    console.log("logout successfully");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/general.html", auth, async (req, res) => {
  try {
    const hotelbook = new Hotel({
      fname: req.user.fname,
      lname: req.user.lname,
      email: req.user.email,
      contact: req.user.contact,

      identity: req.user.identity,
      checkin: req.user1.checkin,
      checkout: req.user1.checkout,
      room: req.user1.room,
      roomtype: req.user1.roomtype,
      price: req.user1.price,
    });

    const signed = await hotelbook.save();
    res.status(201).render("index");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/signup.html", async (req, res) => {
  try {
    const signupemployee = new Signup({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      contact: req.body.contact,
      password: req.body.password,
      identity: req.body.identity,
    });
    const token = await signupemployee.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3000000),
      httpOnly: true,
    });
    const signed = await signupemployee.save();
    res.status(201).render("index");
  } catch (error) {
    res.status(400).send(error);
  }
});
app.post("/Profile.html", auth, async (req, res) => {
  const filter = {
    costumerid: req.user._id,
  };
  const update = {
    contact: req.body.contact,
    facebook: req.body.facebook,
    address: req.body.address,
    pincode: req.body.pincode,
  };
  let doc = await Book.findOneAndUpdate(filter, update);
  doc = await Book.findOne(filter);

  console.log(doc);
  res.status(201).render("profiledetails", {
    name: req.user.fname,
    identity: req.user.identity,
    contact: req.body.contact,
    facebook: req.body.facebook,
    address: req.body.address,
    pincode: req.body.pincode,
  });
});
app.post("/home.html", auth, async (req, res) => {
  const filter = {
    costumerid: req.user._id,
  };
  const update = {
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    room: req.body.room,
    roomtype: req.body.roomtype,
    price: req.body.price,
  };

  let doc = await Book.findOneAndUpdate(filter, update);
  doc = await Book.findOne(filter);
  const signed = await doc.save();
  if (req.user.identity === "person") {
    if (req.body.roomtype === "Special Room") {
      res.status(201).render("permission");
    } else {
      res.status(201).render("general");
    }
  } else {
    if (req.body.roomtype === "Special Room") {
      res.status(201).render("special");
    } else {
      res.status(201).render("general");
    }
  }
});
app.post("/permission.html", auth, async (req, res) => {
  const permissiongranted = new Permission({
    costumerid: req.user._id,
    monster: req.body.identity,
    manager: req.body.ident,
  });
  const hogyagrant = await permissiongranted.save();
  console.log(req.body.identity);
  console.log(req.body.ident);
  if (req.body.identity === "Yes" && req.body.ident === "Yes") {
    res.status(201).render("special");
  } else {
    res.status(201).render("index");
  }
});
// app.post("/Profile.html", auth, async (req, res) => {
//   try {
//     const profileofperson = new Profile({
//       contact: req.body.contact,
//       facebook: req.body.facebook,
//       address: req.body.address,
//       pincode: req.body.pincode,
//     });
//     const useremail = req.user.email;
//     const signed = await profileofperson.save();
//     res.status(201).render("profiledetails", {
//       name: req.user.fname,
//       /*  contact: contact,
//       /*   facebook: facebook, */
//       /*    pincode: pincode, */
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

app.post("/login.html", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Signup.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3000000),
      httpOnly: true,
    });
    if (isMatch) {
      const data = useremail.fname;
      res.status(201).render("index", { profile: data });
    } else {
      alert("password is wrong please retry !!!");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// app.get("/test", auth, async (req, res) => {
//   try {
//     const user = req.user;
//     const id = user._id;
//     const newavailable = new Book({ _id = id})

//     const ressult = await newavailable.save();

//   } catch (error) {
//     console.log(error);
//   }
// });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
