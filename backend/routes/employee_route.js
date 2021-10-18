import express from 'express';
import passport from 'passport'

import * as employeeController from '../controllers/employee_ctrl.js';

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

//==========employees===========
router.post('/signin', employeeController.employeeLogin);
router.get('/count', userAuth, checkRole(["admin", "manager"]), employeeController.employeeCount);


export default router;