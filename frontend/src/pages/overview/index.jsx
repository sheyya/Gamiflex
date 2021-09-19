import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logodark from "../../assets/images/logo-dark.png";
import dayjs from "dayjs";
import "./dashboard.scss";
import jwt from 'jwt-decode';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Media,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
} from "reactstrap";
import { VieweButton } from "../../components/Buttons";
import { Leaderbord } from "../../components/leaderboard/leaderboard";
import { Linechart } from "../../components/linechart";
import Emp from "../../controllers/employee";
import Mngr from "../../controllers/manager";
import Tsk from "../../controllers/task";
import { Switch } from "antd";
import useAuth from "../../useAuth";


export function Overview(props) {
    const { user } = useAuth();
    const [modal_static, setModal_static] = useState(false);
    const [meta, setMeta] = useState({});
    const [invoiceList, setInvoiceList] = useState([]);
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;
    let userid = jwt(userdatatk).user_id
    let mngr_mid;
    // const [countData, setCountData] = useState({
    //     mngrcountc: 0, empcountc: 0, taskcountc: 0, taskcountbyempc: 0, targetcount: 0, completedcount: 0
    // })
    const [loading, setLoading] = useState(false)
    const [mngrcountc, setMngrcountc] = useState(0)
    const [empcountc, setEmpcountc] = useState(0)
    const [taskcountc, setTaskcountc] = useState(0)
    const [taskcountbyempc, setTaskcountbyempc] = useState(0)
    const [targetcount, setTargetcount] = useState(0)
    const [completedcount, setCompletedcount] = useState(0)
    const location = useLocation();

    useEffect(() => {

        let urldata = window.location.pathname.split("/");
        let req_id = urldata[urldata.length - 1];
        console.log(urldata[urldata.length - 2]);
        userid = jwt(userdatatk).user_id
        role == "admin" || role == "manager" ? mngr_mid = jwt(userdatatk).member_id : mngr_mid = "";
        console.log(role);

        if (role == "admin") {
            getempcount();
            getmngrcount();
            gettaskscount();
            gettargetcount();
        }
        else if (role == "manager") {
            getempcount();
            console.log(getempcount());
            gettaskscount();
            gettargetcount();
        }
        else if (role == "employee") {
            gettaskscountbyemp({ id: userid });
            gettargetcountbyemp({ id: userid })
        }

    }, [location]);

    let data;

    const getempcount = () => {
        let out;
        setLoading(true)
        const ss = Emp.empCount()
            .then((result) => {
                out = result.count
                setEmpcountc(out)
                // setCountData(prevState => ({
                //     ...prevState,
                //     empcountc: out
                // }));
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                out = 0;
            });

        return ss;
    };

    const getmngrcount = () => {
        setLoading(true)
        const ss = Mngr.mngrCount()
            .then((result) => {
                const out = result.count
                // console.log(out);
                setMngrcountc(out)
                setLoading(false)
                // setCountData(prevState => ({
                //     ...prevState,
                //     mngrcountc: out
                // }));


            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                return 0
            });
        return ss
    };

    const gettaskscount = () => {
        setLoading(true)
        const ss = Tsk.getTasksCountToday()
            .then((result) => {
                const out = result.count
                // console.log(out);
                setTaskcountc(out)
                setLoading(false)
                // setCountData(prevState => ({
                //     ...prevState,
                //     taskcountc: out
                // }));
                return out;
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                return 0
            });
        return ss;
    };

    const gettaskscountbyemp = (userid) => {
        setLoading(true)
        const ss = Tsk.getTasksCountTodaybyEmp(userid)
            .then((result) => {
                const out = result.count
                // console.log(out);
                setTaskcountbyempc(out)
                setLoading(false)
                // setCountData(prevState => ({
                //     ...prevState,
                //     taskcountbyempc: out
                // }));
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
        return ss;
    };

    const gettargetcount = () => {
        setLoading(true)
        Tsk.getTargetCountToday()
            .then((result) => {
                const out = result.data
                console.log(out);
                // setCountData({ ...countData, targetcount: out[0].totarget, completedcount: out[0].totcompleted })
                setTargetcount(out[0].totarget)
                setCompletedcount(out[0].totcompleted)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                return 0

            });
    };

    const gettargetcountbyemp = (userid) => {
        setLoading(true)
        Tsk.getTargetCountTodaybyEmp(userid)
            .then((result) => {
                const out = result.data
                console.log(out);
                // setCountData({ ...countData, targetcount: out[0].totarget, completedcount: out[0].totcompleted })
                setTargetcount(out[0].totarget)
                setCompletedcount(out[0].totcompleted)
                setLoading(false)

            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    };


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <h4 className="mb-4">Dashboard</h4>
                    <Row>
                        <Col xl={8}>
                            <Row>
                                <Col md={3} className={role == "admin" || role == "manager" ? "d-block" : "d-none"}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Employees
                                                    </p>
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{empcountc}</h4>}
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="ri-account-circle-line font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={3} className={role == "admin" ? "d-block" : "d-none"}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Managers
                                                    </p>
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{mngrcountc}</h4>}
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="mdi mdi-receipt font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Today Tasks
                          </p>
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{role == "admin" || role == "manager" ? taskcountc : taskcountbyempc}</h4>}
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="mdi mdi-receipt font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        Today Targets
                          </p>
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{completedcount}/<span className="text-muted"><small>{targetcount}</small></span></h4>}
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="mdi mdi-target font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {role == "employee" ? <></> : <Row>
                        <Col lg={10}>
                            <Linechart />
                        </Col>
                    </Row>}
                    <Row lg={10}>
                        <div className="page-title-box">
                            <h4 className="mb-0">Leaderboard</h4>
                        </div>

                        <div>
                            <Col xs={12} lg={12} xl={8}>
                                <Leaderbord />
                            </Col>
                        </div>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
}
