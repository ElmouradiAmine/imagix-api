const User = require("../../models/User");
const validation = require("../../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


 /**
 * @api {patch} /user/:id Update user's username or password.
 * @apiVersion 0.2.0
 * @apiName UpdateUser
 * @apiGroup User
 * 
 * 
 * @apiParam {String} id Users unique ID.
 * @apiParam  {String{6..255}} [username] Username of the user.
 * @apiParam  {String{8..1024}} [password] Password of the user.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "Amine Elmouradi",
 *       "email": "elmouradi.amine98@gmail.com",
         "password": "aminetest1234"
 *     }
 * 
 *
 * @apiSuccess 204
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 OK
 *    
 *
 * @apiError UserNotFound User id not found.
 *
 * @apiErrorExample Error-Response-UserNotFound:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "UserNotFound"
 *     }

 *@apiError AccessDenied client not allowed to change password.
 *
 * @apiErrorExample Error-Response-AccessDenied:
 *     HTTP/1.1 401 Not Activated
 *     {
 *       "error": "AccessDenied"
 *     }
 * 
 */
module.exports = async (req, res, next) => {
    //the user id param
    const id = req.params.userId;
    //validate data
    const { error } = validation.updateValidation(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
  
    //Check if the user exists
    const userExist = await User.findOne({ _id: id });
    if (!userExist) return res.status(400).send({ error: "UserNotFound" });
  
    //Check if the user is allowed to change his password
    if (req.user._id !== id)
      return res.status(401).send({ error: "AccessDenied" });
  
    const { password, username } = req.body;
    const options = {};
    //Check if the password is provided
    if (password) {
      //Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      options.password = hashPassword;
    }
    //Check if the username is provided
    if (username) {
      options.username = username;
    }
    try {
      await User.updateOne({ _id: id }, { $set: options });
      res.status(204).send();
    } catch (error) {}
  };