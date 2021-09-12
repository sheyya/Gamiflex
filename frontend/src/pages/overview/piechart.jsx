import * as React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

//Import Charts
import ReactApexChart from "react-apexcharts";
import "./dashboard.scss";

let state = {
  series: [42, 26, 15],
  options: {
    labels: ["Product A", "Product B", "Product C"],
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#5664d2", "#1cbb8c", "#eeb902"],
  },
};


export function PieCharts(props) {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="float-right">
            <select className="custom-select custom-select-sm">
              <option value="0">Apr</option>
              <option value="1">Mar</option>
              <option value="2">Feb</option>
              <option value="3">Jan</option>
            </select>
          </div>
          <h4 className="card-title mb-4">Sales Analytics</h4>

          <div id="donut-chart" className="apex-charts">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="donut"
              height="230"
            />
          </div>

          <Row>
            <Col xs={4}>
              <div className="text-center mt-4">
                <p className="mb-2 text-truncate">
                  <i className="mdi mdi-circle text-primary font-size-10 mr-1"></i>{" "}
                  Product A
                </p>
                <h5>42 %</h5>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center mt-4">
                <p className="mb-2 text-truncate">
                  <i className="mdi mdi-circle text-success font-size-10 mr-1"></i>{" "}
                  Product B
                </p>
                <h5>26 %</h5>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center mt-4">
                <p className="mb-2 text-truncate">
                  <i className="mdi mdi-circle text-warning font-size-10 mr-1"></i>{" "}
                  Product C
                </p>
                <h5>42 %</h5>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
