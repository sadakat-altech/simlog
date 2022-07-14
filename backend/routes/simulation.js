var express = require('express');
const router = express.Router();
const SimulationModel = require('../models/simulation.model');
const JobModel = require('../models/job.model');
const { exec } = require('child_process'); 
const mongoose = require('mongoose');

/* Create new Simulation*/
router.post('/save', async function(req, res, next){
    const simulationObj = await SimulationModel.findOne({ simulationName: req.body.simulationName }); // checking simulationName is alreday existing or not
    if (!simulationObj) {
      if(validateData(req.body)){
        if(await validateNewJobs(req.body.jobIds)){
          const date = new Date(req.body.date);
          simulationModelObj = new SimulationModel({
            simulationName : req.body.simulationName,
            jobIds : req.body.jobIds,
            date : date,
          });
    
          simulationModelObj.save(async function(err , simulationDetails){
            if(err){
              res.send({message:'Unable to add Object'});
            }else{
              await JobModel.updateMany({ _id : { $in : simulationDetails.jobIds }}, { date : date, simulation : { simulationId : simulationDetails._id , simulationName : simulationDetails.simulationName }});
              res.send({ message : 'Simulation Added', simulation : simulationDetails });
            }
          });
        }else{
          res.send({message:'Some jobs are already mapped to another simulation!!!'});
        }
      }else{
        res.send({message:'Required details not provided'});
      }
      }else{
        res.send({ message : 'Simulation name already exists' });
      }
});

/* Update Simulation*/
router.post('/update', async function(req, res, next){

    const simulationObj = await SimulationModel.findOne({ _id: req.body._id }); // checking for Simulation
    if (simulationObj) {
      let simulation = req.body;
          if(validateDataForUpdate(simulation)){
            if(simulation.hasOwnProperty('simulationName')){
              delete simulation.simulationName;
             }
            const simulationObj = SimulationModel.findOneAndUpdate({  _id: req.body._id }, simulation, function(err, simulationDetails){
              if(err){
                console.log(err);
                res.send({message:'Unable to update Object'});
              }else{
                updateJobsDate(simulationDetails.jobIds, simulation.date);
                res.send({ message : 'Simulation Updated', simulation : simulationDetails });
              }
          });  
        }else{
          res.send({message:'Required details not proper'});
        }      
      }else{
        res.send({ message : "Simulation doesn't exists" });
      }
});

/* Read Simulation details */
router.get('/view/:simulationId', async function(req, res, next) {

    try{
      const simulationId = mongoose.Types.ObjectId(req.params.simulationId);
      SimulationModel.aggregate([
          {$match: { _id: simulationId }},{
            $lookup:
              {
                from: "jobs",
                localField: "jobIds",
                foreignField: "_id",
                as: "jobs"
              }
        }
      ]).exec(function (error, simulation) {
          if(error){
            res.send({message:'Unable to fetch Object'});
          }else{
            res.send({message: 'Simulation fetched', simulation: simulation[0]});
          }
      });
    }catch(e){
      res.send({message:'No simulations found'});
    }
  });

/* Delete Simulation details */
router.delete('/remove/:simulationId', function(req, res, next) {

    const simulationId = req.query.simulationId;
  
    SimulationModel.findByIdAndDelete(simulationId, function(err , simulationObj){
      if(err){
        res.send({message:'Unable to fetch Object'});
      }else{
        res.send({message: 'Simulation deleted', simulation: simulationObj});
      }
    });
  });

  /* List all Simulations */
router.get('/', function(req, res, next) {
    SimulationModel.aggregate( [
        {
           $lookup:
              {
                from: "jobs",
                localField: "jobIds",
                foreignField: "_id",
                as: "jobs"
             }
        }
     ]).exec(function (error, simulationList) {
      if(error){
        res.send({message:'Unable to fetch List'});
      }else{
        res.send({message: 'Simulation List fetched', simulationList: simulationList});
      }
  });
});

function startJobs(jobIds){
    const date = new Date();
    updateJobsDate(jobIds, date)
};

function updateJobsDate(jobIds, date){
  const jobObj = JobModel.updateMany({  _id: {$in : jobIds}, status : 'New' }, {date : date}, function(err, jobs){
    if(err){
      return false;
    }else{
      return true
    }
});
};

/* Simulation Actions */
router.post('/action', function(req, res, next) {

  const simulationId = req.body.simulationId;
  const action = req.body.action.toLowerCase();
  SimulationModel.findById(simulationId, function(err, simulation){

    const jobIds = simulation.jobIds; //Array of job Ids (This would change accoring to command created in python)
    if(action === 'run'){
      startJobs(simulation.jobIds);
      const simAction = ''; //python command
      /*
        const command = `${process.env.PYTHON_ENV_VAR} ${process.env.PYTHON_FILE_PATH}/controller.py ${simAction} ${jobIds}`;
        exec(command, (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            res.send({ message : `Couldn't run simulation` });
          }else{
            // executed Stop command
            res.send({ message : `Simulation run requested` });
          }
        }); 
       */
    }
    /*else if(action === 'stop'){
      const simAction = ''; //python command
      const command = `${process.env.PYTHON_ENV_VAR} ${process.env.PYTHON_FILE_PATH}/controller.py ${simAction} ${jobIds}`;
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          res.send({ message : `Couldn't ${action} simulation` });
        }else{
          // executed Stop command
          res.send({ message : `Simulation ${action} requested` });
        }
      }); 
    }*/
    res.send({ message : `Simulation action requested` }); // **Temp, romove once code has been updated
  })
  
});


function validateData(simulation){
  if(!simulation.simulationName || !simulation.date || !simulation.jobIds ){
    return false;
  }else if(!validateDataForUpdate(simulation)){
    return false
  }
  return true;
}

function validateDataForUpdate(simulation){
  if((!simulation.date) 
  || (simulation.jobIds !== undefined && simulation.length < 1)){
    return false;
  }
  return true;
}

async function validateNewJobs(jobIds){
  let flag = true;
  for(let job of jobIds){
    const temp = await JobModel.find({ _id : job, simulation : {$exists : false} });
    if(temp.length === 0){
      flag = false;
    }
  }
  return flag;
}

module.exports = router;
