import React, { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts'
import AzAnomaly from "../../controllers/azanomaly";
import moment from "moment"
export function Linechart() {

    const [anopoints, setAnopoints] = useState([])
    let pdata;
    const getnewdata = () => {

        let seriesd = [
            [new Date("2018-03-01T00:00:00Z").getTime(), 32858923],
            [new Date("2018-03-02T00:00:00Z").getTime(), 29615278],
            [new Date("2018-03-03T00:00:00Z").getTime(), 22839355],
            [new Date("2018-03-04T00:00:00Z").getTime(), 25948736],
            [new Date("2018-03-05T00:00:00Z").getTime(), 34139159],
            [new Date("2018-03-06T00:00:00Z").getTime(), 33843985],
            [new Date("2018-03-07T00:00:00Z").getTime(), 33637661],
            [new Date("2018-03-08T00:00:00Z").getTime(), 36627350],
            [new Date("2018-03-09T00:00:00Z").getTime(), 29881076],
            [new Date("2018-03-10T00:00:00Z").getTime(), 39681575],
            [new Date("2018-03-11T00:00:00Z").getTime(), 24629393],
            [new Date("2018-03-12T00:00:00Z").getTime(), 34010679],
            [new Date("2018-03-13T00:00:00Z").getTime(), 33893888],
            [new Date("2018-03-14T00:00:00Z").getTime(), 33760076],
            [new Date("2018-03-16T00:00:00Z").getTime(), 33093515],
            [new Date("2018-03-17T00:00:00Z").getTime(), 32858923],
            [new Date("2018-03-18T00:00:00Z").getTime(), 29615278],
            [new Date("2018-03-19T00:00:00Z").getTime(), 22839355],
            [new Date("2018-03-20T00:00:00Z").getTime(), 25948736],
            [new Date("2018-03-21T00:00:00Z").getTime(), 34139159],
            [new Date("2018-03-22T00:00:00Z").getTime(), 33843985],
            [new Date("2018-03-23T00:00:00Z").getTime(), 33637661],
            [new Date("2018-03-24T00:00:00Z").getTime(), 32627350],
            [new Date("2018-03-25T00:00:00Z").getTime(), 29881076],
            [new Date("2018-03-26T00:00:00Z").getTime(), 22681575],
            [new Date("2018-03-27T00:00:00Z").getTime(), 24629393],
            [new Date("2018-03-28T00:00:00Z").getTime(), 34010679],
            [new Date("2018-03-29T00:00:00Z").getTime(), 33893888],
            [new Date("2018-03-30T00:00:00Z").getTime(), 33760076]
        ]
        return seriesd;
    }

    useEffect(async () => {
        console.log("--ss");
        let senddata = []
        let data = getnewdata()
        data.map((d) => {
            senddata.push({ "timestamp": moment(d[0]).format("DD MMM YYYY hh:mm a"), "value": d[1] })
        })
        console.log(senddata);

        await getanaompoints(senddata)

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
            annotations: {
                yaxis: [{
                    y: 30,
                    borderColor: '#999',
                    label: {
                        show: true,
                        text: 'Support',
                        style: {
                            color: "#fff",
                            background: '#00E396'
                        }
                    }
                }],
                xaxis: [{
                    x: new Date('14 Nov 2012').getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Rally',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    }
                }]
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
                type: 'datetime',
                min: new Date('01 Mar 2018').getTime(),
                tickAmount: 6,
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
        [{ name: "Data", data: getnewdata() }]
    )
    const [options, setOptions] = useState({})



    return (


        <div id="chart">
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>

    );

}
