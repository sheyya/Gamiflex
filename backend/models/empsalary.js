import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const empsalarySchema = mongoose.Schema({
    employee_id: {
        type: Schema.Types.ObjectId, ref: 'employees', required: true
    },
    salary: {
        type: Number,
        default: 0
    },
    epf: {
        type: Number,
        default: 0
    },
    etf: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "pending",
    },
    month: {
        type: String
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var empsalary = mongoose.model('empsalary', empsalarySchema);

export default empsalary;
