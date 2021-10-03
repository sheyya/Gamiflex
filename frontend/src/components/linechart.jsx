import React, { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts'
import AzAnomaly from "../controllers/azanomaly";
import DataLog from "../controllers/datalog";
import moment from "moment"
export function Linechart({ empid }) {

    const [anopoints, setAnopoints] = useState([])
    let pdata;

    const getnewdata = async () => {
        let newseries = [];
        console.log("--ss", empid);
        if (empid) {
            console.log(empid);

            await DataLog.getMarksByEmployee({ empid }).then((result) => {
                let temparr = result.data;
                console.log("------------", temparr);

                temparr.map((log) => {
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.completedtot })
                })
            })

        }
        else {
            await DataLog.getAllDatalogs().then((result) => {
                let temparr = result.data;
                temparr.map((log) => {
                    newseries.push({ x: moment(log.created_at).format("YYYY-MM-DD"), y: log.completedtot })
                })
            })
        }
        console.log("log", newseries);

        return newseries
    }

    useEffect(async () => {
        console.log("--ss");
        let senddata = []
        let datas = await getnewdata()
        setSeries([{ data: datas }])
        if (datas.length > 12) {
            datas.map((d) => {
                senddata.push({ "timestamp": d.x, "value": d.y })
            })
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
                type: "datetime"
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
