import Loader from "./Loader";
import Taptop from "./TapTop";
import Header from "./Header_P";
import Sidebar from "./Sidebar_P";
import Footer from "./Footer";
import React, { Fragment, useRef } from "react";
import ThemeCustomize from "../Layout/ThemeCustomizer";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import CustomizerContext from "../_helper/Customizer";
import { Outlet, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AnimationThemeContext from "../_helper/AnimationTheme";
import ConfigDB from "../Config/ThemeConfig_P";
import Offline from "../offLine";

const AppLayout = ({ children, classNames, ...rest }) => {
  const location = useLocation();
  const { sidebar_types } = useContext(CustomizerContext);
  const queryData = location?.search?.split("=")[1]?.toString();
  const settings1 = localStorage.getItem("sidebar_Settings") || ConfigDB.data.settings.sidebar_setting || queryData;
  const sidebar_types1 = localStorage.getItem("sidebar_types") || ConfigDB.data.settings.sidebar.type || sidebar_types;
  const { animation } = useContext(AnimationThemeContext);
  const animationTheme = localStorage.getItem("animation") || animation || ConfigDB.data.router_animation;
  document.body.classList.add('ltr');
  document.body.classList.remove('box-layout');
  // localStorage.setItem('mix_background_layout','light-only');

  const nodeRef = useRef(null);

  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  return (
    <Fragment>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${sidebar_types1} ${settings1}`} id='pageWrapper'>
        <Header />
        <div className='page-body-wrapper horizontal-menu'>
          <Sidebar />
          <TransitionGroup {...rest}>
            <CSSTransition key={location.key} timeout={100} classNames={animationTheme} nodeRef={nodeRef} unmountOnExit>
              <div className='page-body' ref={nodeRef}>
                <Outlet />
                <Offline />
              </div>
            </CSSTransition>
          </TransitionGroup>
          <Footer />
        </div>
      </div>
      <ThemeCustomize />
      <ToastContainer />
    </Fragment>
  );
};
export default AppLayout;
