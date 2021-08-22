
import Task from '../models/tasks.js';
import TaskType from '../models/tasks_types.js';


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
export const getTasks = function (req, res, next) {
    Task.find({}).
        populate({ path: 'task_type', select: 'main_product department sub_product' }).
        populate({ path: 'assignee', select: 'member_id' }).
        populate({ path: 'manager', select: 'member_id' }).exec().then((user) => {
            if (user.length < 1) {
                return res.status(402).json({
                    message: "No tasks data availble",
                });
            } else {
                console.log(user);

                return res.status(200).json({
                    success: true,
                    code: 200,
                    data: user,
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
    let pass;

    let query = { _id: req.body.id }
    Task.findOne(query).exec().then(found_task => {
        if (found_task < 1) {
            return res.status(402).json({
                message: "No taskType data found",
            });
        } else {

            if (req.body.task_name) { found_task.task_name = req.body.task_name }
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
export const getTasksByEmp = (req, res, next) => {

    let query = {
        path: 'assignee',
        match: {
            _id: req.query.id
        }
    }

    Task.find().populate(query).populate('manager task_type').exec().then(tasks => {
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
                data: tasks,
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
    let pass;
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


//delete task
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
