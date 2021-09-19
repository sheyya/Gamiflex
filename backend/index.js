import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport'
import cron from 'node-cron'
import moment from "moment"
import { ANOMALY_DETECTOR_KEY, ANOMALY_DETECTOR_ENDPOINT } from './config/index.js'
import AnomalyDetectorClient from "@azure/ai-anomaly-detector"
import TimeGranularity from "@azure/ai-anomaly-detector"
import AzureKeyCredential from "@azure/core-auth"
//Import models
// import Employee from '../models/employee_model.js';
import * as adminController from './controllers/admin_ctrl.js';
import * as utils from './util/utils.js';
// import * as employeeController from '../controllers/employee_ctrl.js';

//Import routes
import adminRoutes from './routes/admin_route.js';
import managerRoutes from './routes/manager_route.js';
import employeeRoutes from './routes/employee_route.js';
import taskRoutes from './routes/tasks_route.js';
import empsalaryRoutes from './routes/empsalary_route.js';
import leavereq from './routes/leavereq_route.js';
import azanomaly from './routes/azanomaly_route.js';
import datalog from './routes/datalog_routes.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use(passport.initialize());

// require("./middlewares/passport")(passport);
import middlepassport from './middleware/passport.js';
middlepassport(passport);


//Routes
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/employee', employeeRoutes);
app.use('/tasks', taskRoutes);
app.use('/empsalary', empsalaryRoutes);
app.use('/leavereq', leavereq);
app.use('/azanomaly', azanomaly);
app.use('/datalog', datalog);

//azure anomaly detector
// let key = ANOMALY_DETECTOR_KEY;
// let endpoint = ANOMALY_DETECTOR_ENDPOINT;
// let anomalyDetectorClient = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(key));

//cron jobs
cron.schedule('0 30 23 * * *', function () {
    console.log("kk");
    dailylog()
}, {
    scheduled: true,
    timezone: "Asia/Colombo"
});

cron.schedule('0 30 23 27 * *', function () {
    console.log("kk");
    savesalary()
}, {
    scheduled: true,
    timezone: "Asia/Colombo"
});

cron.schedule('0 0 0 28 * *', function () {
    console.log("kk");
    clearmarks()
}, {
    scheduled: true,
    timezone: "Asia/Colombo"
});

const savesalary = async () => {
    let marksarr
    await utils.getEmployees().then((result) => {
        console.log(result);
        let rdata = result
        marksarr = rdata.map((item) => {
            return (
                {
                    id: item._id,
                    marks: item.marks
                }
            )
        })

    }).catch((err) => {
        console.log(err);
    })

    await marksarr.sort((a, b) => b.marks - a.marks);
    console.log(marksarr);
    marksarr.map((mk, index) => {
        let reward;
        if (index == 0) { reward = 5000 }
        else if (index == 1) { reward = 3000 }
        else if (index == 2) { reward = 2500 }
        else if (index > 2 && index < 12) { reward = 1500 }
        let d = {
            id: mk.id,
            bonus: reward + (mk.marks * 1.5),
            month: moment().format('MMM YY')
        }
        utils.updateEmpSalary(d)
    })

}

const clearmarks = () => {
    utils.getEmployees().then((result) => {
        console.log(result);
        let rdata = result
        rdata.map((item) => {
            const newdata = {
                id: item._id,
                marks: 0
            }
            //reset marks for next month
            utils.updateEmployee(newdata)

            //make salary doc for next month
            utils.createEmpSalary({ employee_id: item._id, month: moment().subtract(-1, 'months').format('MMM YY') })
        })

    }).catch((err) => {
        console.log(err);
    })


}

const dailylog = () => {
    utils.createTotTC()
    // utils.getEmployees().then((result) => {
    //     console.log(result);
    //     let rdata = result
    //     rdata.map((item) => {
    //         utils.targetCountTodayByEmp(item._id).then(async (result) => {
    //             const out = result
    //             // console.log(out[0].totarget);

    //             out.map((data) => {
    //                 const attendencemark = 5;
    //                 const newdata = {
    //                     id: data._id,
    //                     marks: Math.round(item.marks + attendencemark + (data.totcompleted / data.totarget * 100), 0)
    //                 }
    //                 const markslogdata = {
    //                     employee: data._id,
    //                     marks: Math.round(attendencemark + (data.totcompleted / data.totarget * 100)),
    //                     targetot: Math.round(data.totarget),
    //                     completedtot: Math.round(data.totcompleted)
    //                 }
    //                 // utils.updateEmployee(newdata)
    //                 utils.createMarkslog(markslogdata)
    //             })
    //         })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     })

    // }).catch((err) => {
    //     console.log(err);
    // })

}

//mongo connection
const CONNECTION_URL = 'mongodb+srv://gamiflexwebapp:webapp1gamiflex@gamiflex.um0jy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);