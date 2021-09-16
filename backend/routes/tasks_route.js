import express from 'express';
import passport from 'passport'

import * as taskController from '../controllers/task_ctrl.js';

const router = express.Router();


/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = roles => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        res.status(401).json("Unauthorized");
        // console.log("Unauthorised");
        return;
    } else next();
}


router.post(
    "/admin-protectd",
    userAuth, checkRole(["admin"]),
    async (req, res) => {
        return res.status(200).json("Hello Admin");
    }
);



//===========tasks===========
router.get('/tsk', userAuth, checkRole(["admin", "manager"]), taskController.getTasks);
router.post('/tsk', userAuth, checkRole(["admin", "manager"]), taskController.createTask);
router.get('/tskbyemp', userAuth, checkRole(["admin", "manager", "employee"]), taskController.getTasksByEmp);
router.get('/tsk/:id', userAuth, checkRole(["admin", "manager", "employee"]), taskController.getTaskByid);
router.patch('/tsk/:id', userAuth, checkRole(["admin", "manager", "employee"]), taskController.updateTask);
router.delete('/tsk/:id', userAuth, checkRole(["admin", "manager"]), taskController.deleteTask);
router.get('/countoday', userAuth, checkRole(["admin", "manager"]), taskController.taskCountToday);
router.get('/targetoday', userAuth, checkRole(["admin", "manager"]), taskController.targetCountToday);
router.get('/countodaybyemp', userAuth, checkRole(["admin", "manager", "employee"]), taskController.taskCountTodayByEmp);
router.get('/targetodaybyemp', userAuth, checkRole(["admin", "manager", "employee"]), taskController.targetCountTodayByEmp);

//=========taststypes===========
router.get('/tsktype', userAuth, checkRole(["admin", "manager"]), taskController.getTaskTypes);
router.post('/tsktype', userAuth, checkRole(["admin"]), taskController.createTaskType);
router.get('/tsktype/:id', userAuth, checkRole(["admin", "manager"]), taskController.getTaskTypeByid);
router.patch('/tsktype/:id', userAuth, checkRole(["admin"]), taskController.updateTaskType);
router.delete('/tsktype/:id', userAuth, checkRole(["admin"]), taskController.deleteTaskType);


export default router;