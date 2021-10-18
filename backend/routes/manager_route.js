import express from 'express';
import passport from 'passport'

import * as managerController from '../controllers/manager_ctrl.js';

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

//==========managers===========
router.post('/signin', managerController.managerLogin);
router.get('/count', userAuth, checkRole(["admin", "manager"]), managerController.managerCount);

export default router;