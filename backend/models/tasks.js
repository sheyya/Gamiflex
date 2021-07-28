import mongoose from 'mongoose';

const tasksSchema = mongoose.Schema({
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

var tasks = mongoose.model('tasks', tasksSchema);

export default tasks;
