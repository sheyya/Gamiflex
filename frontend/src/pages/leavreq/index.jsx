import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
    Container,
    Button,
    Form,
    FormGroup,
    Label
} from "reactstrap";
import "./users.scss";
import moment from "moment"
import { useLocation } from "react-router-dom";
import LeaveReq from "../../controllers/leavereq";
import { MainTable } from "../../components/MainTable";
import { DeleteButton, EditButton, ApproveButton, RejectButton } from "../../components/Buttons";
import { message, Modal, Select, DatePicker, Input } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useAuth from "../../useAuth";
import jwt from 'jwt-decode'

export const LeaveReqs = (props) => {
    const [modal_addLeaveReq, setModal_addLeaveReq] = useState(false);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const { user } = useAuth();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;
    const { RangePicker } = DatePicker;
    const { TextArea } = Input;

    // Toggle add new leave request modal
    const toggleLeaveReq = () => setModal_addLeaveReq(!modal_addLeaveReq);
    let userid = jwt(userdatatk).user_id
    let mngr_mid;

    //state variable to store leavereq data
    const [leavereqState, setLeaveReqState] = useState({
        status: "pending",
        employee_id: "",
        reason: "",
        approved_manager: null,
        dateRange: ""
    })

    // loading message key
    const key = 'loading';

    //handle input changes for leavereqs
    const handleChange = (e) => {
        const value = e.target.value;
        setLeaveReqState({
            ...leavereqState,
            [e.target.name]: value
        });
    }


    const location = useLocation();

    useEffect(() => {
        // get request id form url
        let urldata = window.location.pathname.split("/");
        let req_id = urldata[urldata.length - 1];

        userid = jwt(userdatatk).user_id
        // get current user role and set id if user is admin or manager
        role === "admin" || role === "manager" ? mngr_mid = jwt(userdatatk).member_id : mngr_mid = "";

        setLeaveReqState({
            ...leavereqState,
            employee_id: userid
        })

        // Detect request type from url
        if (urldata[urldata.length - 2] === "reject") {
            showRejectConfirm(req_id);
        }
        if (urldata[urldata.length - 2] === "approve") {
            showApproveConfirm(req_id);
        }
        if (urldata[urldata.length - 2] === "delete") {
            showDeleteConfirm(req_id);
        }
        else {
            // Get all request if user is admin or manager
            if (role === "admin" || role === "manager") {
                loadAllLeaveReqs(null);
            }
            // Get only employees request if user is employee
            if (role === "employee") {
                loadleavereqbyemp(userid)
            }
        }
    }, [location]);

    //delete confirmation
    const { confirm } = Modal;
    const { Option } = Select;

    //show confirm dialog box
    function showDeleteConfirm(data) {
        confirm({
            title: 'Are you sure delete this?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteLeaveReqs(data)
            },
            onCancel() {
                props.history.push('/dashboard/leaverequests')
            },
        });
    }

    //show confirm dialog box
    function showApproveConfirm(data) {
        confirm({
            title: 'Are you sure approve this?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'success',
            cancelText: 'No',
            onOk() {
                updateLeaveReq(data, "approved") //Update status as Approved
            },
            onCancel() {
                props.history.push('/dashboard/leaverequests') //Reload data on table
            },
        });
    }

    //show confirm dialog box
    function showRejectConfirm(data) {
        confirm({
            title: 'Are you sure reject this?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                updateLeaveReq(data, "rejected")
            },
            onCancel() {
                props.history.push('/dashboard/leaverequests')
            },
        });
    }

    //update leave request with new status
    const updateLeaveReq = async (id, value) => {
        message.loading({ content: 'Updating Leave Request...', key, duration: 0 })
        let newdata = {
            id: id,
            status: value,
            approved_manager: mngr_mid
        }
        LeaveReq.updateLeaveReqs(newdata).then((response) => {
            message.success({ content: 'Updated Successfully', key, duration: 2 }).then(() => {
                props.history.push('/dashboard/leaverequests')
            })
        }).catch(err => {
            console.log(err);
        })
    };

    const deleteLeaveReqs = (params) => {
        message.loading({ content: 'Deleting...', key, duration: 0 })
        LeaveReq.deleteLeaveReq(params)
            .then((result) => {
                message.success({ content: 'Deleted!', key, duration: 1 }).then(() => {
                    props.history.push('/dashboard/leaverequests')
                })

            })
            .catch((err) => {
                message.error({ content: 'Error Occured!', key, duration: 2 });
            })
    };



    //getall leavereqs
    const loadAllLeaveReqs = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        LeaveReq.getAllLeaveReqs(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                console.log(rdata);
                setMeta(result.meta);
                setData(rdata.map((item) => {
                    const createdate = moment(item.created_at).format('YY MMM DD - HH:mm')
                    let apprmngr
                    if (item.approved_manager) { apprmngr = item.approved_manager }
                    else {
                        apprmngr = 'Not available'
                    }
                    console.log(item.employee_id);

                    return (
                        {
                            id: item._id,
                            employee_id: item.employee_id.member_id,
                            name: item.employee_id.fname,
                            department: item.employee_id.department,
                            approved_manager: apprmngr,
                            reason: item.reason,
                            dateRange: `${item.dateRange[0]} - ${item.dateRange[1]}`,
                            status: item.status === "approved" ? <div className="badge badge-soft-success font-size-14">{item.status}</div> : <div className="badge badge-soft-warning font-size-14">{item.status}</div>,
                            created_at: createdate
                        }
                    )
                }))


            })
            .catch((err) => {
                console.log(err);
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }

    //getall leavereqs by employee
    const loadleavereqbyemp = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        console.log(params);

        LeaveReq.getLeaveReqByEmployee({ id: params })
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                console.log(rdata);

                setData(rdata.map((item) => {
                    const creatdate = moment(item.created_at).format('YY MMM DD - HH:mm')
                    let apprmngr
                    if (item.approved_manager) { apprmngr = item.approved_manager }
                    else {
                        apprmngr = 'Not available'
                    }

                    console.log(item.dateRange[0]);

                    return (
                        {
                            id: item._id,
                            employee_id: item.employee_id.member_id,
                            name: item.employee_id.fname,
                            department: item.employee_id.department,
                            approved_manager: apprmngr,
                            reason: item.reason,
                            dateRange: `${item.dateRange[0]} - ${item.dateRange[1]}`,
                            status: item.status === "approved" ? <div className="badge badge-soft-success font-size-14">{item.status}</div> : <div className="badge badge-soft-warning font-size-14">{item.status}</div>,
                            created_at: creatdate
                        }
                    )
                }))


            })
            .catch((err) => {
                console.log(err);
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }

    let coloumnsdata;
    let buttondata;

    // Set table columns according to current user role
    if (role === "admin" || role === "manager") {
        coloumnsdata = [
            { label: "Employee ID", field: "employee_id" },
            { label: "Employee Name", field: "name" },
            { label: "Department", field: "department" },
            { label: "Approved Manager", field: "approved_manager" },
            { label: "Reason", field: "reason" },
            { label: "Status", field: "status" },
            { label: "Date Range", field: "dateRange" },
            { label: "Created Date", field: "created_at" },
        ]
        buttondata = [
            { button: <ApproveButton />, path: "leaverequests/approve/" },
            { button: <RejectButton />, path: "leaverequests/reject/" }
        ]
    } else {
        coloumnsdata = [
            { label: "Employee ID", field: "employee_id" },
            { label: "Employee Name", field: "name" },
            { label: "Department", field: "department" },
            { label: "Reason", field: "reason" },
            { label: "Status", field: "status" },
            { label: "Date Range", field: "dateRange" },
            { label: "Created Date", field: "created_at" },
        ]
        buttondata = [
            { button: <DeleteButton />, path: "leaverequests/delete/" },
        ]
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <h4 className="mb-0">Leave Requests</h4>
                    </div>
                    <Row>
                        <Col xs={12}>
                            {role === "employee" ? <Button
                                onClick={() => {
                                    setModal_addLeaveReq(true);
                                }}
                                // color="primary"
                                className="waves-effect waves-light mb-3 bg-table-blue" style={{ border: 'none' }}
                            >
                                <i className="ri-user-add-line align-middle"></i>
                                <span className="mx-2">Add Leave Request</span>
                            </Button> : <></>}
                            <Card>
                                <CardBody>
                                    <MainTable
                                        meta={meta}
                                        data={data}
                                        handlePageChange={loadAllLeaveReqs}
                                        columns={coloumnsdata}
                                        actions={buttondata}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Modal
                        title="Add Leave Request"
                        centered
                        maskClosable={false}
                        visible={modal_addLeaveReq}
                        onOk={() => {
                            LeaveReq.createLeaveReqs(leavereqState).then((result) => {
                                toggleLeaveReq()
                                setLeaveReqState({
                                    status: "pending",
                                    employee_id: "",
                                    reason: "",
                                    approved_manager: "",
                                    dateRange: ""
                                });
                                loadleavereqbyemp(userid);

                            })
                                .catch(err => {
                                    console.log(err);
                                })

                        }}
                        onCancel={toggleLeaveReq}
                        width={600}
                    >
                        <Form>
                            <Row>
                                <Col lg="12">
                                    <FormGroup>
                                        <Label for="target">Date Range</Label>
                                        <RangePicker className="mx-3" format="YYYY-MM-DD" onChange={(value, dateString) => {
                                            setLeaveReqState({ ...leavereqState, dateRange: dateString })
                                        }} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12" className="my-3">
                                    <FormGroup>
                                        <Label for="reason">Reason</Label>
                                        <TextArea
                                            rows={4}
                                            value={leavereqState.reason || ''}
                                            onChange={handleChange}
                                            validate={{ required: { value: true, errorMessage: 'Please enter Reason' } }}
                                            id="reason"
                                            name="reason"
                                        />
                                    </FormGroup>
                                </Col>

                            </Row>
                        </Form>
                    </Modal>
                </Container>
            </div>
        </React.Fragment >
    );
};
