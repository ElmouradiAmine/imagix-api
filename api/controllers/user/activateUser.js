const User = require("../../models/User");
const jwt = require("jsonwebtoken");

/**
 * @api {get} /user/activate/:token Activate user's account.
 * @apiVersion 0.2.0
 * @apiName ActivateUser
 * @apiGroup User
 * 
 * 
 * @apiParam {String} token client activation account token.
 * 
 *
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
 *
 *@apiError AccessDenied client not allowed to change password.
 *
 * @apiErrorExample Error-Response-AccessDenied:
 *     HTTP/1.1 401 Not Activated
 *     {
 *       "error": "AccessDenied"
 *     }
 *  *@apiError BadRequest An error has occured.
 *
 * @apiErrorExample Error-Response-AccountNotActivated:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "BadRequest"
 *     }
 * 
 */
 


module.exports = async (req, res, next) => {
  //Check if the token is available
  const token = req.params.token;
  if (!token)
    return res.status(401).send({
      error: "AccessDenied",
    });

  try {
    //Verify the token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    await User.updateOne(
      { email: verified.email },
      { $set: { isActivated: true } }
    );
    res.status(204);
  } catch (error) {
    return res.status(400).send({
      error: error,
    });
  }
};
