require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../models/user"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const { isLoggedIn } = require("../controllers/middleware");

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const SECRET = process.env.SECRET;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const candidate = await User.findOne({ username: req.body.username });
    if (candidate) {
      res.status(409).json({ error: "username already exists" });
    } else {
      const user = await User.create(req.body);
      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var newDate = year + "/" + month + "/" + day;

  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = jwt.sign({ username: user.username }, SECRET);
        user.dateLastAuthorization = newDate;
        user.status = "Online";
        await user.save();
        res.json({ user, token, userId: user.id });
      } else {
        res.status(401).json({ error: "password doesn't match" });
      }
    } else {
      res.status(404).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/logout", isLoggedIn, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { username: req.query.username },
      { status: "Offline" }
    );
    res.status(200).json({ message: "User changed." });
  } catch (e) {
    res.status(400).json({ message: "Something went wrong, try again." });
  }
});

module.exports = router;
