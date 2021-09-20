import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import moment from "moment"
import "./users.scss";
import {
    Row,
    Col,
    Card,
    CardBody,
    Label,
    FormGroup,
    Container,
    Button,
    Input,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    UncontrolledTooltip,
} from "reactstrap";
import logodark from "../../assets/images/logo-dark.png";
import Tasks from "../../controllers/task";
import Admin from "../../controllers/admin";
import { message, Select, DatePicker, InputNumber } from "antd";
import useAuth from "../../useAuth";
import jwt from 'jwt-decode'

const Task = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenGroup, setDropdownOpenGroup] = useState(false);
    const [changeCompletedVal, setChangeCompletedVal] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const toggleDropdownGroup = () => setDropdownOpenGroup((prevState) => !prevState);
    const toggleDropdownWallet = () => setDropdownOpenWallet((prevState) => !prevState);
    const location = useLocation();
    let data = [];
    const { user } = useAuth();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;

    const { Option } = Select;

    const [taskdata, setTaskData] = useState({
        task_name: "",
        department: "",
        assignee: "",
        assignee_name: "",
        manager: "",
        manager_name: "",
        target: 0,
        completed: 0,
        completedbyEmp: 0,
        status: "",
        deadline: ""
    });
    const [enableEdit, setEnableEdit] = useState(false);
    // const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [getDataT, setGetDataT] = useState([{
        value: "",
        name: "",
    }])

    const [getDataE, setGetDataE] = useState([{
        empIDs: "",
        empid: "",
    }])

    const [getDataM, setGetDataM] = useState([{
        mngrIDs: "",
        mngrid: ""
    }])


    //handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
        setTaskData({
            ...taskdata,
            [e.target.name]: value,
        });
        console.log(taskdata);

    };

    // handle department change
    const handleDepartmentChange = (value) => {
        console.log(value);

        setTaskData(
            {
                ...taskdata, department: value
            }
        )
        console.log(taskdata.department);

    }

    //handle manager
    const handleManagerIDChange = (value) => {
        console.log(value);

        setTaskData(
            {
                ...taskdata, manager: value
            }
        )
        console.log(taskdata.manager);

    }

    // handle task type
    const handleTaskTypeChange = (value) => {
        console.log(value);

        setTaskData(
            {
                ...taskdata, task_name: value
            }
        )
        console.log(taskdata.task_name);

    }

    // handle task completd
    const handleChangeCompleted = (value) => {
        console.log(value);
        setChangeCompletedVal(true)
        setTaskData(
            {
                ...taskdata, completed: value
            }
        )
        console.log(taskdata.completed);

    }

    // handle task completd by emp
    const handleChangeCompletedbyEmp = (value) => {
        console.log(value);

        setTaskData(
            {
                ...taskdata, completedbyEmp: value
            }
        )
        console.log(taskdata.completedbyEmp);

    }

    useEffect(() => {
        // const taskid = location.state.id;
        // const isEdit = location.state.edit;
        let urldata = window.location.pathname.split("/");
        let taskid = urldata[urldata.length - 1];
        console.log(urldata[urldata.length - 2]);

        loadTask(taskid)
        loadAllTaskType();
        if (urldata[urldata.length - 2] === "edit") {
            setEnableEdit(true);
        }

    }, [location]);


    // loading message key
    const key = 'loading';

    //getall tasktypes, managers, employees IDS
    const loadAllTaskType = async () => {
        // setLoading(true)
        await Tasks.getAllTaskTypes()
            .then((result) => {
                const data = result.taskTypes;
                console.log(data);
                setGetDataT(data.map((item) => {
                    return (
                        {
                            value: `${item.department} - ${item.main_product} - ${item.sub_product}`,
                            name: `${item.department} - ${item.main_product} - ${item.sub_product}`,
                        }
                    )
                }))
                // setLoading(false)
            })
            .catch((err) => {
            })



        await Admin.getAllManagers().then((result) => {
            const data = result.managers;
            setGetDataM(data.map((item) => {
                return (
                    {
                        mngrIDs: `${item.member_id} - ${item.fname}`,
                        mngrid: item._id
                    }
                )
            }))
            // setLoading(false)
        })
            .catch((err) => {
            })

    }


    const loadTask = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })

        Tasks.getTaskByID(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const data = result.data;
                console.log(data);
                setTaskData(
                    {
                        id: data._id,
                        task_name: `${data.task_type.department} - ${data.task_type.main_product} - ${data.task_type.sub_product}`,
                        department: data.department,
                        assignee: data.assignee._id,
                        assignee_name: data.assignee.member_id,
                        manager: data.manager._id,
                        manager_name: data.manager.member_id,
                        target: data.target,
                        completed: data.completed,
                        completedbyEmp: data.completedbyEmp,
                        status: data.status,
                        deadline: data.deadline
                    }

                );
            })
            .catch((err) => {
                console.log(err);

            })
    };


    const updateTask = async () => {
        message.loading({ content: 'Updating Task...', key, duration: 0 })
        if (
            taskdata.task_name.trim().length > 0 &&
            taskdata.department.trim().length > 0 &&
            taskdata.assignee.trim().length > 0 &&
            taskdata.manager.trim().length > 0 &&
            taskdata.deadline.trim().length > 0 &&
            taskdata.target.valueOf() > 0
        ) {
            console.log(taskdata);
            if (taskdata.target == taskdata.completed) { taskdata.status = "completed" }
            if (role !== "employee" && changeCompletedVal && taskdata.completedbyEmp > 0) {
                taskdata.completedbyEmp = 0;
            }
            Tasks.updateTasks(taskdata).then((response) => {
                console.log(response);
                message.success({ content: 'Data Updated Successfully', key, duration: 2 }).then(() => {
                    props.history.push('/dashboard/tasks/')
                })
            }).catch(err => {
                console.log(err);
            })
        } else {
            console.log(taskdata);
            message.error({ content: "Please fill all fields", key, duration: 2 });
            console.log("Error");
        }
    };



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Row>

                        <Row>
                            <div className="page-title-box">
                                <h4 className="mb-0">
                                    Set Completed Value
                                </h4>
                            </div>
                        </Row>
                        <div className="d-inline-flex">
                            <Col lg="1">
                                <FormGroup className="w-100">
                                    <InputNumber
                                        onChange={role == "employee" ? handleChangeCompletedbyEmp : handleChangeCompleted}
                                        name={role == "employee" ? "completedbyEmp" : "completed"}
                                        max={taskdata.target}
                                        className="form-control w-100"
                                        defaultValue={taskdata.completed}
                                        value={role == "employee" ? taskdata.completedbyEmp : taskdata.completed}
                                        id="task-address"
                                    />
                                </FormGroup>
                            </Col>
                            <Button
                                onClick={() => { updateTask() }}
                                color="primary"
                                className="waves-effect waves-light mb-3 mx-3"
                            >Update</Button>
                            {role !== "employee" ? <div className="d-inline-flex my-auto">
                                <h6>Employee Submitted Value:</h6>
                                <p className="mx-2">{taskdata.completedbyEmp}</p>
                            </div> : <></>}
                        </div>
                        <Row>
                            <div className="page-title-box mt-3">
                                <h4 className="mb-0">
                                    {enableEdit ? "Edit Task Details" : "Task Details"}
                                </h4>
                            </div>{role == "manager" || role == "admin" ?
                                <div className="d-inline-flex">
                                    <Col lg="3">
                                        <Button
                                            onClick={() => {
                                                enableEdit ? updateTask() : setEnableEdit(true);
                                            }}
                                            color="primary"
                                            className="waves-effect waves-light mb-3"
                                        >
                                            <span className="mx-2">{enableEdit ? "Save" : "Edit"}</span>
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                enableEdit
                                                    ? setEnableEdit(false)
                                                    : props.history.push("/dashboard/tasks");
                                            }}
                                            color="light"
                                            className="waves-effect waves-light mb-3 mx-3"
                                        >
                                            <span className="mx-2">
                                                {enableEdit ? "Cancel" : "Go Back"}
                                            </span>
                                        </Button>
                                    </Col>
                                </div>
                                : <></>}
                        </Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <Row>
                                            <Col lg="12">
                                                <Row>
                                                    <Col lg="2">
                                                        <FormGroup>
                                                            <Label for="task-firstname">Task name</Label>
                                                            {enableEdit ? (
                                                                <Select
                                                                    showSearch
                                                                    style={{ display: "block" }}
                                                                    placeholder="Select Task Type"
                                                                    optionFilterProp="children"
                                                                    onChange={handleTaskTypeChange}
                                                                    defaultValue={taskdata.task_name}
                                                                    filterOption={(input, option) =>
                                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    }
                                                                >
                                                                    {getDataT.map(({ name, value }) => (
                                                                        <Option key={value} value={value}>
                                                                            {name}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            ) : (
                                                                    <p>{taskdata.task_name}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="2">
                                                        <FormGroup>
                                                            <Label for="task-lastname">Department</Label>
                                                            {enableEdit ? (
                                                                <Select
                                                                    showSearch
                                                                    style={{ display: "block" }}
                                                                    placeholder="Select Department"
                                                                    optionFilterProp="children"
                                                                    defaultValue={taskdata.department}
                                                                    onChange={handleDepartmentChange}
                                                                    filterOption={(input, option) =>
                                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    }
                                                                >
                                                                    <Option key={1} value="Cutting">
                                                                        Cutting
                                                                </Option>
                                                                    <Option key={2} value="Packing">
                                                                        Packing
                                                                </Option>
                                                                    <Option key={3} value="Sewing">
                                                                        Sewing
                                                                </Option>
                                                                    <Option key={4} value="Quality Checking">
                                                                        Quality Checking
                                                                </Option>
                                                                </Select>
                                                            ) : (
                                                                    <p>{taskdata.department}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="2">
                                                        <FormGroup>
                                                            <Label for="task-email">Manager</Label>
                                                            {enableEdit ? (
                                                                <Select
                                                                    showSearch
                                                                    style={{ display: "block" }}
                                                                    placeholder="Select Task Type"
                                                                    optionFilterProp="children"
                                                                    onChange={handleManagerIDChange}
                                                                    defaultValue={taskdata.manager_name}
                                                                    filterOption={(input, option) =>
                                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                    }
                                                                >
                                                                    {getDataM.map(({ mngrIDs, mngrid }) => (
                                                                        <Option key={mngrid} value={mngrid}>
                                                                            {mngrIDs}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            ) : (
                                                                    <p>{taskdata.manager_name}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="1">
                                                        <FormGroup>
                                                            <Label for="task-phone">Assignee</Label>
                                                            {enableEdit ? (
                                                                <p>{taskdata.assignee_name}</p>

                                                            ) : (
                                                                    <p>{taskdata.assignee_name}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="1">
                                                        <FormGroup>
                                                            <Label for="task-address">Target</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="target"
                                                                    type="number"
                                                                    className="form-control"
                                                                    defaultValue={taskdata.target}
                                                                    id="task-address"
                                                                />
                                                            ) : (
                                                                    <p>{taskdata.target}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="2">
                                                        <FormGroup>
                                                            <Label for="task-address">Completed(Approved)</Label>
                                                            <p>{taskdata.completed}</p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="2">
                                                        <FormGroup>
                                                            <Label for="task-address">Deadline</Label>
                                                            {enableEdit ? (
                                                                <DatePicker showTime defaultValue={moment(taskdata.deadline)} format="YYYY-MM-DD h:mm A" style={{ display: "block" }} onChange={(value, dateString) => {
                                                                    setTaskData({ ...taskdata, deadline: dateString })
                                                                }} />
                                                            ) : (
                                                                    <p>{moment(taskdata.deadline).format('YY MMM DD - h:mm A')}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Task;
