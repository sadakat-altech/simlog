const mongoose = require('mongoose');

const SourceSchema = mongoose.Schema({
    sourceName : String,
    fromIP : String,
    toIP : String
});

const SourceModel = mongoose.model('Source', SourceSchema);

module.exports = SourceModel;