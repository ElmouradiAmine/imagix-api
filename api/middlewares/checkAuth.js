
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({
        error: "AccessDenied"
    });
    try {
        const verified = jwt.verify(req.headers.authorization,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error){
        return res.status(400).send({
            error: error
        })
    }
  
}