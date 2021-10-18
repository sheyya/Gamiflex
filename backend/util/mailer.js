import nodemailer from 'nodemailer';
import moment from "moment"
import Employee from '../models/employee_model.js';

export const notifyMail = async (req, res, next) => {

    // recevied data
    let empAno = []
    let facAno = []

    // detected anomaly data
    let empAnoD = []

    empAno = req[0]
    facAno = req[1]
    console.log(empAno);

    // Append anomaly detected data to empAnoD
    empAno.forEach((element) => {
        if (element.isAno) {
            empAnoD.push(element)
        }
    });

    let msgData
    // Check if there is any anomaly detected employees
    if (empAnoD.length > 0) {
        // Appened detected employee data to msgData array
        msgData = empAnoD.map((emp) => {
            let data = `<li><a href="https://gamiflex.tinykiddies.com/dashboard/employee/view/${emp.id}">${emp.username}</a> : ${emp.isAno}</li>`
            return data
        })
    } else {
        // if no anomaly detected employee
        msgData = "No Anomalies Detected"
    }

    // Get current date
    let today = moment().format('DD MMM YYYY')

    // Email template
    const output = `
      <h2>Daily Anomaly Report</h2>
      <h3>${today}</h3>
      <p><b>Anomaly Detected on Factory: </b><span>${facAno[0]}</span></p>
      <p><b>Anomaly Detected on Employees: </b></p>
      <ul>
        ${msgData}
      </ul>
    `;
    console.log(output);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'contact@tinykiddies.com', // generated ethereal user
            pass: 'MCkQigwVe1Hn'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Gamiflex" <contact@tinykiddies.com>', // sender address
        to: 'sheshannarada@gmail.com', // list of receivers
        subject: `Daily Anomaly Report - ${today}`, // Subject line
        text: 'Anomaly Report', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
};
