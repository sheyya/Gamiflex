import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const leavereqSchema = mongoose.Schema({
    employee_id: {
        type: Schema.Types.ObjectId, ref: 'employees', required: true
    },
    reason: {
        type: String
    },
    approved_manager: {
        type: String, required: false
    },
    status: {
        type: String,
        default: "pending",
    },
    dateRange: {
        type: Array
    },
    created_at: {
        type: Date, default: Date.now()
    },
    updated_at: {
        type: Date, default: Date.now()
    }
})

var leavereq = mongoose.model('leavereq', leavereqSchema);

export default leavereq;
