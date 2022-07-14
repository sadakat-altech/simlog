var express = require('express');
const router = express.Router();
const SourceModel = require('../models/source.model');

/* Create new Source*/
router.post('/save', async function(req, res, next){

    const sourceObj = await SourceModel.findOne({ sourceName: req.body.sourceName }); // checking if sourceName is alreday existing or not
    if (!sourceObj) {
        sourceModelObj = new SourceModel({
          sourceName : req.body.sourceName,
          fromIP : req.body.fromIP,
          toIP : req.body.toIP
        });
  
        sourceModelObj.save(function(err , sourceDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Source Added', source : sourceDetails })
          }
        });
      }else{
        res.send({ message : 'Source name already exists' });
      }
});

/* Update Source*/
router.post('/update', async function(req, res, next){

    const sourceObj = await SourceModel.findOne({ _id: req.body.sourceId }); // checking for Source
    if (sourceObj) {
        let source = req.body;
        if(source.hasOwnProperty('sourceName')){
            delete source.sourceName;
        }
  
        SourceModel.findOneAndUpdate({ _id: req.body.sourceId },source, function(err , sourceDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Source Updated', source : sourceDetails })
          }
        });
      }else{
        res.send({ message : "Source doesn't exists" });
      }
});

/* Read Source details */
router.get('/view/:sourceId', function(req, res, next) {

    const sourceId = req.params.sourceId;
  
    SourceModel.findById(sourceId, function(err , sourceObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Source fetched', source: sourceObj});
      }
    });
  });

/* Delete Source details */
router.delete('/remove/:sourceId', function(req, res, next) {

    const sourceId = req.query.sourceId;
  
    SourceModel.findByIdAndDelete(sourceId, function(err , sourceObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Source deleted', source: sourceObj});
      }
    });
  });

  /* List all Sources */
router.get('/', function(req, res, next) {

    SourceModel.find(function(err , sourceList){
    if(err){
      res.send({message:'Unable to fetch List'});
    }else{
      res.send({message: 'Source List fetched', sourceList: sourceList});
    }
  });
});

module.exports = router;
