
import LeaveReq from '../models/leaverequest_model.js';

//create leaveReq
export const createLeaveReq = async (req, res) => {
    try {
        const lrqDetails = req.body;
        // console.log(req.body);
        const newLeaveReq = new LeaveReq(lrqDetails);


        await newLeaveReq.save(function (err) {
            if (err) {
                console.log(err);
                res.status(600).json({
                    message: "Error happended when creating leaveReq.",
                    error: err
                });
                return
            }

            res.status(201).json({
                message: "LeaveReq successfully registred!",
                success: true
            });
            return
        });
    } catch (err) {
        // Implement logger function (winston)
        return res.status(500).json({
            message: "Unable to create leaveReq.",
            success: false
        });
    }
};

//get all leaveReqs
export const getLeaveReqs = function (req, res, next) {
    LeaveReq.find({}).
        populate({ path: 'employee_id', select: 'member_id fname department' }).exec().then((user) => {
            if (user.length < 1) {
                return res.status(402).json({
                    message: "No leaveReqs data availble",
                });
            } else {
                // console.log(user);

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

// update leaveReqType
export const updateLeaveReq = async (req, res, next) => {
    let query = { _id: req.body.id }
    LeaveReq.findOne(query).exec().then(found_leaveReq => {
        if (found_leaveReq < 1) {
            return res.status(402).json({
                message: "No leaveReqType data found",
            });
        } else {

            if (req.body.employee_id) { found_leaveReq.employee_id = req.body.employee_id }
            if (req.body.reason) { found_leaveReq.reason = req.body.reason }
            if (req.body.approved_manager) { found_leaveReq.approved_manager = req.body.approved_manager }
            if (req.body.status) { found_leaveReq.status = req.body.status }
            if (req.body.dateRange) { found_leaveReq.dateRange = req.body.dateRange }
            if (req.body.updated_at) { found_leaveReq.updated_at = req.body.updated_at }

            found_leaveReq.updated_at = new Date();

            found_leaveReq.save((err, updated_object) => {
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

//get leaveReq by id
export const getLeaveReqByid = (req, res, next) => {

    let query = { _id: req.params.id }

    LeaveReq.findOne(query).populate('employee_id').exec().then(leaveReq => {
        if (leaveReq < 1) {
            return res.status(402).json({
                message: "No leaveReq data found",
            });
        } else {
            res.status(200).json({
                success: true,
                code: 200,
                data: leaveReq,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get filtered leaveReqs by employee
export const getLeaveReqsByEmp = (req, res, next) => {
    // console.log(req.query.id);
    // console.log("tt");

    let query = {
        path: 'employee_id',
        match: {
            _id: req.query.id
        }
    }

    LeaveReq.find().populate(query).exec().then(leaveReqs => {
        if (leaveReqs < 1) {
            return res.status(402).json({
                message: "No leaveReq data found",
            });
        } else {
            leaveReqs = leaveReqs.filter(function (leaveReq) {
                return leaveReq.employee_id;
            });
            res.status(200).json({
                success: true,
                code: 200,
                data: leaveReqs,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//delete leaveReq
export const deleteLeaveReq = (req, res, next) => {

    let query = { _id: req.params.id }

    LeaveReq.findOne(query).exec().then(found_leaveReq => {
        if (found_leaveReq < 1) {
            return res.status(402).json({
                message: "No leaveReqType data found",
            });
        } else {
            found_leaveReq.remove((err, result) => {
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
