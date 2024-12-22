import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, Navbar, NavbarToggler, Collapse, NavbarBrand, Progress } from 'reactstrap';
import { H5, P } from '../../../../AbstractElements';

const Simple = (props) => {
  
  const [BasicLineTab, setBasicLineTab] = useState('VendorDetails');
 
  const handleScroll = (section) => {
    const element = document.getElementById(section);
    if (element) {
      const offset = 200; 
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
    
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const isPermissionsEmpty = (permissions) => {
    return Object.entries(permissions)
      .filter(([key]) => key !== 'Profile')
      .every(([, value]) => value === null || value === undefined);
  }
  const isEmpty = isPermissionsEmpty(props.permissions);
  const toggle = () => setIsOpen(!isOpen);
  return (
    // <Col sm="9" xl="3" className="xl-100">
    //   <Card >
    //     <CardBody style={{ paddingBottom: '0px', paddingRight: "0px", paddingLeft: "0px" ,paddingTop:"0px"}}>
          
          <Navbar expand="lg" className="bg-body-tertiary" light>
      <div >
        <div className={`${window.innerWidth <= 768 ? "mb-5" : "mb-0"}`} >
          <NavbarToggler
            onClick={toggle}
            style={{ position: "fixed", right: "0px", top: "8.4vh", width: "100%" }}
          /> 
        </div>
                 <Collapse isOpen={isOpen} navbar>

          {/* <Nav className="border-tab flex-wrap " tabs style={{ margin: 0 }}>
            {props.permissions?.PersonalData?.view == 1 && (

            <NavItem className="fw-bold" style={{ margin: 0 }}>
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                className={BasicLineTab === 'VendorDetails' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('VendorDetails'); handleScroll('personal-data'); }}
              >
                <i className="icofont icofont-list"></i> Vendor Details
              </NavLink>
            </NavItem>
            )}
            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                className={BasicLineTab === 'InstantMessaging' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setBasicLineTab('InstantMessaging');
                  handleScroll('messaging'); 
                }}
              >
                <i className="icofont icofont-ui-messaging"></i> Instant Messaging
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'VM-Notes' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('VM-Notes'); handleScroll('VM-Notes'); }}
              >
                <i className="icofont icofont-contacts"></i> VM Notes
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Files-Certificate"
                className={BasicLineTab === 'Files-Certificate' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Files-Certificate'); handleScroll('Files-Certificate'); }}
              >
                <i className="icofont icofont-files"></i> Files & Certificate
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Education' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Education'); handleScroll('Education'); }}
              >
                <i className="icofont icofont-hat-alt"></i> Education
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Experience' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Experience'); handleScroll('Experience'); }}
              >
                <i className="icofont icofont-stock-search"></i> Experience
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
           
                className={BasicLineTab === 'Test' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Test'); handleScroll('Test'); }}
              >
                <i className="icofont icofont-paper"></i> Test
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Billing' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Billing'); handleScroll('Billing'); }}
              >
                <i className="icofont icofont-credit-card"></i> Billing
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Portal_User' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Portal_User'); handleScroll('Portal_User'); }}
              >
                <i className="icofont icofont-credit-card"></i> Portal User
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Price List"
                className={BasicLineTab === 'Price List' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Price List'); handleScroll('Price_List'); }}
              >
                <i className="icofont icofont-coins"></i> Price List
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
             
                className={BasicLineTab === 'Evaluation' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Evaluation'); handleScroll('Evaluation'); }}
              >
                <i className="icofont icofont-star-shape"></i> Evaluation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Feedback' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Feedback'); handleScroll('Feedback'); }}
              >
                <i className="icofont icofont-read-book"></i> Feedback
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Vacation' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Vacation'); handleScroll('Vacation'); }}
              >
                <i className="icofont icofont-travelling"></i> Vacation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
             
                className={BasicLineTab === 'History' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('History'); handleScroll('History'); }}
              >
                <i className="icofont icofont-time"></i> History
              </NavLink>
            </NavItem>
                </Nav> */}
          <Nav className="border-tab flex-wrap" tabs style={{ margin: 0 }}>
            {[
              { key: 'VendorDetails', permission: props.permissions?.PersonalData?.view, icon: 'icofont-list', label: 'Vendor Details', scrollTo: 'personal-data' },
              { key: 'InstantMessaging', permission: props.permissions?.Messaging?.view, icon: 'icofont-ui-messaging', label: 'Instant Messaging', scrollTo: 'messaging' },
              { key: 'VM-Notes', permission: props.permissions?.VMnote?.view, icon: 'icofont-contacts', label: 'VM Notes', scrollTo: 'VM-Notes' },
              { key: 'Files-Certificate', permission: props.permissions?.FilesCertificate?.view, icon: 'icofont-files', label: 'Files & Certificate', scrollTo: 'Files-Certificate' },
              { key: 'Education', permission: props.permissions?.Education?.view, icon: 'icofont-hat-alt', label: 'Education', scrollTo: 'Education' },
              { key: 'Experience', permission: props.permissions?.Experience?.view, icon: 'icofont-stock-search', label: 'Experience', scrollTo: 'Experience' },
              { key: 'Test', permission: props.permissions?.Test?.view, icon: 'icofont-paper', label: 'Test', scrollTo: 'Test' },
              { key: 'Billing', permission: props.permissions?.Billing?.view, icon: 'icofont-credit-card', label: 'Billing', scrollTo: 'Billing' },
              { key: 'Portal_User', permission: props.permissions?.Portal_User?.view, icon: 'icofont-credit-card', label: 'Portal User', scrollTo: 'Portal_User' },
              { key: 'Price List', permission: props.permissions?.Price_List?.view, icon: 'icofont-coins', label: 'Price List', scrollTo: 'Price_List' },
              { key: 'Evaluation', permission: props.permissions?.Evaluation?.view, icon: 'icofont-star-shape', label: 'Evaluation', scrollTo: 'Evaluation' },
              { key: 'Feedback', permission: props.permissions?.Feedback?.view, icon: 'icofont-read-book', label: 'Feedback', scrollTo: 'Feedback' },
              { key: 'Vacation', permission: props.permissions?.Vacation?.view, icon: 'icofont-travelling', label: 'Vacation', scrollTo: 'Vacation' },
              { key: 'History', permission: props.permissions?.History?.view, icon: 'icofont-time', label: 'History', scrollTo: 'History' }
            ]
              .sort((a, b) => (b.permission ? 1 : 0) - (a.permission ? 1 : 0))
              .map((item, index) => (
              <NavItem key={index} className="fw-bold">
                {item.permission ? (
                  <NavLink
                    style={{ fontSize: '13px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                    className={BasicLineTab === item.key ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setBasicLineTab(item.key);
                      handleScroll(item.scrollTo);
                    }}
                  >
                    <i className={`icofont ${item.icon}`}></i> {item.label}
                  </NavLink>
                ) : (
                  <div style={{ visibility: 'hidden', width: '100px' }}>{""}</div>
                )}
              </NavItem>
            ))}
          </Nav>

        </Collapse>
        {!isEmpty && (
          <div style={{ position: 'relative' }}>
            <Progress value={props.value} color="success" style={{
              height: '10px', position: 'relative', borderRadius: '0'
            }}>
              <span style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                fontWeight: 'bold',

              }}>
                {props.value}%
              </span>
            </Progress>
          </div>
        )}
              </div>
          </Navbar>

         
    //     </CardBody>
    //   </Card>
    // </Col>
 
  );
};

export default Simple;