import React, { useEffect, useState } from "react";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
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
import Admin from "../../controllers/admin";
import { message } from "antd";

const Manager = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenGroup, setDropdownOpenGroup] = useState(false);
    const [dropdownOpenWallet, setDropdownOpenWallet] = useState(false);
    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
    const toggleDropdownGroup = () => setDropdownOpenGroup((prevState) => !prevState);
    const toggleDropdownWallet = () => setDropdownOpenWallet((prevState) => !prevState);
    const location = useLocation();
    let data = [];

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
    // const [isAlertOpen, setIsAlertOpen] = useState(false);



    //handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
        setuserData({
            ...userdata,
            [e.target.name]: value,
        });
        console.log(userdata);

    };

    useEffect(() => {
        // const userid = location.state.id;
        // const isEdit = location.state.edit;
        let urldata = window.location.pathname.split("/");
        let userid = urldata[urldata.length - 1];
        console.log(urldata[urldata.length - 2]);

        loadManager(userid)

        if (urldata[urldata.length - 2] === "edit") {
            setEnableEdit(true);
        }

    }, [location]);


    // loading message key
    const key = 'loading';

    const loadManager = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })

        Admin.getManagerByID(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const data = result.data;
                console.log(data);
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


    const updateManager = async () => {
        message.loading({ content: 'Updating User...', key, duration: 0 })
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
            if (userdata.pass === userdata.cpass) {
                console.log(userdata);
                Admin.updateManagers(userdata).then((response) => {
                    console.log(response);
                    message.success({ content: 'Data Updated Successfully', key, duration: 2 }).then(() => {
                        props.history.push('/dashboard/managers/')
                    })

                }).catch(err => {
                    console.log(err);

                })
            } else {
                console.log(userdata);

                message.error({ content: "Passwords needs to be same", key, duration: 2 });
                console.log("Error");
            }
        } else {
            console.log(userdata);

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
                                    {enableEdit ? "Edit User Details" : "User Details"}
                                </h4>
                            </div>
                            <div className="d-inline-flex">
                                <Col lg="3">
                                    <Button
                                        onClick={() => {
                                            enableEdit ? updateManager() : setEnableEdit(true);
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
                                                : props.history.push("/dashboard/managers");
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
                                                            <Label for="manager-firstname">First name</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    type="text"
                                                                    name="fname"
                                                                    className="form-control"
                                                                    defaultValue={userdata.fname}
                                                                    id="manager-firstname"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.fname}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="manager-lastname">Last name</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="lname"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.lname}
                                                                    id="manager-lastname"
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
                                                            <Label for="manager-email">Email</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    type="email"
                                                                    name="email"
                                                                    className="form-control"
                                                                    defaultValue={userdata.email}
                                                                    id="manager-email"
                                                                />
                                                            ) : (
                                                                    <p>{userdata.email}</p>
                                                                )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="manager-phone">Phone</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="contact_num"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.contact_num}
                                                                    id="manager-contact_num"
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
                                                            <Label for="manager-address">Address</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="address"
                                                                    type="text"
                                                                    className="form-control"
                                                                    defaultValue={userdata.address}
                                                                    id="manager-address"
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
                                        <Row>
                                            <Col lg="12">
                                                <div className="page-title-box">
                                                    <h4 className="mb-0">Work Details</h4>
                                                </div>
                                                <Row>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="managerid">Manager ID</Label>
                                                            {enableEdit ? (
                                                                <Input
                                                                    onChange={handleChange}
                                                                    type="text"
                                                                    name="member_id"
                                                                    className="form-control"
                                                                    // defaultValue={`${userdata.first_name} ${userdata.last_name}`}
                                                                    defaultValue={userdata.member_id}
                                                                    id="managerid"
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
                                                        <AvForm>
                                                            <Label for="password">Password</Label>
                                                            {enableEdit ? (
                                                                <AvField
                                                                    type="password"
                                                                    className="form-control"
                                                                    defaultValue={userdata.pass}
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
                                                            ) : (
                                                                    <p>**********</p>
                                                                )}
                                                        </AvForm>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="6">

                                                    </Col>
                                                    <Col lg="6">
                                                        <AvForm>
                                                            <Label>⠀</Label>
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
                                                                    <p>⠀</p>
                                                                )}
                                                        </AvForm>
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
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default Manager;
