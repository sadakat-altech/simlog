const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    logName : String,
    logTypeId : mongoose.Schema.ObjectId,
    logLink : String,
    logSize :  String,
    sampleLog : String
    //uploadedBy : mongoose.SchemaTypes.ObjectId,
},
{
    timestamps: true
});

const LogModel = mongoose.model('Log', LogSchema);

module.exports = LogModel;