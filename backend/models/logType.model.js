const mongoose = require('mongoose');

const LogTypeSchema = mongoose.Schema({
    logTypeName : String,
    patternType : String,
    pattern : [
        {
            fieldKey : String,
            pyFormat : String
        }
    ]
});

const LogTypeModel = mongoose.model('LogType', LogTypeSchema);

module.exports = LogTypeModel;