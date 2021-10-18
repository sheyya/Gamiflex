import totalTC from '../models/totaltc_model.js';
import markslog from '../models/markslog.js';


//get all total Tasks Completed
export const getAllTotalTC = function (req, res, next) {
    totalTC.find({}).exec().then((log) => {
        if (log.length < 1) {
            return res.status(402).json({
                message: "No data availble",
            });
        } else {
            return res.status(200).json({
                success: true,
                code: 200,
                data: log,
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


//get daily marks by employee
export const getMarksByEmp = (req, res, next) => {
    let query = {
        path: 'employee',
        match: {
            _id: req.query.empid
        }
    }

    markslog.find().populate(query).exec().then(markLg => {
        if (markLg < 1) {
            return res.status(402).json({
                message: "No data found",
            });
        } else {
            markLg = markLg.filter(function (leaveReq) {
                return leaveReq.employee;
            });

            res.status(200).json({
                success: true,
                code: 200,
                data: markLg,
            });
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

//get daily marks by employee for anomaly notify
export const getMarksByEmpAno = async (req, res, next) => {
    let output = [];
    let query = {
        path: 'employee',
        match: {
            _id: req.query.empid
        }
    }

    output = await markslog.find().populate(query).exec().then(markLg => {
        if (markLg < 1) {
            return res.status(402).json({
                message: "No data found",
            });
        } else {
            markLg = markLg.filter(function (leaveReq) {
                return leaveReq.employee;
            });
            return markLg;
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });

    return output;
}


//get all total Tasks Completed for Anomaly Notify
export const getAllTotalTCAno = async function (req, res, next) {
    let output = [];

    output = await totalTC.find({}).exec().then((log) => {
        if (log.length < 1) {
            return res.status(402).json({
                message: "No data availble",
            });
        } else {
            return log;
        }
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });

    return output;
};