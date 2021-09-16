
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Employee from '../models/employee_model.js';
import { SECRET } from '../config/index.js'


//employee login
export const employeeLogin = async (req, res) => {
    let employeeCreds = req.body
    let { username, password } = employeeCreds;
    // First Check if the username is in the database
    const employee = await Employee.findOne({ username });
    if (!employee) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false
        });
    }

    // That means employee is existing and trying to signin fro the right portal
    // Now check for the password
    console.log(password);
    console.log(employee.password);

    let isMatch = await bcrypt.compare(password, employee.password);
    console.log(isMatch);
    if (isMatch) {
        // Sign in the token and issue it to the employee
        let token = jwt.sign(
            {
                user_id: employee._id,
                role: employee.role,
                username: employee.username,
                email: employee.email
            },
            SECRET,
            { expiresIn: "7 days" }
        );

        let result = {
            username: employee.username,
            role: employee.role,
            email: employee.email,
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


export const employeeCount = async (req, res) => {
    var query = Employee.find();
    query.countDocuments(function (err, count) {
        if (err) {
            console.log(err)
        }
        else {
            return res.status(200).json({
                count: count
            });
        }
    });
};