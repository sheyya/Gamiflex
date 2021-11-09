import Employee from '../models/employee_model.js';
import Task from '../models/tasks.js';
import mongoose from 'mongoose';
import moment from "moment"
import EmpSalary from '../models/empsalary.js';
import Markslog from '../models/markslog.js';
import totalTC from '../models/totaltc_model.js';
import * as azadController from '../controllers/azureanomalydetector.js';
import * as Data_log from '../controllers/datalog_ctrl.js';
import * as Mailer from './mailer.js';

//get all employees
export const getEmployees = async () => {
    let data = []
    await Employee.find({}).exec().then((user) => {
        if (user.length < 1) {
            console.log("No user found");
        } else {
            data = user
        }
    })
        .catch((err) => {
            console.log(err);
        });
    return data
};

//get target and completed data by emp
export const targetCountTodayByEmp = async (data) => {
    let retdata;
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // var startOfToday = new Date(moment.tz("2021-11-08", "Asia/Colombo").format());
    // var endOfToday = new Date(moment.tz("2021-11-09", "Asia/Colombo").format());

    var query = Task.aggregate([
        { $match: { created_at: { $gte: startOfToday }, assignee: mongoose.Types.ObjectId(data) } },
        { $group: { _id: data, totarget: { $sum: "$target" }, totcompleted: { $sum: "$completed" } } }
    ])
    await query.then((data) => {
        console.log(data);
        if (data.length < 1) {
            console.log("no data found");
        } else {
            return retdata = data
        }
    });
    return retdata
};

// update manager
export const updateEmployee = async (data) => {
    let query = { _id: data.id }
    Employee.findOne(query).exec().then(found_employee => {
        if (found_employee < 1) {
            return res.status(402).json({
                message: "No employee data found",
            });
        } else {
            if (data.username) { found_employee.username = data.username }
            if (data.password) { found_employee.password = pass }
            if (data.fname) { found_employee.fname = data.fname }
            if (data.lname) { found_employee.lname = data.lname }
            if (data.email) { found_employee.email = data.email }
            if (data.address) { found_employee.address = data.address }
            if (data.department) { found_employee.department = data.department }
            if (data.nic) { found_employee.nic = data.nic }
            if (data.contact_num) { found_employee.contact_num = data.contact_num }
            if (data.marital_status) { found_employee.marital_status = data.marital_status }
            if (data.gender) { found_employee.gender = data.gender }
            if (data.fingerprint) { found_employee.fingerprint = data.fingerprint }
            if (data.nominee) { found_employee.nominee = data.nominee }
            if (data.member_id) { found_employee.member_id = data.member_id }
            if (data.role) { found_employee.role = data.role }
            if (data.marks !== 'undefined') { found_employee.marks = data.marks }

            found_employee.save((err, updated_object) => {
                if (err) { return next(err) }

                console.log("update emp success");

            })
        }
    }).catch((err) => {
        console.log(err);
    });
}

//get filtered empsalarys by employee
export const getEmpSalarysByEmp = async (data) => {
    let query = {
        path: 'employee_id',
        match: {
            _id: data.id
        }
    }
    let retdata;
    await EmpSalary.find().populate(query).exec().then(empsalarys => {
        if (empsalarys < 1) {
            console.log("No empsalary data found");
        } else {
            empsalarys = empsalarys.filter(function (empsalary) {
                return empsalary.employee_id;
            });
            retdata = empsalarys
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
    return retdata;
}

// update empsalaryType
export const updateEmpSalary = async (data) => {
    let tempsalary = 0;

    await Task.find({ assignee: data.id }).populate('assignee task_type').exec().then(tasks => {
        if (tasks < 1) {
            return res.status(402).json({
                message: "No task data found",
            });
        } else {
            tasks = tasks.filter(function (task) {
                return task.assignee;
            });
            let startday = moment().subtract(1, 'months').startOf('month').date(28).format('YYYY-MM-DD hh:mm')
            let endday = moment().date(27).format('YYYY-MM-DD hh:mm')

            tasks.map((item) => {
                if (moment(item.deadline).isBetween(startday, endday)) {

                    tempsalary += item.task_type.price * item.completed;
                } else {
                    console.log(0);

                }
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });

    let query = {
        path: 'employee_id',
        match: {
            _id: data.id
        }
    }

    EmpSalary.find().populate(query).exec().then(found_empsalary => {
        if (found_empsalary < 1) {
            console.log("No empsalary data found");
        } else {
            found_empsalary.map((emps) => {
                if (emps.month == data.month) {
                    let totbonus = emps.bonus + data.bonus;
                    let totsalary = (totbonus + tempsalary);
                    let totepf = totsalary / 100 * 20;
                    let totetf = totsalary / 100 * 3
                    emps.bonus = Math.round(totbonus, 2);
                    emps.salary = Math.round((totsalary) - ((totsalary / 100) * 8), 2);
                    emps.epf = Math.round(totepf, 2);
                    emps.etf = Math.round(totetf, 2);
                    emps.status = "released"

                    emps.updated_at = new Date();

                    emps.save((err, updated_object) => {
                        if (err) { return next(err) }
                        else { console.log("emp salary updated"); }
                    })

                }
            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//create empsalary
export const createEmpSalary = async (data) => {
    try {
        const eslryDetails = data;
        const newEmpSalary = new EmpSalary(eslryDetails);

        await newEmpSalary.save(function (err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("EmpSalary successfully registred!");

            return
        });
    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create empsalary.",
            success: false
        });
    }
};

//create markslog
export const createMarkslog = async (data) => {
    try {
        const mklDetails = data;
        const newMarkslog = new Markslog(mklDetails);

        await newMarkslog.save(function (err) {
            if (err) {
                console.log(err);
                console.log("Error happended when creating marks log.");
                return
            }
            console.log("Markslog successfully logged!");
            return
        });
    } catch (err) {
        // Implement logger function (winston)
        console.log("Unable to create log.");
    }
};

//create total targets completed
export const createTotTC = async (data) => {
    let totdata;
    try {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // var startOfToday = new Date(moment.tz("2021-11-08", "Asia/Colombo").format());
        // var endOfToday = new Date(moment.tz("2021-11-09", "Asia/Colombo").format());
        // console.log(startOfToday);
        var query = Task.aggregate([
            { $match: { created_at: { $gte: startOfToday } } },
            { $group: { _id: null, targetot: { $sum: "$target" }, completedtot: { $sum: "$completed" } } }
        ])
        await query.then((data) => {


            if (data.length < 1) {
                console.log(" No task data found");

            } else {
                totdata = data;
            }
        }).then(() => {

            const newTotTC = new totalTC(totdata[0]);
            newTotTC.save(function (err) {
                if (err) {
                    console.log(err);
                    console.log("Error happended when creating marks log.");
                    return
                }
                console.log("TotTC successfully logged!");
                return
            });
        })


    } catch (err) {
        console.log("Unable to create log.");

    }
};


//Detect anomaly of last data points and send email notification
export const anomalyNotify = async (req, res, next) => {

    //array to store employee marks
    let newseries = [];
    //array to store mean value of factory daily output
    let meanseries = [];
    //employee array
    let empArr = [];
    //anomalize employee array
    let anoEmpsArr = []
    //anomalize fcatory array
    let anoFacArr = []


    //get all employees to an array
    await Employee.find({}).exec().then((user) => {
        if (user.length < 1) {
            console.log("No user found");
        } else {
            let data = user;
            empArr = data.map((item) => {
                return (
                    {
                        empid: item._id,
                        username: item.username
                    }
                )
            })
        }
    }).catch((err) => { console.log(err); });


    //function to get anomaly of last day performance of every employee
    let temp = empArr.map(async (empid) => {

        // append newseries array with employee marks and timestamp
        await Data_log.getMarksByEmpAno({ query: empid }).then((result) => {
            let temparr = result;
            newseries = temparr.map((log) => {
                return ({ timestamp: moment(log.created_at).format("YYYY-MM-DD"), value: log.marks })
            })
        })

        // if employee has at lease 12 days data, will send to detect anomaly
        if (newseries.length >= 12) {
            await azadController.azLastPointDetect(newseries).then((result) => {
                anoEmpsArr.push({ id: empid.empid, isAno: result, username: empid.username })
            }).then(() => {
                return true
            })
        }
    })

    await Promise.all(temp).then(() => {
        console.log("Employee anomaly detection Done!");
    })


    //function to get data for factory overall performance
    await Data_log.getAllTotalTCAno().then((result) => {
        let temparr = result;
        temparr.forEach((log) => {
            //calculate mean value
            let mean = (log.completedtot / log.targetot) * 100
            //data need to detect anomaly
            meanseries.push({ timestamp: moment(log.created_at).format("YYYY-MM-DD"), value: mean })
        })
    })

    // if has at lease 12 days data, will send to detect anomaly
    if (meanseries.length >= 12) {
        await azadController.azLastPointDetect(meanseries).then((result) => {
            anoFacArr.push(result)
        }).then(() => {
            return true
        })
    }

    Mailer.notifyMail([anoEmpsArr, anoFacArr])

}