var express = require('express');
const router = express.Router();
const LogTypeModel = require('../models/logType.model');

/* Create new Log Type*/
router.post('/save', async function(req, res, next){

    const logTypeObj = await LogTypeModel.findOne({ logTypeName: req.body.logTypeName }); // checking if logName is alreday existing or not
    if (!logTypeObj) {
        logTypeModelObj = new LogTypeModel({
          logTypeName : req.body.logTypeName,
          patternType : req.body.patternType,
          pattern : req.body.pattern
        });
  
        logTypeModelObj.save(function(err , logTypeDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Log Type Added', logType : logTypeDetails })
          }
        });
      }else{
        res.send({ message : 'Log Type name already exists' });
      }
});

/* Update Log Type*/
router.post('/update', async function(req, res, next){

    const logTypeObj = await LogTypeModel.findOne({ _id: req.body.logTypeId }); // checking for Log type
    if (logTypeObj) {
        let typeObj = { patternType : req.body.patternType, pattern : req.body.pattern };
  
        LogTypeModel.findOneAndUpdate({ _id: req.body.logTypeId },typeObj, function(err , logTypeDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Log Type Updated', logType : logTypeDetails })
          }
        });
      }else{
        res.send({ message : "Log Type doesn't exists" });
      }
});

/* Read Log Type details */
router.get('/view/:logTypeId', function(req, res, next) {

    const logTypeId = req.params.logTypeId;
  
    LogTypeModel.findById(logTypeId, function(err , logTypeObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Log Type fetched', logType: logTypeObj});
      }
    });
  });

/* Delete Log Type details */
router.delete('/remove/:logTypeId', function(req, res, next) {

    const logTypeId = req.query.logTypeId;
  
    LogTypeModel.findByIdAndDelete(logTypeId, function(err , logTypeObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Log Type deleted', logType: logTypeObj});
      }
    });
  });

  /* List all Log Types */
router.get('/', function(req, res, next) {

    LogTypeModel.find(function(err , logTypeList){
    if(err){
      res.send({message:'Unable to fetch List'});
    }else{
      res.send({message: 'Log Type List fetched', logTypeList: logTypeList});
    }
  });
});

module.exports = router;
