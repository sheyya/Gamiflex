
import EmpSalary from '../models/empsalary.js';


//----- EMPLOYEE SALARY -----//

//create empsalary
export const createEmpSalary = async (req, res) => {
    try {
        const eslryDetails = req.body;
        const newEmpSalary = new EmpSalary(eslryDetails);

        await newEmpSalary.save(function (err) {
            if (err) {
                console.log(err);
                res.status(600).json({
                    message: "Error happended when creating empsalary.",
                    error: err
                });
                return
            }

            res.status(201).json({
                message: "EmpSalary successfully registred!",
                success: true
            });
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

//get all empsalarys
export const getEmpSalarys = function (req, res, next) {
    EmpSalary.find({}).
        populate({ path: 'employee_id', select: 'member_id' }).exec().then((user) => {
            if (user.length < 1) {
                return res.status(402).json({
                    message: "No empsalarys data availble",
                });
            } else {
                console.log(user);

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

// update empsalaryType
export const updateEmpSalary = async (req, res, next) => {
    console.log(req.query.id);
    let query = { _id: req.query.id }
    EmpSalary.findOne(query).exec().then(found_empsalary => {
        if (found_empsalary < 1) {
            return res.status(402).json({
                message: "No empsalaryType data found",
            });
        } else {

            if (req.body.employee_id) { found_empsalary.employee_id = req.body.employee_id }
            if (req.body.salary) { found_empsalary.salary = req.body.salary }
            if (req.body.epf) { found_empsalary.epf = req.body.epf }
            if (req.body.etf) { found_empsalary.etf = req.body.etf }
            if (req.body.bonus) { found_empsalary.bonus = req.body.bonus }
            if (req.body.status) { found_empsalary.status = req.body.status }
            if (req.body.month) { found_empsalary.month = req.body.month }
            if (req.body.updated_at) { found_empsalary.updated_at = req.body.updated_at }

            found_empsalary.updated_at = new Date();

            found_empsalary.save((err, updated_object) => {
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

//get empsalary by id
export const getEmpSalaryByid = (req, res, next) => {

    let query = { _id: req.params.id }

    EmpSalary.findOne(query).populate('assignee manager empsalary_type').exec().then(empsalary => {
        if (empsalary < 1) {
            return res.status(402).json({
                message: "No empsalary data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: empsalary,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get filtered empsalarys by employee
export const getEmpSalarysByEmp = (req, res, next) => {
    console.log(req.query.id);
    let query = {
        path: 'employee_id',
        match: {
            _id: req.query.id
        }
    }

    EmpSalary.find().populate(query).exec().then(empsalarys => {
        if (empsalarys < 1) {
            return res.status(402).json({
                message: "No empsalary data found",
            });
        } else {
            empsalarys = empsalarys.filter(function (empsalary) {
                return empsalary.employee_id;
            });
            res.status(200).json({
                success: true,
                code: 200,
                data: empsalarys,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//delete empsalary
export const deleteEmpSalary = (req, res, next) => {

    let query = { _id: req.params.id }

    EmpSalary.findOne(query).exec().then(found_empsalary => {
        if (found_empsalary < 1) {
            return res.status(402).json({
                message: "No empsalaryType data found",
            });
        } else {
            found_empsalary.remove((err, result) => {
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
