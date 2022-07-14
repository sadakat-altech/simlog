const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    res.locals.validUser = false;
    let error = '';
    //Check and verify token
    if(token){
        jwt.verify(token, process.env.REACT_APP_BACKEND_URL, (err, decodedToken) => {
            if(err){
                error = "Invalid Token";
            }else{
                res.locals.validUser = true;
            }
        });
    }else{
        error = "Token expired";
    }
    res.locals.authErrMsg = error;
    next();
}

const checkUser = (req, res, next) => {
    //const token = req.cookies.token;
    const token = req.headers.authorization;
    res.locals.user = {};
    res.locals.authError = true;
    let error = '';
    //Check and verify token
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decodedToken) => {
            if(err){
                error = "Invalid Token";
            }else{
                res.locals.user = decodedToken;
                res.locals.authError = false;
            }
        });
    }else{
        error = "Token expired";
    }
    res.locals.authErrMsg = error;
    next();
}

module.exports = { requireAuth, checkUser }