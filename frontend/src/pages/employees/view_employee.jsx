import React, { useEffect, useState } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useLocation } from "react-router-dom";
import "./users.scss";
import { Linechart } from "../../components/linechart";
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
} from "reactstrap";
import Admin from "../../controllers/admin";
import Task from "../../controllers/task";
import { message } from "antd";
import moment from "moment"
import { MainTable } from "../../components/MainTable";
import { DeleteButton, VieweButton } from "../../components/Buttons";
import useAuth from "../../useAuth";
import jwt from 'jwt-decode'

const Employee = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenGroup, setDropdownOpenGroup] = useState(false);
    const [dropdownOpenWallet, setDropdownOpenWallet] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const toggleDropdownGroup = () => setDropdownOpenGroup((prevState) => !prevState);
    const toggleDropdownWallet = () => setDropdownOpenWallet((prevState) => !prevState);
    const location = useLocation();
    const [datat, setDatat] = useState([]);
    const { user } = useAuth();
    const userdatatk = localStorage.getItem('usertoken');
    let role = user.role || jwt(userdatatk).role;
    const [meta, setMeta] = useState({});
    const [prevSalary, setPrevSalary] = useState(0);

    const [userdata, setuserData] = useState({
        username: "",
        pass: "",
        cpass: "",
        password: "",
        fname: "",
        lname: "",
        email: "",
        address: "",
        department: "",
        nic: "",
        contact_num: "",
        marital_status: "",
        gender: "",
        fingerprint: "",
        nominee: "",
        member_id: "",
        role: ""

    });
    const [enableEdit, setEnableEdit] = useState(false);
    const [tasksData, setTasksData] = useState([]);
    const [salaryData, setSalaryData] = useState({
        employee_id: "",
        salary: 0,
        epf: 0,
        etf: 0,
        month: "",
        bonus: 0
    });

    //handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
        setuserData({
            ...userdata,
            [e.target.name]: value,
        });
    };

    //handle input changes salary bonus
    const handleChangeB = (e) => {
        const value = e.target.value;
        setSalaryData({
            ...salaryData,
            [e.target.name]: value,
        });

    };

    useEffect(() => {
        // Get employee id from url
        let urldata = window.location.pathname.split("/");
        let userid = (urldata[urldata.length - 1])
        // load data of employee
        loadEmployee(userid)
        // Enable edit mode if edit button clicked
        if (urldata[urldata.length - 2] === "edit") {
            setEnableEdit(true);
        }
    }, [location]);


    // loading message key
    const key = 'loading';

    // Load employee details function
    const loadEmployee = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Admin.getEmployeeByID(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const data = result.data;
                setuserData(
                    {
                        id: data._id,
                        username: data.username,
                        password: data.password,
                        fname: data.fname,
                        lname: data.lname,
                        email: data.email,
                        address: data.address,
                        department: data.department,
                        nic: data.nic,
                        contact_num: data.contact_num,
                        marital_status: data.marital_status,
                        gender: data.gender,
                        fingerprint: data.fingerprint,
                        nominee: data.nominee,
                        member_id: data.member_id,
                        role: data.role
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            })
    };

    // Function to update employee details
    const updateEmployee = async () => {
        message.loading({ content: 'Updating User...', key, duration: 0 })
        // trim white spaces
        if (
            userdata.address.trim().length > 0 &&
            userdata.contact_num.trim().length > 0 &&
            userdata.department.trim().length > 0 &&
            userdata.fname.trim().length > 0 &&
            userdata.gender.trim().length > 0 &&
            userdata.lname.trim().length > 0 &&
            userdata.marital_status.trim().length > 0 &&
            userdata.member_id.trim().length > 0 &&
            userdata.nic.trim().length > 0 &&
            userdata.password.trim().length > 0 &&
            userdata.username.trim().length > 0 &&
            userdata.email.trim().length > 0
        ) {
            // check password and conform password same
            if (userdata.pass === userdata.cpass) {
                Admin.updateEmployees(userdata).then((response) => {
                    message.success({ content: 'Data Updated Successfully', key, duration: 2 }).then(() => {
                        props.history.push('/dashboard/employees/')
                    })
                }).catch(err => {
                    console.log(err);
                })
            } else {
                message.error({ content: "Passwords needs to be same", key, duration: 2 });
                console.log("Error");
            }
        } else {
            message.error({ content: "Please fill all fields", key, duration: 2 });
            console.log("Error");
        }
    };

    //get tasks by employee
    const loadAllTasksByEmp = (params) => {
        let urldata = window.location.pathname.split("/");
        let userida = urldata[urldata.length - 1];
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        params.id = userida
        console.log("dhjfjfj", params);
        Task.getTaskByEmployee(params)
            .then((result) => {

                setMeta(result.meta);
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                setTasksData(rdata);
                setDatat(rdata.map((item) => {
                    const udate = moment(item.updated_at).format('YY MMM DD - HH:mm')
                    const deaddate = moment(item.deadline).format('YY MMM DD - HH:mm')
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
                message.warning({ content: 'No Data!', key, duration: 1 })
                console.log(err);
            })
    }

    // Calculate salary function on load data button click
    const claculateSalary = async () => {
        message.loading({ content: 'Calculating', key, duration: 0 })
        // get current user data
        let urldata = window.location.pathname.split("/");
        let userids = urldata[urldata.length - 1];
        // define start and end date of saraly cycle
        const startOfMonth = moment().subtract(1, 'months').startOf('month').date(28).format('YYYY-MM-DD hh:mm')
        const endOfMonth = moment().date(27).format('YYYY-MM-DD hh:mm')

        // current salary
        let cs = 0
        // bonus
        let b = 0
        // user id
        let id = ""

        // Function to get salary bonus details form DB
        Admin.getEmpSalaryByEmployee({ id: userids }).then((result) => {
            message.success({ content: 'Done!', key, duration: 2 });
            const rdata = result.data;
            rdata.map((item) => {
                //find current month salary details
                if (item.month == moment().format('MMM YY')) {
                    b = item.bonus
                    id = item._id
                }
                //get previous month salary
                console.log(item);
                if (item.month == moment().subtract(1, 'months').format('MMM YY')) {
                    setPrevSalary(item.salary)
                }
            })
        }).catch((err) => {
            console.log(err);
            message.error({ content: 'Something Went Wrong!', key, duration: 2 })
        }).finally(() => {
            // Finaly calculating salary using task data
            console.log(startOfMonth);
            console.log(endOfMonth);

            tasksData.map((item) => {

                //get salary for completed tasks in current month
                if (moment(item.deadline).isBetween(startOfMonth, endOfMonth)) {
                    console.log("tsk data", item);

                    cs += item.task_type.price * item.completed;
                } else {
                    console.log(0);
                }
            });
            //add bonus to the current salary
            cs += b;
            setSalaryData({ bonus: b, id: id, salary: (cs) - (cs / 100 * 8), epf: cs / 100 * 20, etf: cs / 100 * 3 })
            message.success({ content: 'Done!', key, duration: 2 })
        })
    }

    // Render employee chart with marks
    const showchart = () => {
        let urldata = window.location.pathname.split("/");
        let userid = urldata[urldata.length - 1];
        return (<Row>
            <Col lg={10}>
                <Linechart empid={userid} />
            </Col>
        </Row>)
    }

    // Function to update bonus of employee
    const updateBonus = async () => {
        message.loading({ content: 'Updating Bonus...', key, duration: 0 })
        let urldata = window.location.pathname.split("/");
        let userids = urldata[urldata.length - 1];

        setSalaryData({
            ...salaryData,
            month: moment().format('MMM YY'),
            employee_id: userids
        })

        await Admin.updateEmpSalary(salaryData).then(() => {
            // Calculate salary again after updating bonus value
            claculateSalary()
            message.success({ content: 'Updated!', key, duration: 0 })

        }).catch((err) => {
            message.error({ content: 'Something Went Wrong!', key, duration: 2 })
        })
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Row>
                        <Row>
                            <div className="page-title-box">
                                <h4 className="mb-0">
                                    {enableEdit ? "Edit User Details" : "User Details"}
                                </h4>
                            </div>
                            <div className="d-inline-flex">
                                <Col lg="3">
                                    <Button
                                        onClick={() => {
                                            enableEdit ? updateEmployee() : setEnableEdit(true);
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
                                                : props.history.push("/dashboard/employees");
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
                        </Row>
                        {/* Render marks chart */}
                        {showchart()}
                        <Col lg="6">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <Row>
                                            <Col lg="12">
                                                <div className="page-title-box">
                                                    <h4 className="mb-0">Conatct Details</h4>
                                                </div>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="employee-firstname">First name</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    type="text"
                                                                    name="fname"
                                                                    className="form-control"
                                                                    defaultValue={userdata.fname}
                                                                    id="employee-firstname"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.fname}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="employee-lastname">Last name</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="lname"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.lname}
                                                                    id="employee-lastname"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.lname}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="employee-email">Email</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    type="email"
                                                                    name="email"
                                                                    className="form-control"
                                                                    defaultValue={userdata.email}
                                                                    id="employee-email"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.email}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="employee-phone">Phone</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="contact_num"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.contact_num}
                                                                    id="employee-contact_num"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.contact_num}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <Label for="employee-address">Address</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="address"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.address}
                                                                    id="employee-address"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.address}</p>
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
                        <Col lg="6">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <AvForm>

                                            <Row>
                                                <Col lg="12">
                                                    <div className="page-title-box">
                                                        <h4 className="mb-0">Work Details</h4>
                                                    </div>
                                                    <Row>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for="employeeid">Employee ID</Label>
                                                                {enableEdit ? (
                                                                    <Input
                                                                        onChange={handleChange}
                                                                        type="text"
                                                                        name="member_id"
                                                                        className="form-control"
                                                                        // defaultValue={`${userdata.first_name} ${userdata.last_name}`}
                                                                        defaultValue={userdata.member_id}
                                                                        id="employeeid"
                                                                    />
                                                                ) : (
                                                                        <p>{userdata.member_id}</p>
                                                                    )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for="invoice-rate">Department</Label>
                                                                {enableEdit ? (
                                                                    <FormGroup className="mt-0">
                                                                        <Dropdown
                                                                            isOpen={dropdownOpen}
                                                                            toggle={toggleDropdown}
                                                                        >
                                                                            <DropdownToggle className="full-dropdown" caret color="light">
                                                                                {userdata.department}
                                                                            </DropdownToggle>
                                                                            <DropdownMenu className="full-dropdown" >
                                                                                <DropdownItem name="department" value="Cutting" onClick={handleChange}>Cutting</DropdownItem>
                                                                                <DropdownItem name="department" value="Packing" onClick={handleChange}>Packing</DropdownItem>
                                                                                <DropdownItem name="department" value="Sewing" onClick={handleChange}>Sewing</DropdownItem>
                                                                                <DropdownItem name="department" value="Quality Checking" onClick={handleChange}>Quality Checking</DropdownItem>
                                                                            </DropdownMenu>
                                                                        </Dropdown>
                                                                    </FormGroup>
                                                                ) : (
                                                                        <p> {userdata.department}</p>
                                                                    )}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label for="username">Username</Label>
                                                                {enableEdit ? (
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        defaultValue={userdata.username}
                                                                        onChange={handleChange}
                                                                        id="username"
                                                                        name="username"
                                                                    />
                                                                ) : (
                                                                        <p>{userdata.username}</p>
                                                                    )}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Label for="password">Password</Label>
                                                            {enableEdit ? (
                                                                <AvField
                                                                    type="password"
                                                                    className="form-control"
                                                                    // defaultValue={userdata.pass}
                                                                    onChange={handleChange}
                                                                    autocomplete="new-password"
                                                                    id="password"
                                                                    name="pass"
                                                                    validate={{
                                                                        required: {
                                                                            value: true,
                                                                            errorMessage: 'Enter a new password'
                                                                        },
                                                                        minLength: {
                                                                            value: 6,
                                                                            errorMessage: '6 characters minimum'
                                                                        }
                                                                    }}
                                                                />
                                                            ) : (
                                                                    <p>**********</p>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg="6">

                                                        </Col>
                                                        <Col lg="6">
                                                            <Label>???</Label>
                                                            {enableEdit ? (
                                                                <>
                                                                    <Label for="confirm-password">Confirm Password</Label>
                                                                    <AvField
                                                                        type="password"
                                                                        name="cpass"
                                                                        className="form-control"
                                                                        defaultValue={userdata.cpass}
                                                                        onChange={handleChange}
                                                                        id="confirm-password"
                                                                        validate={{
                                                                            match: {
                                                                                value: 'pass',
                                                                                errorMessage: "Password doesn't match"
                                                                            },
                                                                            required: {
                                                                                value: true,
                                                                                errorMessage: 'Enter your new password'
                                                                            }
                                                                        }}
                                                                    /></>
                                                            ) : (
                                                                    <p>???</p>
                                                                )}

                                                        </Col>

                                                    </Row>

                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <Row>
                                            <div className="page-title-box">
                                                <h4 className="mb-0">Personal Details</h4>
                                            </div>
                                            <Col lg="12">
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="nic">NIC</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="nic"
                                                                    defaultValue={userdata.nic}
                                                                    onChange={handleChange}
                                                                    name="nic"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.nic}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="nominee">Nominee</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="nominee"
                                                                    defaultValue={userdata.nominee}
                                                                    onChange={handleChange}
                                                                    name="nominee"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.nominee}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="marital_status">Marital Status</Label>
                                                            {enableEdit ? (
                                                                <FormGroup className="mt-0">
                                                                    <Dropdown
                                                                        isOpen={dropdownOpenWallet}
                                                                        toggle={toggleDropdownWallet}
                                                                        id="marital_status"
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            {userdata.marital_status}
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem name="marital_status" value="Married" onClick={handleChange}>Married</DropdownItem>
                                                                            <DropdownItem name="marital_status" value="Single" onClick={handleChange}>Single</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            ) : (
                                                                    <p> {userdata.marital_status}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="gender"> Gender</Label>
                                                            {enableEdit ? (
                                                                <FormGroup className="mt-0">
                                                                    <Dropdown
                                                                        isOpen={dropdownOpenGroup}
                                                                        id="gender"
                                                                        toggle={toggleDropdownGroup}
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            {userdata.gender}
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem name="gender" value="Male" onClick={handleChange}>Male</DropdownItem>
                                                                            <DropdownItem name="gender" value="Female" onClick={handleChange}>Female</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            ) : (
                                                                    <p> {userdata.gender}</p>
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
                        <Col lg="6">
                            <Card>
                                <CardBody>
                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <Row>
                                            <div className="page-title-box d-inline-flex">
                                                <h4 className="my-auto">Salary Details</h4>
                                                <Button
                                                    onClick={() => {
                                                        claculateSalary();
                                                    }}
                                                    color="primary"
                                                    className="waves-effect waves-light mx-3"
                                                >
                                                    <span className="mx-2">Load Data</span>
                                                </Button>
                                            </div>

                                            <Col lg="12">
                                                <Row>

                                                    <Col lg="4">
                                                        <FormGroup>
                                                            <Label for="nic">Previous Month Salary Gained</Label>
                                                            <p>{prevSalary.toFixed(2)} LKR</p>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col lg="4">
                                                        <FormGroup>
                                                            <Label for="nominee">Salary Calculated for Today</Label>
                                                            <p>{salaryData.salary.toFixed(2)} LKR</p>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={role === "admin" ? "6" : "3"} >
                                                        <FormGroup>
                                                            <Label for="bonus">Bonus</Label>
                                                            {role === "admin" ? <div className="d-inline-flex" style={{ height: "40px" }}>
                                                                <Input
                                                                    type="number"
                                                                    className="form-control w-50"
                                                                    id="bonus"
                                                                    value={salaryData.bonus}
                                                                    onChange={handleChangeB}
                                                                    name="bonus"
                                                                />
                                                                <Button
                                                                    onClick={() => {
                                                                        updateBonus();
                                                                    }}
                                                                    color="primary"
                                                                    className="waves-effect waves-light mx-3"
                                                                >
                                                                    <span className="mx-2">Update Bonus</span>
                                                                </Button>
                                                            </div> : <p>{salaryData.bonus}</p>}
                                                        </FormGroup>

                                                    </Col>
                                                    <Col lg="3">
                                                        <FormGroup>
                                                            <Label for="epf"> EPF</Label>
                                                            <p>{salaryData.epf.toFixed(2)} LKR</p>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="3">
                                                        <FormGroup>
                                                            <Label for="epf"> ETF</Label>
                                                            <p>{salaryData.etf.toFixed(2)} LKR</p>
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
                    <Row>


                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
                                        <div className="page-title-box mt-3">
                                            <h4 className="mb-0">Recent Tasks</h4>
                                        </div>
                                        <MainTable
                                            data={datat}
                                            meta={meta}
                                            handlePageChange={loadAllTasksByEmp}
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
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Employee;
