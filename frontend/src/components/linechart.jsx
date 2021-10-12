import React, { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts'
import AzAnomaly from "../controllers/azanomaly";
import DataLog from "../controllers/datalog";
import moment from "moment"
export function Linechart({ empid }) {

    const [anopoints, setAnopoints] = useState([])
    const [meanpoints, setMeanpoints] = useState([])
    let pdata;

    const getnewdata = async () => {
        let newseries = [];
        let meanseries = [];
        console.log("--ss", empid);
        if (empid) {
            console.log(empid);

            await DataLog.getMarksByEmployee({ empid }).then((result) => {
                let temparr = result.data;
                console.log("------------", temparr);

                temparr.map((log) => {
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.marks })
                })
            })

        }
        else {
            await DataLog.getAllDatalogs().then((result) => {
                let temparr = result.data;
                temparr.map((log) => {
                    let mean = log.completedtot / log.targetot
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.completedtot })
                    meanseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: mean })
                })

            })
        }
        console.log("log", meanseries);

        return [newseries, meanseries]
    }

    useEffect(async () => {
        console.log("--ss");
        let senddata = []
        let datas = await getnewdata()
        console.log("---------------", datas);

        setSeries([{ data: datas[0] }])
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
            console.log(senddata);

            await getanaompoints(senddata)
        }
    }, [])

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

    const getanaompoints = (senddata) => {
        AzAnomaly.getAnomaly(senddata).then(async (points) => {
            if (points.length < 0) {
                console.log("no anomaly");
            }
            else {
                console.log(points);
                let rdata = points.data;
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
                console.log("get data", pdata);

                await setAnopoints(prevState => ([...prevState, ...pdata]))
                console.log("ss", anopoints);

            }
        })
    }

    const [series, setSeries] = useState(
        [{ name: "Data", data: [] }]
    )
    const [options, setOptions] = useState({})



    return (


        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>

    );

}
