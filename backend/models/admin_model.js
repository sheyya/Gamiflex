import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
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
    profilepic: {
        type: String
    },
    created_at: {
        type: Date, default: Date.now()
    },
    role: {
        type: String,
        default: "admin"
    }
})

var admins = mongoose.model('admins', adminSchema);

export default admins;
