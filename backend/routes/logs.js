var express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require("path");
const LogModel = require('../models/log.model');
const LogTypeModel = require('../models/logType.model');
const firstLine = require('firstline');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.LOG_STORE_PATH);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer(
  { storage: storage,
    fileFilter : (req, file, cb) => {
      if(file.originalname.includes('.log')){
        cb(null, true);
      }else{
        cb(null, false);
        return cb(new Error("Only log files are allowed"));
      }
    }
  }).single('upload_file');
  

/* Create image (store image data)*/
router.post('/upload', function(req, res, next){
  //req.body.data
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      res.send({ message : 'File type mismatch' });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
      res.send({ message : 'File type mismatch' });
    } else{
      // Everything went fine.
      const sample = await firstLine(req.file.path);
      const logName = req.body.logName ? req.body.logName.trim() : null;
      if(!logName || !req.body.logTypeId){
        res.send({message:'Required details not provided'});
      }else{
        const logObj = await LogModel.findOne({logName : req.body.logName});
        if(!logObj){
          if(req.file){
            LogModelObj = new LogModel({
              logName : logName,
              logTypeId : req.body.logTypeId,
              logLink : process.env.PROJECT_PATH + req.file.path,
              logSize :  req.file.size/(1000000),
              sampleLog : sample
            });
      
            LogModelObj.save(function(err , logDetails){
              if(err){
                res.send({message:'Unable to add Object'});
              }else{
                res.send({ message : 'Log Added', log : logDetails })
              }
            });
          }else{
            res.send({ message : 'No file selected' });
          }
        }else{
          res.send({ message : 'Log name already exists' });
        }
      }
    } 
  });
});

/* Read log details */
router.get('/view/:logId', async function(req, res, next) {

    const logId = req.params.logId;
  
    const logObj = await LogModel.findById(logId);
    if(!logObj){
      res.send({message:'Unable to fetch Object'});
    }else{
      const logFullDetails = {
        _id : logObj._id,
        logName : logObj.logName,
        logTypeId : logObj.logTypeId,
        logLink : logObj.logLink,
        logSize :  logObj.logSize,
        sampleLog : logObj.sampleLog
      };
      const logType = await LogTypeModel.findById(logObj.logTypeId);
      logFullDetails.logType = logType;
      res.send({message: 'Log fetched', log: logFullDetails});    
    }
  });

/* Delete Log details */
router.delete('/remove/:logId', function(req, res, next) {

    const logId = req.query.logId;
  
    LogModel.findByIdAndDelete(logId, function(err , logObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Log deleted', logDetails: logObj});
      }
    });
  });

  /* List all logs */
router.get('/', function(req, res, next) {
  LogModel.aggregate([{
    $lookup: {
        from: "logtypes",
        localField: "logTypeId",
        foreignField: "_id",
        as: "logTypes"
    }
  }]).exec(function(err, logList) {
    res.send({message: 'Log List fetched', logList: logList});
  });
});

module.exports = router;
