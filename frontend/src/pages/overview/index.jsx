import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./dashboard.scss";
import jwt from 'jwt-decode';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Media
} from "reactstrap";
import { Leaderbord } from "../../components/leaderboard/leaderboard";
import { Linechart } from "../../components/linechart";
import Emp from "../../controllers/employee";
import Mngr from "../../controllers/manager";
import Tsk from "../../controllers/task";
import useAuth from "../../useAuth";
import Admin from "../../controllers/admin";
import moment from "moment"


export function Overview(props) {
    const { user } = useAuth();

    //get user token from local and retreive user role
    const userDataToken = localStorage.getItem('usertoken');
    let role = user.role || jwt(userDataToken).role;
    let userid = jwt(userDataToken).user_id

    const [loading, setLoading] = useState(false)
    const [mngrcountc, setMngrcountc] = useState(0)
    const [empcountc, setEmpcountc] = useState(0)
    const [taskcountc, setTaskcountc] = useState(0)
    const [taskcountbyempc, setTaskcountbyempc] = useState(0)
    const [targetcount, setTargetcount] = useState(0)
    const [completedcount, setCompletedcount] = useState(0)
    const [prevSalary, setPrevSalary] = useState(0);

    const location = useLocation();

    //Function to call one time at page reloads
    useEffect(() => {
        //get current user id
        userid = jwt(userDataToken).user_id

        //call functions relevant to the user role
        if (role === "admin") {
            getempcount();
            getmngrcount();
            gettaskscount();
            gettargetcount();
        }
        else if (role === "manager") {
            getempcount();
            gettaskscount();
            gettargetcount();
        }
        else if (role === "employee") {
            gettaskscountbyemp({ id: userid });
            gettargetcountbyemp({ id: userid });
            claculateSalary(userid)
        }

    }, [location]);

    let data;

    // get employee count
    const getempcount = () => {
        let out;
        setLoading(true)
        const ss = Emp.empCount()
            .then((result) => {
                out = result.count
                setEmpcountc(out)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                out = 0;
            });
        return ss;
    };

    // get manager count
    const getmngrcount = () => {
        setLoading(true)
        const ss = Mngr.mngrCount()
            .then((result) => {
                const out = result.count
                setMngrcountc(out)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                return 0
            });
        return ss
    };

    // get task count
    const gettaskscount = () => {
        setLoading(true)
        const ss = Tsk.getTasksCountToday()
            .then((result) => {
                const out = result.count
                setTaskcountc(out)
                setLoading(false)
                return out;
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
                return 0
            });
        return ss;
    };

    // get task count for employee dashboard
    const gettaskscountbyemp = (userid) => {
        setLoading(true)
        const ss = Tsk.getTasksCountTodaybyEmp(userid)
            .then((result) => {
                const out = result.count
                setTaskcountbyempc(out)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
        return ss;
    };

    // get target count
    const gettargetcount = () => {
        setLoading(true)
        Tsk.getTargetCountToday()
            .then((result) => {
                const out = result.data
                console.log(out);
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

    // get target count for employee dashboard
    const gettargetcountbyemp = (userid) => {
        setLoading(true)
        Tsk.getTargetCountTodaybyEmp(userid)
            .then((result) => {
                const out = result.data
                console.log(out);
                setTargetcount(out[0].totarget)
                setCompletedcount(out[0].totcompleted)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            });
    };

    // Get last salary for employee dashboard
    const claculateSalary = async (userid) => {
        Admin.getEmpSalaryByEmployee({ id: userid }).then((result) => {
            const rdata = result.data;
            console.log(rdata.length);
            rdata.map((item) => {
                //get previous month salary
                if (item.month == moment().subtract(1, 'months').format('MMM YY')) {
                    setPrevSalary(item.salary)
                }
            })
        }).catch((err) => { console.log(err); })
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <h4 className="mb-4">Dashboard</h4>
                    <Row>
                        <Col xl={8}>
                            <Row>
                                <Col md={3} className={role === "admin" || role === "manager" ? "d-block" : "d-none"}>
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
                                <Col md={3} className={role === "admin" ? "d-block" : "d-none"}>
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
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{role === "admin" || role === "manager" ? taskcountc : taskcountbyempc}</h4>}
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
                                <Col md={3} className={role === "employee" ? "d-block" : "d-none"}>
                                    <Card>
                                        <CardBody>
                                            <Media>
                                                <Media body className="overflow-hidden">
                                                    <p className="text-truncate font-size-14 mb-2">
                                                        {moment().subtract(1, 'months').format('MMMM')} Salary
                                                    </p>
                                                    {loading ? <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> : <h4 className="mb-0">{prevSalary.toFixed(2)} LKR</h4>}
                                                </Media>
                                                <div className="text-primary">
                                                    <i className="mdi mdi-currency-usd font-size-24"></i>
                                                </div>
                                            </Media>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {role === "employee" ? <></> : <Row>
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
