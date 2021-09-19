import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const totalTCSchema = mongoose.Schema({
    targetot: {
        type: Number,
        default: 0
    },
    completedtot: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var totalTC = mongoose.model('totalTC', totalTCSchema);

export default totalTC;