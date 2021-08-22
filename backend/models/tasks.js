import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const tasksSchema = mongoose.Schema({
    task_type: {
        type: Schema.Types.ObjectId, ref: 'tasks_types', required: true
    },
    department: {
        type: String,
        required: true
    },
    assignee: {
        type: Schema.Types.ObjectId, ref: 'employees', required: true
    },
    manager: {
        type: Schema.Types.ObjectId, ref: 'managers', required: true
    },
    target: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "ongoing",
    },
    completed: {
        type: Number,
        default: 0
    },
    completedbyEmp: {
        type: Number,
        default: 0
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    deadline: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, default: Date.now()
    }
})

var tasks = mongoose.model('tasks', tasksSchema);

export default tasks;
