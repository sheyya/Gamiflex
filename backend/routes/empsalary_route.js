import express from 'express';
import passport from 'passport'

import * as empSalaryController from '../controllers/empsalary_ctrl.js';

const router = express.Router();


/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = roles => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        res.status(401).json("Unauthorized");
        return;
    } else next();
}


//=========employee salary===========
router.get('/empsalary', userAuth, checkRole(["admin"]), empSalaryController.getEmpSalarys);
router.get('/empsalarybyemp', userAuth, checkRole(["admin", "employee"]), empSalaryController.getEmpSalarysByEmp);
router.post('/empsalary', userAuth, checkRole(["admin"]), empSalaryController.createEmpSalary);
router.get('/empsalary/:id', userAuth, checkRole(["admin"]), empSalaryController.getEmpSalaryByid);
router.patch('/empsalary', userAuth, checkRole(["admin"]), empSalaryController.updateEmpSalary);
router.delete('/empsalary/:id', userAuth, checkRole(["admin"]), empSalaryController.deleteEmpSalary);

export default router;