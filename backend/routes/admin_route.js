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
router.get('/emp', userAuth, checkRole(["admin", "manager", "employee"]), adminController.getEmployees);
router.post('/emp', userAuth, checkRole(["admin", "manager"]), adminController.createEmployee);
router.get('/emp/:id', userAuth, checkRole(["admin", "manager"]), adminController.getEmployeeByid);
router.patch('/emp/:id', userAuth, checkRole(["admin", "manager"]), adminController.updateEmployee);
router.delete('/emp/:id', userAuth, checkRole(["admin", "manager"]), adminController.deleteEmployee);

//=========managers===========
router.get('/mngr', userAuth, checkRole(["admin", "manager"]), adminController.getManagers);
router.post('/mngr', userAuth, checkRole(["admin"]), adminController.createManager);
router.get('/mngr/:id', userAuth, checkRole(["admin", "manager"]), adminController.getManagerByid);
router.patch('/mngr/:id', userAuth, checkRole(["admin"]), adminController.updateManager);
router.delete('/mngr/:id', userAuth, checkRole(["admin"]), adminController.deleteManager);

export default router;