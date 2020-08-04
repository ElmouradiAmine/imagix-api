const User = require("../../models/User");
const validation = require("../../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

 /**
 * @api {post} /user/register Register the user and send activation email to client.
 * @apiVersion 0.2.0
 * @apiName RegisterUser
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
 @apiError InvalidCredentiels Email or password is in the wrong format.
 *
 * @apiErrorExample Error-Response-InvalidCredentiels:
 *     HTTP/1.1 400 Bad Format
 *     {
 *       "error": "InvalidCredentiels"
 *     }
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
    //Validate the data
    const { error } = validation.registerValidation(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
  
    //Check if the email exists
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist && userExist.isActivated)
      return res.status(400).send({ error: "EmailAlreadyInUse" });
    else if (userExist)
      return res.status(400).send({ error: "AccountNotActivated" });
  
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
  
      //send the activation email
      //Generate a token
      const token = jwt.sign(
        { email: createdUser.email },
        process.env.TOKEN_SECRET,{
          expiresIn: 60 * 5,
        }
      );
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
          
        },
      });
  
      let mailOptions = {
        from: process.env.EMAIL,
        to: createdUser.email,
        subject: "Activate your Imagix account",
        html: `<div>
        <p>Thank you for registering into Imagix</p> 
        <a href= "http://localhost:3000/api/v1/user/activate/${token}">Activation Link</a></div>`,
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log(info.response);
      });
  
      res.send({
        user: createdUser._id,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };