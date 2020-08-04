/**
 * @api {post} /user/login Login the user and send back the token.
 * @apiVersion 0.1.0
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


 /**
 * @api {post} /user/register Register the user
 * @apiVersion 0.1.0
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

 @apiError InvalidCredentiels Username, Email or password is wrong.
 *
 * @apiErrorExample Error-Response-InvalidCredentiels:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "InvalidCredentiels"
 *     }
 */