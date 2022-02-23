const mongoose = require('mongoose');
const Schema = mongoose.Schema

const linksModel = new Schema({
    id: {
        type: Number,
        require
    },
    source: {
        type: Number,
        require
    },
    target: {
        type: Number,
        require
    },
    type: {
        type: String,
        require
    }
})

module.exports = mongoose.model("gantt_links", linksModel)