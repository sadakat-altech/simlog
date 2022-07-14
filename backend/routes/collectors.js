var express = require('express');
const router = express.Router();
const CollectorModel = require('../models/collector.model');

/* Create new Collector*/
router.post('/save', async function(req, res, next){

    const collectorObj = await CollectorModel.findOne({ collectorName: req.body.collectorName }); // checking if collectorName is alreday existing or not
    if (!collectorObj) {
        collectorModelObj = new CollectorModel({
          collectorName : req.body.collectorName,
          collectorIP : req.body.collectorIP,
          collectorPort : req.body.collectorPort
        });
  
        collectorModelObj.save(function(err , collectorDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Collector Added', collector : collectorDetails })
          }
        });
      }else{
        res.send({ message : 'Collector name already exists' });
      }
});

/* Update Collector*/
router.post('/update', async function(req, res, next){

    const collectorObj = await CollectorModel.findOne({ _id: req.body.collectorId }); // checking for Collector
    if (collectorObj) {
        let collector = req.body;
        if(collector.hasOwnProperty('collectorName')){
            delete collector.collectorName;
        }
  
        CollectorModel.findOneAndUpdate({ _id: req.body.collectorId },collector, function(err , collectorDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Collector Updated', collector : collectorDetails })
          }
        });
      }else{
        res.send({ message : "Collector doesn't exists" });
      }
});

/* Read Collector details */
router.get('/view/:collectorId', function(req, res, next) {

    const collectorId = req.params.collectorId;
  
    CollectorModel.findById(collectorId, function(err , collectorObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Collector fetched', collector: collectorObj});
      }
    });
  });

/* Delete Collector details */
router.delete('/remove/:collectorId', function(req, res, next) {

    const collectorId = req.query.collectorId;
  
    CollectorModel.findByIdAndDelete(collectorId, function(err , collectorObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Collector deleted', collector: collectorObj});
      }
    });
  });

  /* List all Collectors */
router.get('/', function(req, res, next) {

    CollectorModel.find(function(err , collectorList){
    if(err){
      res.send({message:'Unable to fetch List'});
    }else{
      res.send({message: 'Collector List fetched', collectorList: collectorList});
    }
  });
});

module.exports = router;
