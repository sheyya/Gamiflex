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
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import classnames from "classnames";
import { deleteCustomer, getAllCustomers } from "../../controllers/customers";
import { createCustomers } from "../../controllers/customers";
import { MainTable } from "../../components/MainTable";
import { DeleteButton, EditButton } from "../../components/Buttons";
import { message, Modal as DelModal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';


export const Customers = (props) => {
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

    })

    //handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
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
                if (userState.email && userState.firstName && userState.lastName && userState.phone) {
                    const patternEmail = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
                    const patternPhone = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
                    const resultEmail = patternEmail.test(userState.email);
                    const resultPhone = patternPhone.test(userState.phone);
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

        let urldata = window.location.pathname.split("/");
        let userid = urldata[urldata.length - 1];
        console.log(urldata[urldata.length - 2]);

        if (urldata[urldata.length - 2] === "delete") {
            showDeleteConfirm(userid);
        } else {
            loadAllCustomers(null)
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
                deleteCustomers(data)
            },
            onCancel() {
                props.history.push('/dashboard/customers')
            },
        });
    }
    // loading message key
    const key = 'loading';

    const deleteCustomers = (params) => {
        message.loading({ content: 'Deleting...', key, duration: 0 })
        deleteCustomer(params)
            .then((result) => {
                message.success({ content: 'Deleted!', key, duration: 1 }).then(() => {
                    props.history.push('/dashboard/customers')
                })

            })
            .catch((err) => {
                message.error({ content: 'Error Occured!', key, duration: 2 });
            })
    };


    //getall customers
    const loadAllCustomers = (params) => {
        message.loading({ content: 'Data Loading...', key, duration: 0 })
        getAllCustomers(params)
            .then((result) => {
                message.success({ content: 'Loaded!', key, duration: 2 });
                const data = result.data;
                setMeta(result.meta)
                setData(data.map((item) => {
                    return (
                        {
                            id: item.id,
                            name: `${item.first_name} ${item.last_name}`,
                            email: item.email,
                            contactno: item.phone,
                            invoiceRate: item.invoice_group_id
                        }
                    )
                }))


            })
            .catch((err) => {
            })
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="page-title-box">
                        <h4 className="mb-0">Users</h4>
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
                                <span className="mx-2">Add Customer</span>
                            </Button>
                            <Card>
                                <CardBody>
                                    <MainTable
                                        meta={meta}
                                        data={data}
                                        handlePageChange={loadAllCustomers}
                                        columns={[
                                            { label: "Name", field: "name" },
                                            { label: "Email", field: "email" },
                                            {
                                                label: "Contact Number",
                                                field: "contactno",
                                            }, {
                                                label: "Invoice Group",
                                                field: "invoiceRate",
                                            },
                                        ]}
                                        actions={[
                                            { button: <EditButton />, path: "/dashboard/customer/edit/" },
                                            { button: <DeleteButton />, path: "customers/delete/" },
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
                            Add Customer Details
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
                                            <span className="step-title">Billing Details</span>
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
                                            <span className="step-title">Wallet Details</span>
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
                                                        <Label for="customer-firstname">First name</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="customer-firstname"
                                                            name="firstName"
                                                            value={userState.firstName}
                                                            validate={{ required: { value: true, errorMessage: 'Please enter a first name' } }}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="customer-lastname">Last name</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="customer-lastname"
                                                            name="lastName"
                                                            value={userState.lastName}
                                                            onChange={handleChange}
                                                            validate={{ required: { value: true, errorMessage: 'Please enter a last name' } }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="customer-phoneno">Phone</Label>
                                                        <AvField
                                                            type="text"
                                                            className="form-control"
                                                            id="customer-phoneno"
                                                            name="phone"
                                                            value={userState.phone}
                                                            onChange={handleChange}
                                                            validate={{ pattern: { value: /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/ }, required: { value: true, errorMessage: 'Please enter a phone number' } }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <Label for="customer-email">Email</Label>
                                                        <AvField
                                                            type="email"
                                                            className="form-control"
                                                            id="customer-email"
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
                                                        <Label for="customer-address">Address</Label>
                                                        <AvInput
                                                            type="textarea"
                                                            name="address"
                                                            id="customer-address"
                                                            className="form-control"
                                                            rows={2}
                                                            disabled={true}
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
                                                            <Label for="billing-name">Billing Name</Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                // defaultValue={`${userState.firstName} ${userState.lastName}`}
                                                                defaultValue={userState.firstName}
                                                                onChange={handleChange}
                                                                id="billing-name"
                                                                name="billing-name"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="6">
                                                        <FormGroup>
                                                            <Label for="billing-lastname">Invoice Rate</Label>
                                                            <Dropdown
                                                                isOpen={dropdownOpen}
                                                                disabled={true}
                                                                toggle={toggleDropdown}
                                                            >
                                                                <DropdownToggle className="full-dropdown" caret color="light">
                                                                    Select Rate
                                                                </DropdownToggle>
                                                                <DropdownMenu className="full-dropdown" >
                                                                    <DropdownItem>Lorem</DropdownItem>
                                                                    <DropdownItem>Ipsum</DropdownItem>
                                                                </DropdownMenu>
                                                            </Dropdown>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <Label for="billing-email">Billing Email</Label>
                                                            <Input
                                                                type="email"
                                                                className="form-control"
                                                                defaultValue={userState.email}
                                                                onChange={handleChange}
                                                                id="billing-email"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
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

                                                                    <Label for="wallet-email">Assign Wallet</Label>
                                                                    {/* <Input
                                type="text"
                                className="form-control"
                                id="wallet-email"
                              /> */}
                                                                    <Dropdown
                                                                        isOpen={dropdownOpenWallet}
                                                                        disabled={true}
                                                                        toggle={toggleDropdownWallet}
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            Select Wallet
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem>Some Action</DropdownItem>
                                                                            <DropdownItem>Quo Action</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>

                                                                    <Label for="wallet-email"> Scheduling Group</Label>

                                                                    <Dropdown
                                                                        isOpen={dropdownOpenGroup}
                                                                        disabled={true}
                                                                        toggle={toggleDropdownGroup}
                                                                    >
                                                                        <DropdownToggle className="full-dropdown" caret color="light">
                                                                            Select Group
                                                                        </DropdownToggle>
                                                                        <DropdownMenu className="full-dropdown" >
                                                                            <DropdownItem>Lorem</DropdownItem>
                                                                            <DropdownItem>Ipsum</DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="wallet-remark">Remark</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        disabled={true}
                                                                        id="wallet-remark"
                                                                    />
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
                                                    <Row><Label className="d-inline-flex mb-2 "> First Name : <p className="mx-2 mb-0 fw-light">{userState.firstName}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Last Name : <p className="mx-2 mb-0 fw-light">{userState.lastName}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Assigned Wallte : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Scheduled Group : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Remark : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
                                                </Col>
                                                <Col lg="6">
                                                    <Row><Label className="d-inline-flex mb-2 "> Email : <p className="mx-2 mb-0 fw-light">{userState.email}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Phone Number : <p className="mx-2 mb-0 fw-light">{userState.phone}</p></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Billing Name : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Billing Email : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
                                                    <Row><Label className="d-inline-flex mb-2 "> Invoice Rate : &nbsp;<span className=" badge badge-light badge-sm bg-light text-xs py-1 px-2 text-dark border border-secondary">Empty</span></Label></Row>
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
                                                createCustomers({ ...userState, first_name: userState.firstName, last_name: userState.lastName })
                                                    .then((result) => {
                                                        setIsAlertOpen(true);
                                                        loadAllCustomers(null);
                                                        setTimeout(() => {
                                                            setActiveTabProgress(1);
                                                            setProgressValue(25);
                                                            setModal_static(false);
                                                            setUserState({
                                                                firstName: "",
                                                                lastName: "",
                                                                email: "",
                                                                phone: "",

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
