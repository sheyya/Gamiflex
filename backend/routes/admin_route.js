import express from 'express';
import passport from 'passport'

import * as adminController from '../controllers/admin_ctrl.js';

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



//==========admins===========
router.post('/signin', adminController.adminLogin);
router.post('/reg_admin', userAuth, checkRole(["admin"]), adminController.adminRegister);

//===========users===========
router.get('/emp', userAuth, checkRole(["admin"]), adminController.getEmployees);
router.post('/create_emp', userAuth, checkRole(["admin"]), adminController.createEmployee);
router.get('/empid', userAuth, checkRole(["admin"]), adminController.getEmployeeByid);
router.patch('/empupdate', userAuth, checkRole(["admin"]), adminController.updateEmployee);
router.delete('/empdel', userAuth, checkRole(["admin"]), adminController.deleteEmployee);

//=========managers===========
router.get('/mngr', userAuth, checkRole(["admin"]), adminController.getManagers);
router.post('/create_mngr', userAuth, checkRole(["admin"]), adminController.createManager);
router.get('/mngrid', userAuth, checkRole(["admin"]), adminController.getManagerByid);
router.patch('/mngrupdate', userAuth, checkRole(["admin"]), adminController.updateManager);
router.delete('/mngrdel', userAuth, checkRole(["admin"]), adminController.deleteManager);

export default router;