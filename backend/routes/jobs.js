var express = require('express');
const router = express.Router();
const JobModel = require('../models/job.model');
const CollectorModel = require('../models/collector.model');
const SourceModel = require('../models/source.model');
const { exec } = require('child_process');

const states = {
  NEW : "New",
  PROCESSING : "Processing",
  RUNNING : "Running",
  CANCELLED : "Cancelled",
  STOPPED : "Stopped",
  COMPLETED : "Completed"
  //New, Processing, Running, Cancelled, Stopped
} 

/* Create new Job*/
router.post('/save', async function(req, res, next){

    const jobObj = await JobModel.findOne({ jobName: req.body.jobName }); // checking jobName is alreday existing or not
    if (!jobObj) {
      if(validateData(req.body)){
      const date = new Date(req.body.date);
        jobModelObj = new JobModel({
          jobName : req.body.jobName,
          logId : req.body.logId,
          duration : Number(req.body.duration),
          volume :  Number(req.body.volume),
          date : date,
          sourceId : req.body.sourceId,
          collectorId : req.body.collectorId,
          status : states.NEW,
          progress : 0
        });
  
        jobModelObj.save(function(err , jobDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Job Added', job : jobDetails })
          }
        });
      }else{
        res.send({message:'Required details not provided'});
      }
      }else{
        res.send({ message : 'Job name already exists' });
      }
});

/* Update Job*/
router.post('/update', async function(req, res, next){

    const jobObj = await JobModel.findOne({ _id: req.body._id }); // checking for Job
    if (jobObj) {
      let job = req.body;
          if(validateDataForUpdate(job)){
            if(job.hasOwnProperty('jobName')){
              delete job.jobName;
             }
             if(job.duration){
              job.duration = Number(job.duration);
             }
             if(job.volume){
              job.volume = Number(job.volume);
             }
            const jobObj = JobModel.findOneAndUpdate({  _id: req.body._id }, job, function(err, jobDetails){
              if(err){
                console.log(err);
                res.send({message:'Unable to add Object'});
              }else{
                res.send({ message : 'Job Updated', job : jobDetails });
              }
          });  
        }else{
          res.send({message:'Required details not proper'});
        }      
      }else{
        res.send({ message : "Job doesn't exists" });
      }
});

/* Read Job details */
router.get('/view/:jobId', async function(req, res, next) {

    const jobId = req.params.jobId;

    const jobObj = await JobModel.findById(jobId);
    if(!jobObj){
      res.send({message:'Unable to fetch Object'});
    }else{
      const jobFullDetails = {
        _id : jobObj._id,
        jobName : jobObj.jobName,
        logId : jobObj.logId,
        duration : jobObj.duration,
        volume :  jobObj.volume,
        schedule : jobObj.schedule,
        date : jobObj.date,
        sourceId : jobObj.sourceId,
        collectorId : jobObj.collectorId,
        status : jobObj.status,
        progress : jobObj.progress
      };
      const source = await SourceModel.findById(jobObj.sourceId);
      const collector = await CollectorModel.findById(jobObj.collectorId);
      jobFullDetails.source = source;
      jobFullDetails.collector = collector;
      res.send({message: 'Job fetched', job: jobFullDetails});    
    }
  });

/* Delete Job details */
router.delete('/remove/:jobId', function(req, res, next) {

    const jobId = req.query.jobId;
  
    JobModel.findByIdAndDelete(jobId, function(err , jobObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Job deleted', job: jobObj});
      }
    });
  });

  /* List all Jobs */
router.get('/', function(req, res, next) {
    JobModel.aggregate([{
          $lookup: {
              from: "sources",
              localField: "sourceId",
              foreignField: "_id",
              as: "sources"
          }
      }, {
          $lookup: {
              from: "collectors",
              localField: "collectorId",
              foreignField: "_id",
              as: "collectors"
          }
      }, {
        $lookup: {
            from: "logs",
            localField: "logId",
            foreignField: "_id",
            as: "logs"
        }
    }]).exec(function (error, jobList) {
        if(error){
          res.send({message:'Unable to fetch List'});
        }else{
          res.send({message: 'Job List fetched', jobList: jobList});
        }
    });
});


async function startJob(req, res, next){

  const jobObj = await JobModel.findOne({ _id: req.body.jobId }); // checking for Job
  if (jobObj) {
    const date = new Date();
    const jobObj = JobModel.findOneAndUpdate({  _id: req.body.jobId }, {date : date}, function(err, jobDetails){
          if(err){
            res.send({message:'Unable to add Object'});
          }else{
            res.send({ message : 'Job Started', job : jobDetails });
          }
      });        
    }else{
      res.send({ message : "Job doesn't exists" });
    }
};

/* Stop Job */
router.post('/action', function(req, res, next) {

  const jobId = req.body.jobId;
  const action = req.body.action.toLowerCase();
  if(action === 'start'){
    startJob(req, res, next);
  }else{
    const command = `${process.env.PYTHON_ENV_VAR} ${process.env.PYTHON_FILE_PATH}/controller.py ${action} ${jobId}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        res.send({ message : `Couldn't ${action} job` });
      }else{
        // executed Stop command
        res.send({ message : `Job ${action} requested` });
      }
    }); 
  }
});

 /* List filtered Jobs */
 router.get('/filter', function(req, res, next) {
  JobModel.aggregate([{ 
    $match: { status : req.query.status.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase()) }},
    {
        $lookup: {
            from: "sources",
            localField: "sourceId",
            foreignField: "_id",
            as: "sources"
        }
    }, {
        $lookup: {
            from: "collectors",
            localField: "collectorId",
            foreignField: "_id",
            as: "collectors"
        }
    }, {
      $lookup: {
          from: "logs",
          localField: "logId",
          foreignField: "_id",
          as: "logs"
      }
  }]).exec(function (error, jobList) {
      if(error){
        res.send({message:'Unable to fetch List'});
      }else{
        res.send({message: 'Job List fetched', jobList: jobList});
      }
  });
});

/* List unassigned Jobs */
router.get('/newJobs', function(req, res, next) {
  JobModel.aggregate([{ 
    $match: { status : 'New', simulation : {$exists : false} }},
    {
        $lookup: {
            from: "sources",
            localField: "sourceId",
            foreignField: "_id",
            as: "sources"
        }
    }, {
        $lookup: {
            from: "collectors",
            localField: "collectorId",
            foreignField: "_id",
            as: "collectors"
        }
    }, {
      $lookup: {
          from: "logs",
          localField: "logId",
          foreignField: "_id",
          as: "logs"
      }
  }]).exec(function (error, jobList) {
      if(error){
        res.send({message:'Unable to fetch List'});
      }else{
        res.send({message: 'Job List fetched', jobList: jobList});
      }
  });
});

function validateData(job){
  if(!job.jobName || !job.logId || !job.duration || !job.volume || !job.date || !job.sourceId || !job.collectorId){
    return false;
  }else if(!validateDataForUpdate(job)){
    return false
  }
  return true;
}

function validateDataForUpdate(job){
  if((job.logId !== undefined && !job.logId.trim()) 
  || (job.duration !== undefined && !Number(job.duration)) 
  || (job.volume !== undefined && !Number(job.volume)) 
  || (!job.date) 
  || (job.sourceId !== undefined && !job.sourceId.trim()) 
  || (job.collectorId !== undefined && !job.collectorId.trim())){
    return false;
  }
  return true;
}

module.exports = router;
