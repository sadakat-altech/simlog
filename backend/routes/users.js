var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { checkUser } = require('../middlewares/auth.middleware');

router.post('/signup', function(req, res, next){
    const userObj = req.body;

    userModel.find({ username : userObj.username }, function(err, user){
        if(err){
            res.send('Unable to process request');
        }else{
            if(user.length === 0){
                userModelObj = new userModel({
                    firstName : userObj.firstName,
                    lastName : userObj.lastName,
                    email : userObj.email,
                    mobile : userObj.mobile,
                    username : userObj.username,
                    password :  userObj.password,
                });
            
                userModelObj.save(function(err, user){
                    if(err){
                        console.log(err);
                        res.send({message:'Unable to add Object'});
                    }else{
                        const newUser = getUserData(userObj);
                        res.send({message:'User added successfully', user : newUser});
                    }
                });
            }else{
                res.send('Username already in use');
            }
        }
    })
});

router.post('/login',async function(req, res, next){
    const userCredentials = req.body;
    try{
        const user = await userModel.login(userCredentials.username, userCredentials.password);
        const userObj = getUserData(user);
        const token = createToken(userObj.id);
        //res.cookie('token', token, {httpOnly : true,  maxAge : 3*24*60*60*1000});
        res.send({message : "User fetched", user : userObj, userToken : token});
    }catch(err){
        res.send({message : err.message});
    } 
});

router.post('/logout',checkUser, function(req, res, next){
    const userCredentials = req.body;
    try{
        //res.cookie('token', "", {httpOnly : true,  maxAge : 1});
        res.send({message : "User Logged out", isSuccess : true});
    }catch(err){
        res.send({message : err.message, isSuccess : false});
    } 
});

router.post('/update', function(req, res, next){
    const userObj = req.body;
    userUpdateObj = {
        password : userObj.password,
        firstName : userObj.firstName,
        lastName : userObj.lastName,
        email : userObj.email,
        mobile : userObj.mobile,
    };

    if(!userUpdateObj.password){
        delete userUpdateObj.password;
    }

    userModel.findOneAndUpdate({ _id : userObj.userId }, userUpdateObj, function(err, user){
        if(err){
            res.send({ message : "User update failed" });
            console.log(err);
        }else{
            const upadtedUser = getUserData(userObj);
            res.send({ message : "User successfully updated", user : upadtedUser});
        }
    });
});

router.get('/validate',checkUser, async function(req, res, next){
    try{
        if(!res.locals.authError){
            const userId = res.locals.user.id;
            const user = await userModel.findOne({_id : userId });
            const userObj = getUserData(user);
            res.send({message : "User fetched", user : userObj});
        }else{
            res.send({message : "Session timed out"});
        }
    }catch(err){
        res.send({message : err.message});
    } 
});

  /* List all Users */
  router.get('/', function(req, res, next) {

    userModel.find(function(err , userList){
    if(err){
      res.send({message:'Unable to fetch List'});
    }else{
      res.send({message: 'User List fetched', userList: userList});
    }
  });
});

  /* Get single User details */
  router.get('/view/:userId', function(req, res, next) {

    const userId = req.params.userId;

    userModel.findById(userId, function(err , user){
    if(err){
      res.send({message:'Unable to fetch List'});
    }else{
        const userObj = getUserData(user);
      res.send({message: 'User List fetched', user: userObj});
    }
  });
});

function getUserData(user){
    const userObj = {
        id : user._id,
        firstName : user.firstName,
        lastName : user.lastName,
        email : user.email,
        mobile : user.mobile,
        username : user.username
    }
    return userObj;
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn : 3*24*60*60
    });
}

module.exports = router;