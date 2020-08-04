const User = require("../../models/User");
const validation = require("../../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @api {post} /user/login Login the user and send the token to client.
 * @apiVersion 0.2.0
 * @apiName LoginUser
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
 *@apiError WrongCredentiels Email or password is wrong.
 *
 * @apiErrorExample Error-Response-WrongCredentiels:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "WrongCredentiels"
 *     }
 * 
 *@apiError AccountNotActivated Email already in use but not activated.
 *
 * @apiErrorExample Error-Response-AccountNotActivated:
 *     HTTP/1.1 400 Not Activated
 *     {
 *       "error": "AccountNotActivated"
 *     }
 * 
 */

module.exports = async (req, res, next) => {
  //validate the data
  const { error } = validation.loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  //Check if the user email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(401).send({ error: "WrongCredentiels" });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  //Check if the password is correct
  if (!validPassword)
    return res.status(401).send({ error: "WrongCredentiels" });

  //Check if the account is activated
  if (!user.isActivated)
    return res.status(400).send({ error: "AccountNotActivated" });

  //Generate a token and send it back to client
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.send({
    user: user._id,
    token: token,
  });
};
