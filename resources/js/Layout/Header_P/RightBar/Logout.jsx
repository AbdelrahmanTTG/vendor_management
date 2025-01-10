import React, { Fragment } from "react";
import { Card } from "reactstrap";
import { Btn, LI } from "../../../AbstractElements";
import { LogOut } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from '../../../pages/context/contextAuth'

const LogoutClass = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();
    const { user } = useStateContext();
  
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
  const convert = () => {
    delete user.user_type;
    setUser(user)
    window.location.href = "/vm";


  }
  return (
    <Fragment>
      <LI attrLI={{ className: "onhover-dropdown p-0" }}>
        <button className="btn btn-primary-light" onClick={() => Logout() }  style={{ padding: "5px" }}>
               <LogOut />
               Log out
               </button>
               {user.userType == "admin" && <button className="btn btn-secondary m-l-5 btn-sm" onClick={() => convert()} > Go back</button>}
             </LI>
    </Fragment>
  );
};

export default LogoutClass;
