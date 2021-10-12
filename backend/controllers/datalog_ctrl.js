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
            console.log(log);
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


//get filtered leaveReqs by employee
export const getMarksByEmp = (req, res, next) => {
    // console.log("---id", req.query.empid);

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
