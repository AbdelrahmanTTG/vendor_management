import React, { Fragment } from "react";
import { Card } from "reactstrap";
import { Btn, LI } from "../../../AbstractElements";
import { LogOut } from "react-feather";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../pages/context/contextAuth'

const LogoutClass = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();

  const handleLogout = () => {
    setUser(null)
    setToken(null)
  };

  return (
    <Fragment>
      <LI attrLI={{ className: "onhover-dropdown p-0", onClick: handleLogout }}>
        <Btn attrBtn={{ as: Card.Header, className: "btn btn-primary-light", color: "default" }}>
          <LogOut />
          Log out
        </Btn>
      </LI>
    </Fragment>
  );
};

export default LogoutClass;
