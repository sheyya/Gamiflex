import express from 'express';
import passport from 'passport'

import * as leaveReqController from '../controllers/leaverequest.js';

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



//===========tasks===========
router.get('/lreq', userAuth, leaveReqController.getLeaveReqs);
router.post('/lreq', userAuth, leaveReqController.createLeaveReq);
router.get('/lreqbyemp', userAuth, leaveReqController.getLeaveReqsByEmp);
router.get('/lreq/:id', userAuth, leaveReqController.getLeaveReqByid);
router.patch('/lreq/:id', userAuth, leaveReqController.updateLeaveReq);
router.delete('/lreq/:id', userAuth, leaveReqController.deleteLeaveReq);



export default router;