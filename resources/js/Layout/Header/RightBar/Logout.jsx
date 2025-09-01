import React, { Fragment, useEffect } from "react";
import { Card, ButtonGroup } from "reactstrap";
import { Btn, LI } from "../../../AbstractElements";
import { LogOut } from "react-feather";
import { redirect, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../pages/context/contextAuth'

const LogoutClass = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();
  const { user } = useStateContext();
  const handleLogout = () => {
    setUser(null)
    setToken(null)
  };
  const convert = () => {
    user.user_type = true
    setUser(user)
    window.location.href = "/vendor";
    // navigate("/vendor");\
  }

  return (
    <Fragment>
      <ButtonGroup>

      <LI attrLI={{ className: "onhover-dropdown pl-5" }}>
          <button className="btn btn-primary-light" onClick={() => handleLogout() }  style={{ padding: "5px" }}>
          <LogOut />
          Log out
          </button>
          {/* {user.userType == "admin" && <button className="btn btn-primary-light" onClick={() => convert()} style={{ padding: "5px" }}> Vendor portal</button>} */}
        </LI>
        </ButtonGroup>
    </Fragment>
  );
};

export default LogoutClass;
