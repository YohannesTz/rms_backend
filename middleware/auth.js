const jwt = require('jsonwebtoken');
const middlewares = {};

require("dotenv").config();

middlewares.auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (token === null) {
        return res.json({
            success: false,
            data: null,
            error: { msg: 'Unauthorized' }
        });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Add user from payload 
        req.user = decoded;
        next();
    } catch (e) {
        console.log(e);
        return res.json({
            success: false,
            data: null,
            error: { msg: 'Invalid token' }
        });
    }
}

module.exports = middlewares;