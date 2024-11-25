import React, { Fragment, useState } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Navigate } from 'react-router-dom';
import { Btn, H4, P } from "../AbstractElements";
import { toast } from "react-toastify";
import axiosClient from "./AxiosClint";
import { useStateContext } from "./context/contextAuth";

const Login = () => {   
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useStateContext();
  const [redirect, setRedirect] = useState(null);
  const [togglePassword, setTogglePassword] = useState(false);

  const Submit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: email,
      password: password
    }
    axiosClient.post("auth/login", payload).then(({ data }) => {
      setUser(data.user);
      setToken(data.token, data.expires_in);
        if (data.user.user_type) {
          setRedirect("/vendor");
         }else{
          setRedirect("/vm");
         }
      setLoading(false);
        }).catch(err => {
      const response = err.response;
      if (response && response.status === 422) {
        setErrorMessage(response.data.errors);
      } else if (response && response.status === 401) {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setLoading(false);
    });
    
   
  }    
  if (redirect) {
    return <Navigate to = {redirect} />;
  }
  return (
    <Fragment>
      <div className="p-0 container-fluid">
        <Row>
          <Col className="col-12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form" onSubmit={Submit}>
                  <H4>Sign </H4>
                  <P>{"Enter your email & password to login"}</P>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <FormGroup>
                    <Label className="col-form-label">Email Address</Label>
                    <Input className="form-control" type="email" required onChange={(e) => setEmail(e.target.value)} />
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">Password</Label>
                    <Input className="form-control" type={togglePassword ? "text" : "password"} required onChange={(e) => setPassword(e.target.value)} />
                    <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                      <span className={togglePassword ? "" : "show"}></span>
                    </div>
                  </FormGroup>
                  <div className="form-group mb-0">
                    {/* <div className="checkbox ms-3">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" htmlFor="checkbox1">
                        Remember Password
                      </Label>
                    </div> */}
                    {/* <a className="link" href="#javascript">
                      Forgot Password
                    </a> */}
                    <Btn attrBtn={{ color: "primary", className: "btn-block", disabled: loading ? loading : loading }}>Login</Btn>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default Login;
