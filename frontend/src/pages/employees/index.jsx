import React, { useState, useEffect } from "react";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import {
    Row,
    Col,
    Card,
    NavLink,
    CardBody,
    Container,
    Button,
    UncontrolledTooltip,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    NavItem,
    Progress,
    TabContent,
    TabPane,
    Alert,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import "./users.scss";
import moment from "moment"
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import classnames from "classnames";
import Admin from "../../controllers/admin";
import { MainTable } from "../../components/MainTable";
import { DeleteButton, EditButton, VieweButton } from "../../components/Buttons";
import { message, Modal as DelModal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';


export const Employees = (props) => {
    const [activeTabProgress, setActiveTabProgress] = useState(1);
    const [progressValue, setProgressValue] = useState(25);
    const [modal_static, setModal_static] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenGroup, setDropdownOpenGroup] = useState(false);
    const [dropdownOpenWallet, setDropdownOpenWallet] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const toggleDropdownGroup = () => setDropdownOpenGroup((prevState) => !prevState);
    const toggleDropdownWallet = () => setDropdownOpenWallet((prevState) => !prevState);
    const [isvalid, setisvalid] = useState(false);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});



    //increment wizard page
    const toggleTabProgress = (tab) => {
        if (activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 4) {
                setActiveTabProgress(tab);

                if (tab === 1) {
                    setProgressValue(25);
                }
                if (tab === 2) {
                    setProgressValue(50);
                }
                if (tab === 3) {
                    setProgressValue(75);
                }
                if (tab === 4) {
                    setProgressValue(100);
                }
            }
        }
    };
    const toggle = () => setModal_static(!modal_static);


    //get user input data
    const [userState, setUserState] = useState({
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
        role: "employee"

    })

    //handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
        console.log(value);

        setUserState({
            ...userState,
            [e.target.name]: value
        });

    }

    //validate form wizard data
    const validateformval = (tabval) => {
        switch (tabval) {
            // user not found
            case 1:
                if (userState.email && userState.fname && userState.lname && userState.contact_num) {
                    const patternEmail = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
                    const patternPhone = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
                    const resultEmail = patternEmail.test(userState.email);
                    const resultPhone = patternPhone.test(userState.contact_num);
                    if (resultPhone && resultEmail) {
                        setisvalid(true)
                        toggleTabProgress(activeTabProgress + 1);
                    }

                }
                else { setisvalid(false) }
                break;
            default:
                toggleTabProgress(activeTabProgress + 1);
                break;

        }
    }

    const location = useLocation();

    useEffect(() => {
        console.log("hi");

        let urldata = window.location.pathname.split("/");
        let userid = urldata[urldata.length - 1];
        console.log(urldata[urldata.length - 2]);

        if (urldata[urldata.length - 2] === "delete") {
            showDeleteConfirm(userid);
        } else {
            loadAllEmployees(null)
        }

    }, [location]);

    //delete confirmation

    const { confirm } = DelModal;
    function showDeleteConfirm(data) {

        confirm({
            title: 'Are you sure delete this?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteEmployees(data)
            },
            onCancel() {
                props.history.push('/dashboard/employees')
            },
        });
    }
    // loading message key
    const key = 'loading';

    const deleteEmployees = (params) => {
        message.loading({ content: 'Deleting...', key, duration: 0 })
        Admin.deleteEmployee(params)
            .then((result) => {
                message.success({ content: 'Deleted!', key, duration: 1 }).then(() => {
                    props.history.push('/dashboard/employees')
                })

            })
            .catch((err) => {
                message.error({ content: 'Error Occured!', key, duration: 2 });
            })
    };


    //getall employees
    const loadAllEmployees = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        Admin.getAllEmployees(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const rdata = result.data;
                setMeta(result.meta)
                setData(rdata.map((item) => {
                    const date = moment(item.created_at).format('YYYY MMMM DD')
                    console.log(date);

                    return (
                        {
                            id: item._id,
                            name: `${item.fname} ${item.lname}`,
                            member_id: item.member_id,
                            contact_num: item.contact_num,
                            joindate: date,
                            department: item.department
                        }
                    )
                }))


            })
            .catch((err) => {
                message.warning({ content: 'No Data Found!', key, duration: 2 });
            })
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <h4 className="mb-0">Employees</h4>
                    </div>

                    <Row>
                        <Col xs={12}>
                            <Button
                                onClick={() => {
                                    setModal_static(true);
                                    setIsAlertOpen(false);
                                }}
                                // color="primary"
                                className="waves-effect waves-light mb-3 bg-table-blue" style={{ border: 'none' }}
                            >
                                <i className="ri-user-add-line align-middle"></i>
                                <span className="mx-2">Add Employee</span>
                            </Button>
                            <Card>
                                <CardBody>
                                    <MainTable
                                        meta={meta}
                                        data={data}
                                        handlePageChange={loadAllEmployees}
                                        columns={[
                                            { label: "Name", field: "name" },
                                            { label: "Employee ID", field: "member_id" },
                                            { label: "Phone", field: "contact_num" },
                                            { label: "Joined Date", field: "joindate" },
                                            { label: "Department", field: "department" },
                                        ]}
                                        actions={[
                                            { button: <VieweButton />, path: "/dashboard/employee/view/" },
                                            { button: <EditButton />, path: "/dashboard/employee/edit/" },
                                            { button: <DeleteButton />, path: "employees/delete/" },
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
                            Add Employee Details
                        </ModalHeader>
                        <ModalBody>
                            <Alert
                                color="success"
                                isOpen={isAlertOpen}
                                toggle={() => {
                                    setIsAlertOpen(false);
                                }}
                            >
                                Data Added Successfully...!
                            </Alert>
                            <div id="progrss-wizard" className="twitter-bs-wizard">
                                <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTabProgress === 1,
                                            })}
                                            onClick={() => {
                                                // toggleTabProgress(1);
                                            }}
                                        >
                                            <span className="step-number">01</span>
                                            <span className="step-title">Contact Details</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTabProgress === 2,
                                            })}
                                            onClick={() => {
                                                // toggleTabProgress(2);
                                            }}
                                        >
                                            <span className="step-number">02</span>
                                            <span className="step-title">Work Details</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTabProgress === 3,
                                            })}
                                            onClick={() => {
                                                // toggleTabProgress(3);
                                            }}
                                        >
                                            <span className="step-number">03</span>
                                            <span className="step-title">Personal Details</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTabProgress === 4,
                                            })}
                                            onClick={() => {
                                                // toggleTabProgress(4);
                                            }}
                                        >
                                            <span className="step-number">04</span>
                                            <span className="step-title">Confirm Detail</span>
                                        </NavLink>
                                    </NavItem>
                                </ul>

                                <div id="bar" className="mt-4">
                                    <Progress
                                        color="success"
                                        striped
                                        animated
                                        value={progressValue}
                                    />
                                </div>
                                <TabContent
                                    activeTab={activeTabProgress}
                                    className="twitter-bs-wizard-tab-content"
                                >
                                    <TabPane tabId={1}>
                                        <AvForm className="form-horizontal" >
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="employee-firstname">First name</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="employee-firstname"
                                                            name="fname"
                                                            value={userState.fname}
                                                            validate={{ required: { value: true, errorMessage: 'Please enter a first name' } }}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="employee-lastname">Last name</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="employee-lastname"
                                                            name="lname"
                                                            value={userState.lname}
                                                            onChange={handleChange}
                                                            validate={{ required: { value: true, errorMessage: 'Please enter a last name' } }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="employee-phoneno">Phone</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="employee-phoneno"
                                                            name="contact_num"
                                                            value={userState.contact_num}
                                                            onChange={handleChange}
                                                            validate={{ pattern: { value: /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/ }, required: { value: true, errorMessage: 'Please enter a phone number' } }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="employee-email">Email</Label>
                                                        <AvField
                                                            type="email"
                                                            className="form-control"
                                                            id="employee-email"
                                                            name="email"
                                                            validate={{ email: true, required: { value: true, errorMessage: 'Please enter a email address' } }}
                                                            value={userState.email}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <Label for="employee-address">Address</Label>
                                                        <AvInput
                                                            type="textarea"
                                                            name="address"
                                                            id="employee-address"
                                                            className="form-control"
                                                            rows={2}
                                                            validate={{ required: { value: true, errorMessage: 'Please enter an address' } }}
                                                            value={userState.address}
                                                            onChange={handleChange}
                                                        ></AvInput>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </TabPane>
                                    <TabPane tabId={2}>
                                        <div>
                                            <Form>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="employeeid">Employee ID</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                // defaultValue={`${userState.firstName} ${userState.lastName}`}
                                                                value={userState.member_id}
                                                                onChange={handleChange}
                                                                validate={{ required: { value: true, errorMessage: 'Please enter an ID' } }}
                                                                id="employeeid"
                                                                name="member_id"
                                                            />
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
                                                                    {userState.department}
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
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <Label for="username">Username</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue={userState.username}
                                                                // defaultValue={`${userState.fname}${userState.member_id}`}
                                                                onChange={handleChange}
                                                                id="username"
                                                                name="username"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <AvForm>
                                                    <Row>
                                                        <Col lg="6">
                                                            <Label for="password">Password</Label>
                                                            <AvField
                                                                type="password"
                                                                className="form-control"
                                                                defaultValue={userState.pass}
                                                                onChange={handleChange}
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
                                                        </Col>
                                                        <Col lg="6">
                                                            <Label for="confirm-password">Confirm Password</Label>
                                                            <AvField
                                                                type="password"
                                                                className="form-control"
                                                                defaultValue={userState.cpass}
                                                                onChange={handleChange}
                                                                name="cpass"
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
                                                            />

                                                        </Col>

                                                    </Row>
                                                </AvForm>
                                            </Form>
                                        </div>
                                    </TabPane>
                                    <TabPane tabId={3}>
                                        <div>
                                            <Form>
                                                <Row>
                                                    <Col lg="12">
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="nic">NIC</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="nic"
                                                                        defaultValue={userState.nic}
                                                                        onChange={handleChange}
                                                                        name="nic"
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="nominee">Nominee</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="nominee"
                                                                        defaultValue={userState.nominee}
                                                                        onChange={handleChange}
                                                                        name="nominee"
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>

                                                                    <Label for="marital_status">Marital Status</Label>
                                                                    <Dropdown
                                                                        isOpen={dropdownOpenWallet}
                                                                        id="marital_status"
                                                                        toggle={toggleDropdownWallet}
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            {userState.marital_status}
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem name="marital_status" value="Married" onClick={handleChange}>Married</DropdownItem>
                                                                            <DropdownItem name="marital_status" value="Single" onClick={handleChange}>Single</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>

                                                                    <Label for="gender"> Gender</Label>

                                                                    <Dropdown
                                                                        isOpen={dropdownOpenGroup}
                                                                        id="gender"
                                                                        toggle={toggleDropdownGroup}
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            {userState.gender}
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem name="gender" value="Male" onClick={handleChange}>Male</DropdownItem>
                                                                            <DropdownItem name="gender" value="Female" onClick={handleChange}>Female</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                    </TabPane>
                                    <TabPane tabId={4}>
                                        <div className="row justify-content-center">
                                            <Row className="px-5 py-3">
                                                <Col lg="6">
                                                    <Row><Label className="d-inline-flex mb-2 "> First Name : <p className="mx-2 mb-0 fw-light">{userState.fname}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Last Name : <p className="mx-2 mb-0 fw-light">{userState.lname}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Email : <p className="mx-2 mb-0 fw-light">{userState.email}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Phone : <p className="mx-2 mb-0 fw-light">{userState.contact_num}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Address : <p className="mx-2 mb-0 fw-light">{userState.address}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Gender : <p className="mx-2 mb-0 fw-light">{userState.gender}</p></Label></Row>
                                                </Col>
                                                <Col lg="6">
                                                    <Row><Label className="d-inline-flex mb-2 "> Employee ID : <p className="mx-2 mb-0 fw-light">{userState.member_id}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Department: <p className="mx-2 mb-0 fw-light">{userState.department}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Username : <p className="mx-2 mb-0 fw-light">{userState.username}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> NIC : <p className="mx-2 mb-0 fw-light">{userState.nic}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Nominee : <p className="mx-2 mb-0 fw-light">{userState.nominee}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Marital Status : <p className="mx-2 mb-0 fw-light">{userState.marital_status}</p></Label></Row>
                                                </Col>
                                                {/* <Col lg="4">
                                                   
                                                </Col> */}
                                            </Row>
                                            {/* <Row className="mt-4">
                                                <Col lg="12">
                                                    <div className="text-center mx-auto" style={{ alignItems: "center", justifyContent: "center" }}>
                                                        <div className="mb-4" >

                                                            <div >

                                                                <h5 ><i className="mdi mdi-check-circle-outline text-success display-6 px-2"></i> Confirm Detail</h5>
                                                                 <p className="text-muted">If several languages coalesce, the grammar of the resulting</p> 
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Col>
                                            </Row> */}
                                        </div>
                                    </TabPane>
                                </TabContent>
                                <ul className="pager wizard twitter-bs-wizard-pager-link">
                                    <li
                                        className={
                                            activeTabProgress === 1 ? "previous disabled" : "previous"
                                        }
                                    >
                                        <Link
                                            to="#"
                                            onClick={() => {
                                                toggleTabProgress(activeTabProgress - 1);
                                            }}
                                        >
                                            Previous
                                        </Link>
                                    </li>
                                    <li
                                        className={activeTabProgress === 4 ? "next d-none" : "next"}
                                    >
                                        <Link
                                            to="#"
                                            onClick={() => {
                                                validateformval(activeTabProgress);
                                            }}
                                        >
                                            Next
                                        </Link>
                                    </li>
                                    <li
                                        className={activeTabProgress !== 4 ? "next d-none" : "next"}
                                    >
                                        <Button
                                            onClick={() => {
                                                Admin.createEmployees(userState)
                                                    .then((result) => {
                                                        console.log(result);
                                                        Admin.createEmpSalary({ employee_id: result.data, month: moment().format('MMM YY') })
                                                        setIsAlertOpen(true);
                                                        loadAllEmployees(null);
                                                        setTimeout(() => {
                                                            setActiveTabProgress(1);
                                                            setProgressValue(25);
                                                            setModal_static(false);
                                                            setUserState({
                                                                username: "",
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
                                                                role: "employee"
                                                            })
                                                        }, 2000);
                                                    })
                                                    .catch(err => {

                                                    })


                                            }}
                                            color="success"
                                        >
                                            Confirm Account
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </ModalBody>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};
