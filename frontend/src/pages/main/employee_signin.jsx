import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Alert,
  Container,
  Label,
  FormGroup,
} from "reactstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Employee from "../../controllers/employee";
import { withRouter } from 'react-router-dom'
// import images
import logodark from "../../assets/images/logo-dark.png";
import welcome from "../../assets/images/welcome.png";
import useAuth from "../../useAuth";

const Employee_Signin = () => {
  const { loginUser, loading } = useAuth();
  const [usernameval, setUsernameval] = useState("");
  const [passval, setPassval] = useState("");
  const [error, setError] = useState("");

  //on username change
  const usernameValueChange = (e) => {
    setUsernameval(e.currentTarget.value);
  };

  //on password change
  const passValueChange = (e) => {
    setPassval(e.currentTarget.value);
  };

  //On submit button
  const onLogin = async (e) => {
    e.preventDefault();

    //call login controller function
    var status = await loginUser(Employee,
      usernameval,
      passval
    );

    switch (status) {

      // password not match
      case 403:
        await setError(
          "Inavlid Username or Password"
        );
        return -1;
      // user not found
      case 400:
        await setError(
          "Inavlid Username or Password"
        );
        return -1;
      // network error
      case 600:
        setError("Please check your network connection");
        return -1;
      case true:
        //success redirect
        //  history.push('/dashboard/overview') 
        window.location.replace('/dashboard/overview/emp')
        break;
    }

  }

  return (
    <React.Fragment>
      <div>
        <Container className="p-0">
          <Row className="no-gutters">
            <Col lg={12}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Col lg={12} className="shadow rounded-3 p-5">
                    <Row className="p-5">
                      <Col lg={8}>
                        <h1 className="text-center my-5 fw-bold">WELCOME!</h1>
                        <img src={welcome} style={{ width: "100%" }} alt="Welcome" />
                      </Col>
                      <Col lg={4} className="my-auto">
                        <Row className="justify-content-center">
                          <Col lg={12}>
                            <div>
                              <div className="text-center">
                                <div>
                                  <Link to="/home" className="logo">
                                    <img src={logodark} height="40" alt="logo" />
                                  </Link>
                                </div>

                                <h4 className="font-size-18 mt-2 badge text-dark bg-gami">Employee Login</h4>
                              </div>

                              {error && error ? <Alert color="danger">{error}</Alert> : null}



                              <div className="p-2 mt-3">
                                <AvForm
                                  className="form-horizontal"
                                  onValidSubmit={(e) => {
                                    onLogin(e);
                                  }
                                  }
                                >
                                  <FormGroup className="auth-form-group-custom mb-4">
                                    <i className="ri-user-2-line auti-custom-input-icon"></i>
                                    <Label htmlFor="username">Username</Label>
                                    <AvField
                                      name="username"
                                      value=""
                                      type="text"
                                      className="form-control"
                                      id="username"
                                      onChange={(e) => usernameValueChange(e)}
                                      validate={{ required: true }}
                                      placeholder="Enter username"
                                    />
                                  </FormGroup>

                                  <FormGroup className="auth-form-group-custom mb-4">
                                    <i className="ri-lock-2-line auti-custom-input-icon"></i>
                                    <Label htmlFor="userpassword">Password</Label>
                                    <AvField
                                      name="pass"
                                      value=""
                                      type="password"
                                      className="form-control"
                                      onChange={(e) => passValueChange(e)}
                                      id="pass"
                                      placeholder="Enter password"
                                    />
                                  </FormGroup>

                                  {/* <div className="custom-control custom-checkbox">
                              <Input
                                type="checkbox"
                                className="custom-control-input"
                                id="customControlInline"
                              />
                              <Label
                                className="custom-control-label"
                                htmlFor="customControlInline"
                              >
                                Remember me
                              </Label>
                            </div> */}

                                  <div className="mt-4 text-center">
                                    <Button
                                      className="w-50 waves-effect bg-gami waves-light"
                                      type="submit"
                                    >
                                      Log In
                                    </Button>
                                  </div>

                                  {/* <div className="mt-4 text-center">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                <i className="mdi mdi-lock mr-1"></i> Forgot
                                your password?
                              </Link>
                            </div> */}
                                </AvForm>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Employee_Signin);
