import React, { Fragment, useState, useEffect } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Navigate } from 'react-router-dom';
import { Btn, H4, P } from "../AbstractElements";
import { toast } from "react-toastify";
import axiosClient from "./AxiosClint";
import { useStateContext } from "./context/contextAuth";
import { Image } from '../AbstractElements';
import Logo from '../assets/images/logo/1-400x141.png';

const Login = () => {
 
  const { user, token } = useStateContext();
  if (token) {
    if (user?.user_type) {
      return <Navigate to='/vendor' />
    } else {
      return <Navigate to='/vm' />
    }
  }

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
      } else {
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
    return <Navigate to={redirect} />;
  }
  
  return (
    <Fragment>
      <div className="p-0 container-fluid">
        <div id="boxed-wrapper">
          <div id="wrapper" className="fusion-wrapper">
            <main id="main" className="clearfix width-100" style={{ padding: "0", backgroundColor: "#0d1267" }}>
              
              <div className="fusion-row" style={{ maxWidth: "100%" }}>
                <section id="content" className="full-width">
                  
                  <div id="post-1079" className="post-1079 page type-page status-publish hentry">
                    
                    <div className="post-content">
                     
                      <div
                        className="fusion-fullwidth fullwidth-box fusion-builder-row-3 fusion-flex-container fusion-parallax-none hundred-percent-fullwidth non-hundred-percent-height-scrolling lazyload"
                        style={{
                          "--awb-border-radius-top-left": "0px",
                          "--awb-border-radius-top-right": "0px",
                          "--awb-border-radius-bottom-right": "0px",
                          "--awb-border-radius-bottom-left": "0px",
                          "--awb-padding-right": "11vw",
                          "--awb-padding-left": "11vw",
                          "--awb-padding-right-medium": "5vw",
                          "--awb-padding-left-medium": "5vw",
                          "--awb-padding-top-small": "3vh",
                          "--awb-margin-bottom": "0px",
                          "--awb-background-color": "#0d1267",
                          "--awb-background-size": "cover",
                          "--awb-flex-wrap": "wrap",
                          backgroundImage: `url('https://lingotalents.com/wp-content/uploads/2024/08/home-bg-3.svg')`,
                          backgroundSize: "cover",  
                          backgroundPosition: "bottom",  
                          backgroundAttachment: "fixed", 
                        }}
                      >
                        
                        {/* <div className="entry-content" style={{ position: "fixed", right: "38vw" }}>
                          <Image attrImage={{ className: 'img-fluid d-inline', src: `${Logo}`, alt: '' }} />
                        </div> */}
                        <div>
                          
                        </div>
                        <Row>
                          <Col className="col-12">
                            <div className="text-center mb-3">
                              <Image attrImage={{ className: 'img-fluid d-inline', src: `${Logo}`, alt: '' }} />
                            </div>
                            <div className="login-card" style={{ backgroundColor: "rgb(0,0,0,0%)", position:"relative" , top:"-20vh"}}>
                              <div className="login-main login-tab">
                                <Form className="theme-form" onSubmit={Submit}>
                                  <H4>Sign</H4>
                                  <P>{"Enter your email & password to login"}</P>
                                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                  <FormGroup>
                                    <Label className="col-form-label">Email Address</Label>
                                    <Input className="form-control" type="email" required onChange={(e) => setEmail(e.target.value)} />
                                  </FormGroup>
                                  <FormGroup className="position-relative">
                                    <Label className="col-form-label">Password</Label>
                                    <Input
                                      className="form-control"
                                      type={togglePassword ? "text" : "password"}
                                      required
                                      onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                                      <span className={togglePassword ? "" : "show"}></span>
                                    </div>
                                  </FormGroup>
                                  <div className="form-group mb-0">
                                    <Btn attrBtn={{ color: "primary", className: "btn-block", disabled: loading ? loading : loading }}>
                                      Login
                                    </Btn>
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </Col>
                        </Row>

                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
        {/* <Row>
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
                    <div className="checkbox ms-3">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" htmlFor="checkbox1">
                        Remember Password
                      </Label>
                    </div>
                    <a className="link" href="#javascript">
                      Forgot Password
                    </a>
                    <Btn attrBtn={{ color: "primary", className: "btn-block", disabled: loading ? loading : loading }}>Login</Btn>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row> */}
      </div>
    
    </Fragment>
  );
};

export default Login;
