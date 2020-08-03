const User = require("../models/User");
const validation = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  //validate the data
  const { error } = validation.loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //Check the credentiels
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(400).send({ error: "Wrong credentiels" });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({ error: "Wrong credentiels" });

  //Generate a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("Authorization", token);
  res.send({
      user: user._id,
      token: token,
  });
};

module.exports.register = async (req, res, next) => {
  //Validate the data
  const { error } = validation.registerValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //Check if the email exists
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send({ error: "Email already in use" });

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Add the new user to the database.
  try {
    // Create the User model object
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    //Save the user to the database.
    const createdUser = await user.save();
    res.send({
      user: createdUser._id,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
