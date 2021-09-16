
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin_model.js';
import Employee from '../models/employee_model.js';
import Manager from '../models/manager_model.js';
import { SECRET } from '../config/index.js'


//----- ADMINS -----//

//admin register
export const adminRegister = async (req, res) => {
    try {
        const adminDetails = req.body;
        // Validate the username
        let usernameNotTaken = await validateUsername(adminDetails.username, Admin);
        if (!usernameNotTaken) {
            return res.status(400).json({
                message: `Username is already taken.`,
                success: false
            });
        }

        // validate the email
        let emailNotRegistered = await validateEmail(adminDetails.email, Admin);
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: `Email is already registered.`,
                success: false
            });
        }

        // Get the hashed password
        const password = await bcrypt.hash(adminDetails.pass, 12);
        // create a new user
        const newAdmin = new Admin({
            ...adminDetails,
            password
        });

        await newAdmin.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(600).json({
                    message: "Error happended when craeting your account.",
                    error: err
                });
            }

            return res.status(201).json({
                message: "Admin successfully registred. Please now login.",
                success: true
            });
        });

    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create your account.",
            success: false
        });
    }
};

//admin login
export const adminLogin = async (req, res) => {
    let adminCreds = req.body
    let { username, password } = adminCreds;
    // First Check if the username is in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false
        });
    }

    // That means admin is existing and trying to signin fro the right portal
    // Now check for the password
    console.log(password);
    console.log(admin.password);
    let isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch);
    if (isMatch) {
        console.log(admin.member_id);

        // Sign in the token and issue it to the admin
        let token = jwt.sign(
            {
                user_id: admin._id,
                member_id: admin.member_id,
                role: admin.role,
                username: admin.username,
                email: admin.email
            },
            SECRET,
            { expiresIn: "7 days" }
        );

        let result = {
            username: admin.username,
            role: admin.role,
            email: admin.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };

        return res.status(200).json({
            ...result,
            message: "Hurray! You are now logged in.",
            success: true
        });
    } else {
        return res.status(403).json({
            message: "Incorrect password.",
            success: false
        });
    }
};



//----- EMPLOYEES -----//

//create employee
export const createEmployee = async (req, res) => {
    try {
        const empDetails = req.body;
        // Validate the username
        let usernameNotTaken = await validateUsername(empDetails.username, Employee);
        console.log(usernameNotTaken);
        if (!usernameNotTaken) {
            res.status(400).json({
                message: `Username is already taken.`,
                success: false
            });
            return;
        }

        // validate the email
        let emailNotRegistered = await validateEmail(empDetails.email, Employee);
        if (!emailNotRegistered) {
            res.status(400).json({
                message: `Email is already registered.`,
                success: false
            });
            return;
        }
        console.log(empDetails);

        // Get the hashed password
        const password = await bcrypt.hash(empDetails.pass, 12);
        // create a new user
        const newEmployee = new Employee({
            ...empDetails,
            password
        });

        await newEmployee.save(function (err, emp) {
            if (err) {
                console.log(err);
                res.status(600).json({
                    message: "Error happended when craeting your account.",
                    error: err
                });
                return
            }

            res.status(201).json({
                message: "Employee successfully registred!",
                success: true,
                data: emp._id
            });
            return
        });
    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create your account.",
            success: false
        });
    }
};

//get all employees
export const getEmployees = function (req, res, next) {
    Employee.find({}).exec().then((user) => {
        if (user.length < 1) {
            return res.status(402).json({
                message: "No employees data availble",
            });
        } else {
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

// update employee
export const updateEmployee = async (req, res, next) => {
    let pass;
    let query = { _id: req.params.id }
    console.log(req.body.pass);

    if (req.body.username) {
        pass = await bcrypt.hash(req.body.pass, 12);
    }
    Employee.findOne(query).exec().then(found_employee => {
        if (found_employee < 1) {
            return res.status(402).json({
                message: "No manager data found",
            });
        } else {

            if (req.body.username) { found_employee.username = req.body.username }
            if (req.body.password) { found_employee.password = pass }
            if (req.body.fname) { found_employee.fname = req.body.fname }
            if (req.body.lname) { found_employee.lname = req.body.lname }
            if (req.body.email) { found_employee.email = req.body.email }
            if (req.body.address) { found_employee.address = req.body.address }
            if (req.body.department) { found_employee.department = req.body.department }
            if (req.body.nic) { found_employee.nic = req.body.nic }
            if (req.body.contact_num) { found_employee.contact_num = req.body.contact_num }
            if (req.body.marital_status) { found_employee.marital_status = req.body.marital_status }
            if (req.body.gender) { found_employee.gender = req.body.gender }
            if (req.body.fingerprint) { found_employee.fingerprint = req.body.fingerprint }
            if (req.body.nominee) { found_employee.nominee = req.body.nominee }
            if (req.body.member_id) { found_employee.member_id = req.body.member_id }
            if (req.body.role) { found_employee.role = req.body.role }

            found_employee.updated_at = new Date();

            found_employee.save((err, updated_object) => {
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

//get employee by id
export const getEmployeeByid = (req, res, next) => {

    let query = { _id: req.params.id }

    Employee.findOne(query).exec().then(employee => {
        if (employee < 1) {
            return res.status(402).json({
                message: "No employee data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: employee,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//delete employee
export const deleteEmployee = (req, res, next) => {

    let query = { _id: req.params.id }

    Employee.findOne(query).exec().then(found_employee => {
        if (found_employee < 1) {
            return res.status(402).json({
                message: "No manager data found",
            });
        } else {
            found_employee.remove((err, result) => {
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

//---- MANAGERS -----//

//create manager
export const createManager = async (req, res) => {
    try {
        const mngrDetails = req.body;
        // Validate the username
        let usernameNotTaken = await validateUsername(mngrDetails.username, Manager);
        if (!usernameNotTaken) {
            return res.status(400).json({
                message: `Username is already taken.`,
                success: false
            });
        }

        // validate the email
        let emailNotRegistered = await validateEmail(mngrDetails.email, Manager);
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: `Email is already registered.`,
                success: false
            });
        }

        // Get the hashed password
        const password = await bcrypt.hash(mngrDetails.pass, 12);
        // create a new user
        const newManager = new Manager({
            ...mngrDetails,
            password
        });

        await newManager.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(600).json({
                    message: "Error happended when craeting your account.",
                    error: err
                });
            }

            return res.status(201).json({
                message: "Manager successfully registred!",
                success: true
            });
        });

    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create your account.",
            success: false
        });
    }
};

//get all managers
export const getManagers = function (req, res, next) {
    Manager.find({}).then((user) => {
        if (user.length < 1) {
            return res.status(402).json({
                message: " No manager data found",
            });
        } else {
            return res.status(200).json({
                success: true,
                code: 200,
                managers: user,
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

// update manager
export const updateManager = async (req, res, next) => {
    let pass;
    let query = { _id: req.params.id }
    if (req.body.username) {
        pass = await bcrypt.hash(req.body.password, 12);
    }
    Manager.findOne(query).exec().then(found_manager => {
        if (found_manager < 1) {
            return res.status(402).json({
                message: "No manager data found",
            });
        } else {

            if (req.body.username) { found_manager.username = req.body.username }
            if (req.body.password) { found_manager.password = pass }
            if (req.body.fname) { found_manager.fname = req.body.fname }
            if (req.body.lname) { found_manager.lname = req.body.lname }
            if (req.body.email) { found_manager.email = req.body.email }
            if (req.body.address) { found_manager.address = req.body.address }
            if (req.body.department) { found_manager.department = req.body.department }
            if (req.body.nic) { found_manager.nic = req.body.nic }
            if (req.body.contact_num) { found_manager.contact_num = req.body.contact_num }
            if (req.body.marital_status) { found_manager.marital_status = req.body.marital_status }
            if (req.body.gender) { found_manager.gender = req.body.gender }
            if (req.body.fingerprint) { found_manager.fingerprint = req.body.fingerprint }
            if (req.body.nominee) { found_manager.nominee = req.body.nominee }
            if (req.body.member_id) { found_manager.member_id = req.body.member_id }
            if (req.body.role) { found_manager.role = req.body.role }

            found_manager.updated_at = new Date();

            found_manager.save((err, updated_object) => {
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

//get managers by id
export const getManagerByid = (req, res, next) => {

    let query = { _id: req.params.id }

    Manager.findOne(query).exec().then(manager => {
        if (manager < 1) {
            return res.status(402).json({
                message: "No manager data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: manager,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}


//delete employee
export const deleteManager = (req, res, next) => {

    let query = { _id: req.params.id }

    Manager.findOne(query).exec().then(found_manager => {
        if (found_manager < 1) {
            return res.status(402).json({
                message: "No manager data found",
            });
        } else {
            found_manager.remove((err, result) => {
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

//----- VALIDATIONS -----//

//validate username
const validateUsername = async (username, usertype) => {
    try {
        let user = await usertype.findOne({ username });
        return user ? false : true;
    }
    catch (err) {
        console.log(err);

    }
};

//validate email
const validateEmail = async (email, usertype) => {
    try {
        let user = await usertype.findOne({ email });
        return user ? false : true;
    }
    catch (err) {
        console.log(err);

    }
};

