import React, { Fragment, useState, useEffect } from "react";
import { Col, Form, FormGroup, Input, Label, Row, Container } from "reactstrap";
import { Navigate } from 'react-router-dom';
import { Btn, H4, P, Footer } from "../AbstractElements";
import { toast } from "react-toastify";
import axiosClient from "./AxiosClint";
import { useStateContext } from "./context/contextAuth";
import { Image } from '../AbstractElements';
import Logo from '../assets/images/logo/Lingotalents.png';
import login_interface from '../assets/images/login/login-770-interface.png';
import { ToastContainer } from "react-toastify";
import Toast from "./Toast";

const Login = () => {
  const basictoaster = () => {
    toast.error("status", {
      position: toast.POSITION.TOP_RIGHT
    });
  };
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
  const [toasts, setToasts] = useState([]);

  const error = (message, type = "error") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const Submit = (e) => {
    setLoading(true);
    e.preventDefault();
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
      error("Incorrect email or password")
      setLoading(false);
    });



  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <Fragment>
      <section>
        <Container fluid={true}>
          <Row>
            <Col sm="3" lg="5" className="d-none d-sm-block">
              <Image attrImage={{ className: "bg-img-cover bg-center", src: `${login_interface}`, alt: "looginpage" }} />
            </Col>
            <Col sm="9 p-0" lg="7 p-0" >
              <div className="login-card d-block d-md-flex" >
                <Form className="theme-form login-form" onSubmit={Submit} >
                  <div className="m-b-10" >
                    <Image attrImage={{ className: 'img-fluid d-inline', src: `${Logo}`, alt: '' }} />
                  </div>
                  <h6>Welcome! Log in to your account.</h6>
                  {/* {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} */}
                  <FormGroup>
                    <Label className="col-form-label">Email Address</Label>
                    <div className="input-group"><span className="input-group-text"><i className="icon-email"></i></span>
                      <Input className="form-control" type="email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </FormGroup>
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">Password</Label>
                    <div className="input-group"><span className="input-group-text"><i className="icon-lock"></i></span>
                      <Input
                        className="form-control"
                        type={togglePassword ? "text" : "password"}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                      <span className={togglePassword ? "" : "show"}></span>
                    </div>
                  </FormGroup>                
                  <FormGroup className="pt-2">
                    <Btn attrBtn={{ color: "primary", className: "btn-block w-100", disabled: loading ? loading : loading }}>
                    Sign in
                    </Btn>
                    </FormGroup>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section >
{
    toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))
  }
    </Fragment >
  );
};

export default Login;
