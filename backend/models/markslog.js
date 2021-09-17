import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const markslogSchema = mongoose.Schema({
    employee: {
        type: Schema.Types.ObjectId, ref: 'employees', required: true
    },
    targetot: {
        type: Number,
        required: true
    },
    completedtot: {
        type: Number,
        default: 0
    },
    marks: {
        type: Number,
        default: 0
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var markslog = mongoose.model('markslog', markslogSchema);

export default markslog;