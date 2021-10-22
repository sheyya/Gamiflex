import React, { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts'
import AzAnomaly from "../controllers/azanomaly";
import DataLog from "../controllers/datalog";
import moment from "moment"

export function Linechart({ empid }) {
    //state variable to store anomalize points
    const [anopoints, setAnopoints] = useState([])
    //temp variable to store anomalize points
    let pdata;

    //Function to get data from employees and factory daily logs
    const getnewdata = async () => {

        //array to store employee marks
        let newseries = [];
        //array to store mean value of factory daily output
        let meanseries = [];

        //function to call if linechart request from employee details page
        if (empid) {
            await DataLog.getMarksByEmployee({ empid }).then((result) => {
                let temparr = result.data;
                temparr.forEach((log) => {
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.marks })
                })
            })
        }
        //function to call if linechart request from dashboard page
        else {
            //function to get data for factory overall performance
            await DataLog.getAllDatalogs().then((result) => {
                let temparr = result.data;
                temparr.forEach((log) => {
                    //calculate mean value
                    let mean = log.completedtot / log.targetot
                    //data need to render chart
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.completedtot })
                    //data need to detect anomaly
                    meanseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: mean })
                })
            })
        }
        return [newseries, meanseries]
    }

    useEffect(async () => {
        let senddata = []

        //get data from getnewdata() function
        let datas = await getnewdata()

        // getnewdata() return 2 arrays.
        // Store first array with employee marks
        setSeries([{ data: datas[0] }])

        // If array has more than 12 points call the anomaly detector
        if (datas[0].length >= 12 || datas[1].length >= 12) {
            //if its employee details page, send marks value to azure
            if (empid) {
                datas[0].forEach((d) => {
                    senddata.push({ "timestamp": d.x, "value": d.y })
                })
            }
            else {
                //if its dashboard page, send mean value to azure
                datas[1].forEach((d) => {
                    senddata.push({ "timestamp": d.x, "value": d.y })
                })
            }

            // Call anomaly detector function with data
            await getanaompoints(senddata)
        }
    }, [])

    // Function to display anomlize points in red color on chart
    // Calls only when there is anomalize points available
    useEffect(() => {
        setOptions({
            chart: {
                id: 'area-datetime',
                type: 'area',
                height: 350,
                zoom: {
                    autoScaleYaxis: true
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 5,
                style: 'hollow',
                discrete: anopoints
            },
            xaxis: {
                type: "datetime",
            },
            yaxis: {
                title: {
                    text: empid ? "Marks" : "Finished Pieces",
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },
            title: {
                text: empid ? "Daily Marks" : "Daily Output",
                align: 'left',
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    fontFamily: "Inter, sans-serif",
                    color: '#263238'
                },
            },
        })
    }, [anopoints])

    // Function to get anomaly points
    const getanaompoints = (senddata) => {
        console.log(senddata);

        AzAnomaly.getAnomaly(senddata).then(async (points) => {
            if (points.length < 0) {
                console.log("no anomaly");
            }
            else {
                let rdata = points.data;
                console.log(points);

                pdata = rdata.map((point) => {
                    return (
                        {
                            seriesIndex: 0,
                            dataPointIndex: point,
                            fillColor: '#f03434',
                            strokeColor: '#f1a9a0',
                            size: 7,
                            shape: "circle"
                        }
                    )
                })
                // Set found anomaly points to state variable
                await setAnopoints(prevState => ([...prevState, ...pdata]))
            }
        })
    }

    // State variable with table data and options
    const [series, setSeries] = useState(
        [{ name: "Data", data: [] }]
    )
    const [options, setOptions] = useState({})


    // Return chart using appexcharts library
    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
    );

}
