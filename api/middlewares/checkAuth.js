
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) res.status(401).send({
        error: "Access denied"
    });
    try {
        const verified = jwt.verify(req.headers.authorization,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error){
        res.status(400).send({
            error: error
        })
    }
  
}