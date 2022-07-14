const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    jobName : String,
    logId : mongoose.Schema.ObjectId,
    duration : Number,
    volume :  Number,
    date : Date,
    sourceId : mongoose.Schema.ObjectId,
    collectorId : mongoose.Schema.ObjectId,
    status : String,
    progress : Number,
    simulation : {
        simulationId : mongoose.Schema.ObjectId,
        simulationName : String,
    },
    createdBy : mongoose.Schema.ObjectId,
    updatedBy : mongoose.Schema.ObjectId
},
{
    timestamps: true
});

const JobModel = mongoose.model('Job', JobSchema);

module.exports = JobModel;