const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskModel = new Schema({
    id: {
        type: Number,
        require
    },
    text: {
        type: String,
        require
    },
    start_date: {
        type: Date,
        require
    },
    duration: {
        type: Number,
        require
    },
    progress: {
        type: Number,
        require
    },
    parent: {
        type: String,
        require
    }
})

// taskModel.virtual('id').get(function () { return this._id })

module.exports = mongoose.model("gantt_tasks", taskModel)