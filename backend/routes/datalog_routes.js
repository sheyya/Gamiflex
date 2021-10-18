import express from 'express';
import passport from 'passport'

import * as Data_log from '../controllers/datalog_ctrl.js';

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

//===========tasks===========
router.get('/tctot', userAuth, Data_log.getAllTotalTC);
router.get('/marksbyemp', userAuth, Data_log.getMarksByEmp);

export default router;