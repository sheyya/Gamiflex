import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { ANOMALY_DETECTOR_KEY, ANOMALY_DETECTOR_ENDPOINT } from '../config/index.js'
const { AnomalyDetectorClient, TimeGranularity } = require("@azure/ai-anomaly-detector");
// import AzureKeyCredential from "@azure/core-auth"
const { AzureKeyCredential } = require('@azure/core-auth');
// You will need to set this environment variables in .env file or edit the following values
let key = ANOMALY_DETECTOR_KEY;
let endpoint = ANOMALY_DETECTOR_ENDPOINT;

export const azChangePointDetect = async function (req, res, next) {
    // create client
    console.log(key);
    console.log(endpoint);

    const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(key));

    // construct request
    //   const request = {
    //     series: [
    //       { timestamp: new Date("2018-03-01T00:00:00Z"), value: 32858923 },
    //       { timestamp: new Date("2018-03-02T00:00:00Z"), value: 29615278 },
    //       { timestamp: new Date("2018-03-03T00:00:00Z"), value: 22839355 },
    //       { timestamp: new Date("2018-03-04T00:00:00Z"), value: 25948736 },
    //       { timestamp: new Date("2018-03-05T00:00:00Z"), value: 34139159 },
    //       { timestamp: new Date("2018-03-06T00:00:00Z"), value: 33843985 },
    //       { timestamp: new Date("2018-03-07T00:00:00Z"), value: 33637661 },
    //       { timestamp: new Date("2018-03-08T00:00:00Z"), value: 32627350 },
    //       { timestamp: new Date("2018-03-09T00:00:00Z"), value: 29881076 },
    //       { timestamp: new Date("2018-03-10T00:00:00Z"), value: 22681575 },
    //       { timestamp: new Date("2018-03-11T00:00:00Z"), value: 24629393 },
    //       { timestamp: new Date("2018-03-12T00:00:00Z"), value: 34010679 },
    //       { timestamp: new Date("2018-03-13T00:00:00Z"), value: 33893888 },
    //       { timestamp: new Date("2018-03-14T00:00:00Z"), value: 33760076 },
    //       { timestamp: new Date("2018-03-15T00:00:00Z"), value: 33093515 }
    //     ],
    //     granularity: TimeGranularity.daily
    //   };
    console.log(req.body);


    const request = {
        series: req.body,
        granularity: 'daily'
    };


    // get change point detect results
    const result = await client.detectChangePoint(request);
    const isChangePointDetected = result.isChangePoint.some((changePoint) => changePoint);
    let changedarr = [];
    if (isChangePointDetected) {
        console.log("Change points were detected from the series at index:");
        result.isChangePoint.forEach((changePoint, index) => {
            if (changePoint === true) {
                console.log(index);
                changedarr.push(index)
            }
        });
        return res.status(200).json({
            success: true,
            code: 200,
            data: changedarr,
        });
    } else {
        console.log("There is no change point detected from the series.");
        return res.status(402).json({
            message: "There is no change point detected from the series.e",
        });
    }
    // output:
    // Change points were detected from the series at index:
    // 9
}
