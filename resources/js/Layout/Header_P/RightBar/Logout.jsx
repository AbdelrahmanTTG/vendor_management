import React, { Fragment } from "react";
import { Card } from "reactstrap";
import { Btn, LI } from "../../../AbstractElements";
import { LogOut } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from '../../../pages/context/contextAuth'

const LogoutClass = () => {
  const history = useNavigate();
  const { setUser, setToken } = useStateContext();
  const Logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("profileURL");
    localStorage.removeItem("token");
    localStorage.removeItem("auth0_profile");
    localStorage.removeItem("Name");
    localStorage.removeItem("ACCESS_TOKEN");
    // localStorage.setItem("authenticated", false);
  };

  return (
    <Fragment>
      <LI attrLI={{ className: "onhover-dropdown p-0", onClick: Logout }}>
        <Btn attrBtn={{ as: Card.Header, className: "btn btn-primary-light", color: "default" }}>
          {/* <Link to={`http://127.0.0.1:8000/login`}> */}
            <LogOut />
            Log out
          {/* </Link> */}
        </Btn>
      </LI>
    </Fragment>
  );
};

export default LogoutClass;
