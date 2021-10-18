import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { ANOMALY_DETECTOR_KEY, ANOMALY_DETECTOR_ENDPOINT } from '../config/index.js'
const { AnomalyDetectorClient, TimeGranularity } = require("@azure/ai-anomaly-detector");
const { AzureKeyCredential } = require('@azure/core-auth');
let key = ANOMALY_DETECTOR_KEY;
let endpoint = ANOMALY_DETECTOR_ENDPOINT;

export const azChangePointDetect = async function (req, res, next) {

    // create client
    const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(key));

    const request = {
        series: req.body,
        granularity: 'daily',
        sensitivity: 90,
    };

    // get anomalies
    await client.detectEntireSeries(request).then((response) => {
        let changedarr = [];

        for (let item = 0; item < response.isAnomaly.length; item++) {
            if (response.isAnomaly[item]) {
                changedarr.push(item)
            }
        }

        return res.status(200).json({
            success: true,
            code: 200,
            data: changedarr,
        });
    }).catch((error) => {
        console.log(error)
    })

}


export const azLastPointDetect = async function (req, res, next) {

    let isAnomaly
    // create client
    const client = new AnomalyDetectorClient(endpoint, new AzureKeyCredential(key));

    const request = {
        series: req,
        granularity: 'daily',
        sensitivity: 90,
    };

    // get anomalies
    await client.detectLastPoint(request).then((response) => {
        isAnomaly = response.isAnomaly
    }).catch((error) => { console.log(error) })

    return isAnomaly;
}
