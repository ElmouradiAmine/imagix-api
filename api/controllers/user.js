const User = require("../models/User");
const validation = require("../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @api {post} /user/login Login the user and send back the token.
 * @apiVersion 0.1.0
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam  {String{6..255}} email Email of the user.
 * @apiParam  {String{8..1024}} password Password of the user.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "elmouradi.amine98@gmail.com",
         "password": "aminetest1234"
 *     }
 * 
 *
 * @apiSuccess {String} user ID of the user.
 * @apiSuccess {String} token  Token of the user for authentication.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": "5f2876a1b1df058383363a9d",
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI4NzZhMWIxZGYwNTgzODMzNjNhOWQiLCJpYXQiOjE1OTY0OTIzNzR9.AOZYQoJneb_jPFZA12iwBC0FcNAgh-W97G9jzUXN03U"
 *     }
 *
 * @apiError WrongCredentiels Email or password is wrong.
 *
 * @apiErrorExample Error-Response-WrongCredentiels:
 *     HTTP/1.1 401 Access Denied
 *     {
 *       "error": "WrongCredentiels"
 *     }
 @apiError InvalidCredentiels Email or password is in the wrong format.
 *
 * @apiErrorExample Error-Response-InvalidCredentiels:
 *     HTTP/1.1 400 Bad Format
 *     {
 *       "error": "InvalidCredentiels"
 *     }
 */

module.exports.login = async (req, res, next) => {
  //validate the data
  const { error } = validation.loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //Check the credentiels
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(401).send({ error: "WrongCredentiels" });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) res.status(401).send({ error: "WrongCredentiels" });

  //Generate a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.send({
    user: user._id,
    token: token,
  });
};

/**
 * @api {post} /user/register Register the user
 * @apiVersion 0.1.0
 * @apiName Register
 * @apiGroup User
 *
 * @apiParam  {String{6..255}} username Username of the user.
 * @apiParam  {String{6..255}} email Email of the user.
 * @apiParam  {String{8..1024}} password Password of the user.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "Amine Elmouradi",
 *       "email": "elmouradi.amine98@gmail.com",
         "password": "aminetest1234"
 *     }
 * 
 *
 * @apiSuccess {String} user ID of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": "5f2876a1b1df058383363a9d",
 *     }
 *
 * @apiError EmailAlreadyInUse Email or password is wrong.
 *
 * @apiErrorExample Error-Response-EmailAlreadyInUse:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "EmailAlreadyInUse"
 *     }

 @apiError InvalidCredentiels Username, Email or password is wrong.
 *
 * @apiErrorExample Error-Response-InvalidCredentiels:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "InvalidCredentiels"
 *     }
 */

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
