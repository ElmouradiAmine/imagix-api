const User = require("../../models/User");

 /**
 * @api {get} /user/:id Get user information.
 * @apiVersion 0.2.0
 * @apiName GetUser
 * @apiGroup User
 * 
 * 
 * @apiParam {String} id Users unique ID.
 * 
 
 *
 * @apiSuccess {String} _id ID of the user.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {String} email Email of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5f2876a1b1df058383363a9d",
 *       "username": "Amine Elmouradi",
 *       "email": "elmouradi.amine98@gmail.com",
 *     }
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
    //Check if the user exists
    const userFound = await User.findOne({ _id: id }).select(
      "_id username email createdAt"
    );
    if (!userFound) return res.status(400).send({ error: "UserNotFound" });
  
    //Check if the user is allowed to get his profile info
    if (req.user._id !== id)
      return res.status(401).send({ error: "AccessDenied" });
  
    res.send(userFound);
  };
  
  