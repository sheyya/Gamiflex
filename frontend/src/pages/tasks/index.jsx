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
    Input,
    Label,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import "./users.scss";
import moment from "moment"
import { useLocation } from "react-router-dom";
import Task from "../../controllers/task";
import Admin from "../../controllers/admin";
import { MainTable } from "../../components/MainTable";
import { DeleteButton, EditButton, VieweButton } from "../../components/Buttons";
import { message, Modal, Select, DatePicker } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useAuth from "../../useAuth";
import jwt from 'jwt-decode'

export const Tasks = (props) => {
    const [modal_addTask, setModal_addTask] = useState(false);
    const [modal_addTaskType, setModal_addTaskType] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const { user } = useAuth();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;

    // toggle Modals
    const toggleTask = () => setModal_addTask(!modal_addTask);
    const toggleTaskType = () => setModal_addTaskType(!modal_addTaskType);


    //get task data
    const [taskState, setTaskState] = useState({
        status: "ongoing",
        completed: 0,
        updated_at: "",
        task_type: "",
        department: "",
        assignee: "",
        manager: "",
        target: 0,
        deadline: "",
    })

    //set task type data on change
    const [taskTypeState, setTaskTypeState] = useState({
        department: "",
        main_product: "",
        sub_product: "",
        price: 0,
    })

    //set task type data
    const [getDataT, setGetDataT] = useState([{
        value: "",
        name: "",
        typeid: ""
    }])

    //set employee data
    const [getDataE, setGetDataE] = useState([{
        empIDs: "",
        empid: "",
    }])

    //set manager data
    const [getDataM, setGetDataM] = useState([{
        mngrIDs: "",
        mngrid: ""
    }])


    //handle input changes for tasks
    const handleChange = (e) => {
        const value = e.target.value;
        setTaskState({
            ...taskState,
            [e.target.name]: value
        });
    }


    //handle input changes for tasks type form
    const handleTaskTypeChange = (value) => {
        setTaskState(
            {
                ...taskState, task_type: value
            }
        )
    }

    //handle input changes for tasks employee
    const handleEmployeeIDChange = (value) => {
        setTaskState(
            {
                ...taskState, assignee: value
            }
        )
    }

    //handle input changes for tasks manager
    const handleManagerIDChange = (value) => {
        setTaskState(
            {
                ...taskState, manager: value
            }
        )
    }

    //handle input changes for tasktypes
    const handleChangeT = (e) => {
        const value = e.target.value;
        setTaskTypeState({
            ...taskTypeState,
            [e.target.name]: value
        });
    }

    const location = useLocation();


    useEffect(() => {
        let urldata = window.location.pathname.split("/");
        let dataid = urldata[urldata.length - 1];
        let userid = jwt(userdatatk).user_id

        if (urldata[urldata.length - 2] === "delete") {
            showDeleteConfirm(dataid);
        } else {

            if (role === "admin" || role === "manager") {
                loadAllTasks(null);
                loadAllTaskType();
            }
            if (role === "employee") {
                loadtaskbyemp({ id: userid })
            }
        }

    }, [location]);

    //delete confirmation
    const { confirm } = Modal;
    const { Option } = Select;

    function showDeleteConfirm(data) {
        confirm({
            title: 'Are you sure delete this?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteTasks(data)
            },
            onCancel() {
                props.history.push('/dashboard/tasks')
            },
        });
    }

    // loading message key
    const key = 'loading';

    // Task delete function
    const deleteTasks = (params) => {
        message.loading({ content: 'Deleting...', key, duration: 0 })
        Task.deleteTask(params)
            .then((result) => {
                message.success({ content: 'Deleted!', key, duration: 1 }).then(() => {
                    props.history.push('/dashboard/tasks')
                })

            })
            .catch((err) => {
                message.error({ content: 'Error Occured!', key, duration: 2 }).then(() => {
                    props.history.push('/dashboard/tasks')
                })
            })
    };

    //getall tasktypes, managers, employees IDS
    const loadAllTaskType = async () => {
        await Task.getAllTaskTypes()
            .then((result) => {
                const data = result.taskTypes;
                setGetDataT(data.map((item) => {
                    return (
                        {
                            value: `${item.department} - ${item.main_product} - ${item.sub_product}`,
                            name: `${item.department} - ${item.main_product} - ${item.sub_product}`,
                            typeid: item._id
                        }
                    )
                }))
            }).catch((err) => { console.log(err); })

        await Admin.getAllEmployees().then((result) => {
            const data = result.data;
            console.log(data);
            setGetDataE(data.map((item) => {
                return (
                    {
                        empIDs: `${item.member_id} - ${item.fname}`,
                        empid: item._id
                    }
                )
            }))
        }).catch((err) => { console.log(err); })

        await Admin.getAllManagers().then((result) => {
            const data = result.data;
            setGetDataM(data.map((item) => {
                return (
                    {
                        mngrIDs: `${item.member_id} - ${item.fname}`,
                        mngrid: item._id
                    }
                )
            }))
        }).catch((err) => { console.log(err); })
    }

    //getall tasks
    const loadAllTasks = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Task.getAllTasks(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                setMeta(result.meta)
                setData(rdata.map((item) => {
                    const udate = moment(item.updated_at).format('MMM DD - HH:mm')
                    const deaddate = moment(item.deadline).format('MMM DD - HH:mm')
                    return (
                        {
                            id: item._id,
                            task_type: `${item.task_type.department} - ${item.task_type.main_product} - ${item.task_type.sub_product}`,
                            department: item.department,
                            assignee: item.assignee.member_id,
                            manager: item.manager.member_id,
                            target: item.target,
                            completed: item.completed,
                            status: item.status === "completed" ? <div className="badge badge-soft-success font-size-14">{item.status}</div> : item.status === "ongoing" ? <div className="badge badge-soft-warning font-size-14">{item.status}</div> : item.status === "expired" ? <div className="badge badge-soft-secondary font-size-14">{item.status}</div> : <div className="badge badge-soft-info font-size-14">{item.status}</div>,
                            deadline: deaddate,
                            updated_at: udate
                        }
                    )
                }))
            })
            .catch((err) => {
                console.log(err);
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }

    //getall tasks by employee
    const loadtaskbyemp = (params) => {
        let userida = jwt(userdatatk).user_id
        params.id = userida
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Task.getTaskByEmployee(params)
            .then((result) => {
                setMeta(result.meta);
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                setData(rdata.map((item) => {
                    const udate = moment(item.updated_at).format('MMM DD - HH:mm')
                    const deaddate = moment(item.deadline).format('MMM DD - HH:mm')
                    return (
                        {
                            id: item._id,
                            task_type: `${item.task_type.department} - ${item.task_type.main_product} - ${item.task_type.sub_product}`,
                            department: item.department,
                            assignee: item.assignee.member_id,
                            manager: item.manager.member_id,
                            target: item.target,
                            completed: item.completed,
                            status: item.status === "completed" ? <div className="badge badge-soft-success font-size-14">{item.status}</div> : <div className="badge badge-soft-warning font-size-14">{item.status}</div>,
                            deadline: deaddate,
                            updated_at: udate
                        }
                    )
                }))
            })
            .catch((err) => {
                console.log(err);
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <h4 className="mb-0">Tasks</h4>
                    </div>
                    <Row>
                        <Col xs={12}>
                            {role === "admin" || role === "manager" ? <Button
                                onClick={() => {
                                    setModal_addTask(true);
                                    setIsAlertOpen(false);
                                }}
                                // color="primary"
                                className="waves-effect waves-light mb-3 bg-table-blue" style={{ border: 'none' }}
                            >
                                <i className="ri-user-add-line align-middle"></i>
                                <span className="mx-2">Add Task</span>
                            </Button> : <></>}
                            {role === "admin" ? <Button
                                onClick={() => {
                                    setModal_addTaskType(true);
                                }}
                                // color="primary"
                                className="waves-effect waves-light mb-3 mx-3 bg-table-blue" style={{ border: 'none' }}
                            >
                                <i className="ri-user-add-line align-middle"></i>
                                <span className="mx-2">Add Task Type</span>
                            </Button> : <></>}
                            <Card>
                                <CardBody>
                                    <MainTable
                                        meta={meta}
                                        data={data}
                                        handlePageChange={role === "admin" || role === "manager" ? loadAllTasks : loadtaskbyemp}
                                        columns={[
                                            { label: "Task Name", field: "task_type" },
                                            { label: "Department", field: "department" },
                                            { label: "Assignee", field: "assignee" },
                                            { label: "Manager ID", field: "manager" },
                                            { label: "Target", field: "target" },
                                            { label: "Completed", field: "completed" },
                                            { label: "Status", field: "status" },
                                            { label: "Dead Line", field: "deadline" },
                                            { label: "Last Updated", field: "updated_at" },
                                        ]}
                                        actions={[
                                            { button: <VieweButton />, path: "/dashboard/task/view/" },
                                            { button: <DeleteButton />, path: "tasks/delete/" },
                                        ]}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Modal
                        title="Add Task"
                        centered
                        maskClosable={false}
                        visible={modal_addTask}
                        onOk={() => {
                            Task.createTasks({ ...taskState, updated_at: Date.now(), created_at: Date.now() }).then((result) => {
                                toggleTask()
                                setTaskState({
                                    status: "ongoing",
                                    completed: 0,
                                    updated_at: "",
                                    department: "",
                                    assignee: "",
                                    manager: "",
                                    target: 0,
                                    deadline: taskState.deadline
                                });
                                loadAllTasks(null);
                                loadAllTaskType()

                            }).catch(err => { console.log(err); })
                        }}
                        onCancel={toggleTask}
                        width={1000}
                    >
                        <Form>
                            <Row>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="managerid">Task Type</Label>
                                        <Select
                                            showSearch
                                            style={{ display: "block" }}
                                            placeholder="Select Task Type"
                                            optionFilterProp="children"
                                            value={taskState.task_type}
                                            onChange={handleTaskTypeChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {getDataT.map(({ name, value, typeid }) => (
                                                <Option key={value} value={typeid}>
                                                    {name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="department">Department</Label>
                                        <Dropdown
                                            isOpen={dropdownOpen}
                                            toggle={toggleDropdown}
                                        >
                                            <DropdownToggle className="full-dropdown" caret color="light">
                                                {taskState.department}
                                            </DropdownToggle>
                                            <DropdownMenu className="full-dropdown" >
                                                <DropdownItem name="department" value="Cutting" onClick={handleChange}>Cutting</DropdownItem>
                                                <DropdownItem name="department" value="Packing" onClick={handleChange}>Packing</DropdownItem>
                                                <DropdownItem name="department" value="Sewing" onClick={handleChange}>Sewing</DropdownItem>
                                                <DropdownItem name="department" value="Quality Checking" onClick={handleChange}>Quality Checking</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="username">Assignee</Label>
                                        <Select
                                            showSearch
                                            style={{ display: "block" }}
                                            placeholder="Select Task Type"
                                            optionFilterProp="children"
                                            value={taskState.assignee}
                                            onChange={handleEmployeeIDChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {getDataE.map(({ empIDs, empid }) => (
                                                <Option key={empIDs} value={empid}>
                                                    {empIDs}
                                                </Option>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="password">Manager</Label>
                                        <Select
                                            showSearch
                                            style={{ display: "block" }}
                                            placeholder="Select Task Type"
                                            optionFilterProp="children"
                                            value={taskState.manager}
                                            onChange={handleManagerIDChange}
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
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="target">Target</Label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            // defaultValue={`${userState.firstName} ${userState.lastName}`}
                                            value={taskState.target}
                                            onChange={handleChange}
                                            validate={{ required: { value: true, errorMessage: 'Please enter Target' } }}
                                            id="target"
                                            name="target"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="deadline">Deadline</Label>
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ display: "block" }} onChange={(value, dateString) => {
                                            setTaskState({ ...taskState, deadline: dateString })
                                        }} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                    <Modal
                        title="Add Task Type"
                        centered
                        visible={modal_addTaskType}
                        maskClosable={false}
                        onOk={() => {
                            Task.createTaskTypes(taskTypeState).then((result) => {
                                toggleTaskType()
                                loadAllTasks(null).then(() => {
                                    setTaskTypeState({
                                        department: "",
                                        main_product: "",
                                        sub_product: "",
                                        price: 0,
                                    })
                                })
                            }).catch(err => { console.log(err); })

                        }}
                        onCancel={toggleTaskType}
                        width={1000}
                    >
                        <Form>
                            <Row>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="department">Department</Label>
                                        <Dropdown
                                            isOpen={dropdownOpen}
                                            toggle={toggleDropdown}
                                        >
                                            <DropdownToggle className="full-dropdown" caret color="light">
                                                {taskTypeState.department}
                                            </DropdownToggle>
                                            <DropdownMenu className="full-dropdown" >
                                                <DropdownItem name="department" value="Cutting" onClick={handleChangeT}>Cutting</DropdownItem>
                                                <DropdownItem name="department" value="Packing" onClick={handleChangeT}>Packing</DropdownItem>
                                                <DropdownItem name="department" value="Sewing" onClick={handleChangeT}>Sewing</DropdownItem>
                                                <DropdownItem name="department" value="Quality Checking" onClick={handleChangeT}>Quality Checking</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="main_product">Main Product</Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            // defaultValue={`${userState.firstName} ${userState.lastName}`}
                                            value={taskTypeState.main_product}
                                            onChange={handleChangeT}
                                            validate={{ required: { value: true, errorMessage: 'Please enter Product' } }}
                                            id="main_product"
                                            name="main_product"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="sub_product">Sub Product</Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            defaultValue={taskTypeState.sub_product}
                                            onChange={handleChangeT}
                                            id="sub_product"
                                            name="sub_product"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col lg="6">
                                    <FormGroup>
                                        <Label for="price">Price Per Item</Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            defaultValue={taskTypeState.price}
                                            onChange={handleChangeT}
                                            id="price"
                                            name="price"
                                            validate={{
                                                required: {
                                                    value: true,
                                                    errorMessage: 'Enter a Price'
                                                }
                                            }}
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
