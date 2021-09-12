import React, { useState } from "react";
import "../invoices/invoices.scss";
import { Link } from "react-router-dom";
import logodark from "../../assets/images/logo-dark.png";
import { Container, Row, Col, Card, CardBody, Media, Modal, ModalBody, ModalHeader, Table, UncontrolledTooltip } from "reactstrap";
import { DeleteButton, EditButton, VieweButton } from "../../components/Buttons";
import { MainTable } from "../../components/MainTable";

// import { BarCharts } from "./barchart";
// import { PieCharts } from "./piechart";

export function Overview(props) {
    const [modal_static, setModal_static] = useState(false);
    const [meta, setMeta] = useState({});
    // let data: { id; invoiceno; name; email; date; amount; status; }[] = [];
    const toggle = () => setModal_static(!modal_static);


    const loadAllInvoices = () => {
        return;
    }
    let data =
        [{
            id: "1",
            invoiceno: "1003232",
            name: "John Doe",
            email: "johndoe@mail.com",
            date: "01 jun 2021",
            amount: "$1200",
            status: <div className="badge badge-soft-warning font-size-14">unpaid</div>,
        },
        {
            id: "2",
            invoiceno: "1003232",
            name: "Jane Doe",
            email: "janedoe@mail.com",
            date: "11 jun 2021",
            amount: "$1000",
            status: <div className="badge badge-soft-success font-size-14">Paid</div>,
        },]

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <h4 className="mb-4">Dashboard</h4>
                    <Row>
                        <Col xl={8}>
                            <Row>
                                <Col md={4}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Users
                                                    </p>
                                                    <h4 className="mb-0">12</h4>
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="ri-account-circle-line font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>

                                        {/* <CardBody className="border-top py-3">
                                            <div className="text-truncate">
                                                <span className="badge text-success font-size-11 mr-1">
                                                    <i className="mdi mdi-menu-up"> </i> 24.5
                                                </span>
                                                <span className="text-muted ml-2">
                                                    From previous Period
                                                </span>
                                            </div>
                                        </CardBody> */}
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Invoices
                                                    </p>
                                                    <h4 className="mb-0">20</h4>
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="mdi mdi-receipt font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>

                                        {/* <CardBody className="border-top py-3">
                                            <div className="text-truncate">
                                                <span className="badge text-success font-size-11 mr-1">
                                                    <i className="mdi mdi-menu-up"> </i> 24.5
                                                </span>
                                                <span className="text-muted ml-2">
                                                    From previous Period
                                                </span>
                                            </div>
                                        </CardBody> */}
                                    </Card>
                                </Col>

                            </Row>

                            {/* revenue Analytics */}
                            {/* <BarCharts /> */}
                        </Col>

                        <Col xl={4}>
                            {/* sales Analytics */}
                            {/* <PieCharts /> */}
                        </Col>
                    </Row>
                    <Row>
                        <div className="page-title-box">
                            <h4 className="mb-0">Recent Invoices</h4>
                        </div>

                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <MainTable
                                            meta={meta}
                                            data={data}
                                            handlePageChange={loadAllInvoices}
                                            columns={[
                                                {
                                                    label: "Invoice No.",
                                                    field: "invoiceno"
                                                },
                                                {
                                                    label: "Name",
                                                    field: "name"
                                                },
                                                {
                                                    label: "Email",
                                                    field: "email"
                                                },
                                                {
                                                    label: "Dane",
                                                    field: "date"
                                                },
                                                {
                                                    label: "Amount",
                                                    field: "amount"
                                                },
                                                {
                                                    label: "Status",
                                                    field: "status"
                                                }
                                            ]}
                                            actions={[
                                                { button: <VieweButton />, path: "/dashboard/invoice/" },
                                            ]}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Modal
                            isOpen={modal_static}
                            toggle={toggle}
                            backdrop="static"
                            centered
                            size="lg"
                        >
                            <ModalHeader
                                toggle={() => {
                                    setModal_static(false);
                                }}
                            >
                                View Invoice{" "}
                                <Link to="#" type="button" className="mx-2 text-success">
                                    {" "}
                                    <i className="mdi mdi-printer font-size-20"></i>
                                </Link>
                            </ModalHeader>
                            <ModalBody style={{ fontFamily: "sans-serif" }} className="px-5">
                                <Row className="mb-4">
                                    <Col lg="6" sm="6" xs="6">
                                        <h2>INVOICE</h2>
                                    </Col>
                                    <Col lg="6" sm="6" xs="6" className="logo">
                                        <span className="logo-lg">
                                            <img
                                                style={{ float: "right" }}
                                                src={logodark}
                                                height="30"
                                                alt="logo"
                                            />
                                        </span>
                                        <span style={{ float: "right" }} className="logo-sm">
                                            <img
                                                style={{ float: "right" }}
                                                src={logodark}
                                                height="20"
                                                alt="logo"
                                            />
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6" sm="5">
                                        <Row>
                                            <p className="fw-bolder">RockDen Advisors</p>
                                            <p>John Doe</p>
                                            <p>johndoe@gmail.com</p>
                                        </Row>
                                        <Row className="mt-3">
                                            <p className="fw-bolder">Bill to</p>
                                            <p>John Doe</p>
                                            <p>johndoe@gmail.com</p>
                                        </Row>
                                    </Col>
                                    <Col lg="6" sm="7" className="mt-3">
                                        <Row>
                                            <Col lg="6" sm="6" xs="6">
                                                <b>
                                                    <p>Invoice No.</p>
                                                    <p>Invoiced On</p>
                                                    <p>Due Date</p>
                                                    <p>Amount</p>
                                                    <p>Status</p>
                                                </b>
                                            </Col>
                                            <Col lg="6" sm="6" xs="6">
                                                <p>10067373</p>
                                                <p>01 Jun 2021</p>
                                                <p>25 Jun 2021</p>
                                                <p>$100</p>
                                                <p>Unpaid</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="mt-3">
                                        <div className="table-responsive">
                                            <Table className="mb-0 invoice-table">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Description</th>
                                                        <th></th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>June Advisory Fee</td>
                                                        <td></td>
                                                        <td>$200</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td className="fw-bolder">Total</td>
                                                        <td className="fw-bolder">$1200</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </Row>
                            </ModalBody>
                        </Modal>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}
