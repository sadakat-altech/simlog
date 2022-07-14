const mongoose = require('mongoose');

const CollectorSchema = mongoose.Schema({
    collectorName : String,
    collectorIP : String,
    collectorPort : String
});

const CollectorModel = mongoose.model('Collector', CollectorSchema);

module.exports = CollectorModel;