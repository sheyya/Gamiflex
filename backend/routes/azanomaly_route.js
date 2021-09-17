import express from 'express';
import passport from 'passport'

import * as azadController from '../controllers/azureanomalydetector.js';

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
router.post('/getchangepoints', userAuth, checkRole(["admin", "manager", "employee"]), azadController.azChangePointDetect);

export default router;