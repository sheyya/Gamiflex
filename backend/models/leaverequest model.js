import mongoose from 'mongoose';

const leavereqSchema = mongoose.Schema({
    employee_id: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    approved_manager: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending",
    },
    dateRange: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var leavereq = mongoose.model('leavereq', leavereqSchema);

export default leavereq;
