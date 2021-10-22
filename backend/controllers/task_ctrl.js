
import Task from '../models/tasks.js';
import TaskType from '../models/tasks_types.js';
import mongoose from 'mongoose';
import { global_search } from '../config/global_search.js'
import { getPagination, getPagingData } from '../config/pagination.formatter.js'

//----- TASKS -----//

//create task
export const createTask = async (req, res) => {
    try {
        const tskDetails = req.body;
        const newTask = new Task(tskDetails);
        await newTask.save(function (err) {
            if (err) {
                console.log(err);
                res.status(600).json({
                    message: "Error happended when creating task.",
                    error: err
                });
                return
            }

            res.status(201).json({
                message: "Task successfully registred!",
                success: true
            });
            return
        });
    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create task.",
            success: false
        });
    }
};

//get all tasks
export const getTasks = async function (req, res, next) {
    const { page, size, search } = req.query;
    const { limit, offset } = getPagination(page, size);

    //global search
    let columns = ["main_product", "department", "assignee.member_id", "manager.member_id", "status",]
    let where = search ? global_search(columns, search) : {};
    let pageCount = await Task.find(where);
    let all_data = Task.find(where).sort({ created_at: -1 }).skip(offset).limit(limit);


    all_data.
        populate({ path: 'task_type', select: 'main_product department sub_product' }).
        populate({ path: 'assignee', select: 'member_id' }).
        populate({ path: 'manager', select: 'member_id' }).exec().then((user) => {
            if (user.length < 1) {
                return res.status(402).json({
                    message: "No tasks data availble",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    code: 200,
                    ...getPagingData(user, page, limit, pageCount.length),
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

// update taskType
export const updateTask = async (req, res, next) => {

    let query = { _id: req.body.id }
    Task.findOne(query).exec().then(found_task => {
        if (found_task < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {
            if (req.body.task_type) { found_task.task_type = req.body.task_type }
            if (req.body.department) { found_task.department = req.body.department }
            if (req.body.assignee) { found_task.assignee = req.body.assignee }
            if (req.body.manager) { found_task.manager = req.body.manager }
            if (req.body.target) { found_task.target = req.body.target }
            if (req.body.deadline) { found_task.deadline = req.body.deadline }
            if (req.body.status) { found_task.status = req.body.status }
            if (req.body.completed) { found_task.completed = req.body.completed }
            if (req.body.completedbyEmp) { found_task.completedbyEmp = req.body.completedbyEmp }
            if (req.body.updated_at) { found_task.updated_at = req.body.updated_at }

            found_task.updated_at = new Date();

            found_task.save((err, updated_object) => {
                if (err) { return next(err) }

                res.status(200).json({
                    success: true,
                    code: 200,
                    data: updated_object,
                });

            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get task by id
export const getTaskByid = (req, res, next) => {

    let query = { _id: req.params.id }

    Task.findOne(query).populate('assignee manager task_type').exec().then(task => {
        if (task < 1) {
            return res.status(402).json({
                message: "No task data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: task,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get filtered tasks by employee
export const getTasksByEmp = async (req, res, next) => {

    const { page, size, search } = req.query;
    const { limit, offset } = getPagination(page, size);

    //global search
    let columns = ["main_product", "department", "assignee.member_id", "manager.member_id", "status",]
    let where = search ? global_search(columns, search) : {};
    let pageCount = await Task.find(where);
    let all_data = Task.find(where).sort({ created_at: -1 }).skip(offset).limit(limit);

    all_data.find({ assignee: req.query.id }).populate('manager assignee task_type').exec().then(tasks => {

        if (tasks < 1) {
            return res.status(402).json({
                message: "No task data found",
            });
        } else {
            tasks = tasks.filter(function (task) {
                return task.assignee;
            });
            res.status(200).json({
                success: true,
                code: 200,
                ...getPagingData(tasks, page, limit, pageCount.length),
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//delete task
export const deleteTask = (req, res, next) => {

    let query = { _id: req.params.id }

    Task.findOne(query).exec().then(found_task => {
        if (found_task < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {
            found_task.remove((err, result) => {
                if (err) { return next(err) }

                res.status(200).json({
                    success: true,
                    code: 200,
                    data: result,
                });

            })

        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//count tasks all today
export const taskCountToday = async (req, res) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var query = Task.find({
        created_at: { $gte: startOfToday }
    });
    query.countDocuments(function (err, count) {
        if (err) {
            console.log(err)
        }
        else {
            return res.status(200).json({
                count: count
            });
        }
    });
};

//count tasks all today by id
export const taskCountTodayByEmp = async (req, res) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // console.log(req.query.id);

    let getemp = {
        path: 'assignee',
        match: {
            _id: req.query.id
        }
    }
    var query = Task.find({
        created_at: { $gte: startOfToday },
        assignee: req.query.id
    });


    query.populate(getemp).countDocuments(function (err, count) {
        if (err) {
            console.log(err)
        }
        else {
            return res.status(200).json({
                count: count
            });
        }
    });
};

//count target all today
export const targetCountToday = async (req, res) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var query = Task.aggregate([
        { $match: { created_at: { $gte: startOfToday } } },
        { $group: { _id: null, totarget: { $sum: "$target" }, totcompleted: { $sum: "$completed" } } }
    ])
    query.then((data) => {
        if (data.length < 1) {
            return res.status(402).json({
                message: " No taskType data found",
            });
        } else {
            return res.status(200).json({
                data
            });
        }
    });
};

//count tasks all today by id
export const targetCountTodayByEmp = async (req, res) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());


    var query = Task.aggregate([
        { $match: { created_at: { $gte: startOfToday }, assignee: mongoose.Types.ObjectId(req.query.id) } },
        { $group: { _id: req.body.id, totarget: { $sum: "$target" }, totcompleted: { $sum: "$completed" } } }
    ])
    query.then((data) => {

        if (data.length < 1) {
            return res.status(402).json({
                message: " No target data found",
            });
        } else {
            return res.status(200).json({
                data
            });
        }
    });
};

//---- TASK TYPES -----//

//create taskType
export const createTaskType = async (req, res) => {
    try {
        const tskDetails = req.body;
        const newTaskType = new TaskType(tskDetails);

        await newTaskType.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(600).json({
                    message: "Error happended when craeting taskType.",
                    error: err
                });
            }

            return res.status(201).json({
                message: "TaskType successfully Added!",
                success: true
            });
        });

    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create tasktype.",
            success: false
        });
    }
};

//get all taskTypes
export const getTaskTypes = function (req, res, next) {
    TaskType.find({}).then((user) => {
        if (user.length < 1) {
            return res.status(402).json({
                message: " No taskType data found",
            });
        } else {
            return res.status(200).json({
                success: true,
                code: 200,
                taskTypes: user,
            });
        }
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

// update taskType
export const updateTaskType = async (req, res, next) => {
    let query = { _id: req.params.id }
    TaskType.findOne(query).exec().then(found_taskType => {
        if (found_taskType < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {

            if (req.body.main_product) { found_taskType.main_product = req.body.main_product }
            if (req.body.department) { found_taskType.department = req.body.department }
            if (req.body.sub_product) { found_taskType.sub_product = req.body.sub_product }
            if (req.body.price) { found_taskType.price = req.body.price }

            found_taskType.updated_at = new Date();

            found_taskType.save((err, updated_object) => {
                if (err) { return next(err) }

                res.status(200).json({
                    success: true,
                    code: 200,
                    data: updated_object,
                });
            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get taskTypes by id
export const getTaskTypeByid = (req, res, next) => {
    let query = { _id: req.params.id }

    TaskType.findOne(query).exec().then(taskType => {
        if (taskType < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: taskType,
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}


//delete taskType
export const deleteTaskType = (req, res, next) => {
    let query = { _id: req.params.id }

    TaskType.findOne(query).exec().then(found_taskType => {
        if (found_taskType < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {
            found_taskType.remove((err, result) => {
                if (err) { return next(err) }

                res.status(200).json({
                    success: true,
                    code: 200,
                    data: result,
                });
            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}
