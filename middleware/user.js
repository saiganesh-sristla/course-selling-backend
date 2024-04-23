const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config.js');

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];

    const decodedValue = jwt.verify(jwtToken, jwtSecret);
    if(decodedValue.username){
        req.username = decodedValue.username;
        next();
    }else{
        res.json({
            "message":"you are not authenticated"
        })
    }
}

module.exports = userMiddleware;