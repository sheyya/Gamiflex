import mongoose from 'mongoose';

const managerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    contact_num: {
        type: String,
        required: true
    },
    marital_status: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    fingerprint: {
        type: String,
    },
    nominee: {
        type: String,
        required: true
    },
    member_id: {
        type: String,
        required: true
    },
    profilepic: {
        type: String
    },
    created_at: {
        type: Date, default: Date.now()
    },
    role: {
        type: String,
        default: "manager"
    }
})

var managers = mongoose.model('managers', managerSchema);

export default managers;
