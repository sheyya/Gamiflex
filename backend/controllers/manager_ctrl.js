
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Manager from '../models/manager_model.js';
import { SECRET } from '../config/index.js'


//manager login
export const managerLogin = async (req, res) => {
    let managerCreds = req.body
    let { username, password } = managerCreds;
    // First Check if the username is in the database
    const manager = await Manager.findOne({ username });
    if (!manager) {
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false
        });
    }
    // console.log(password);

    // That means manager is existing and trying to signin fro the right portal
    // Now check for the password
    let isMatch = await bcrypt.compare(password, manager.password);
    if (isMatch) {
        // Sign in the token and issue it to the manager
        let token = jwt.sign(
            {
                user_id: manager._id,
                member_id: manager.member_id,
                role: manager.role,
                username: manager.username,
                email: manager.email
            },
            SECRET,
            { expiresIn: "7 days" }
        );

        let result = {
            username: manager.username,
            role: manager.role,
            email: manager.email,
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


export const managerCount = async (req, res) => {
    var query = Manager.find();
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