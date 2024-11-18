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

  const toggle = () => setIsOpen(!isOpen);
  return (
    // <Col sm="9" xl="3" className="xl-100">
    //   <Card >
    //     <CardBody style={{ paddingBottom: '0px', paddingRight: "0px", paddingLeft: "0px" ,paddingTop:"0px"}}>
          
          <Navbar expand="lg" className="bg-body-tertiary" light>
        <div style={{marginBottom:"5vh"}}>
          <NavbarToggler
            onClick={toggle}
            style={{ position: "fixed", right: "0px", top: "8.4vh", width: "100%" }}
          /> 
        </div>
                 <Collapse isOpen={isOpen} navbar>

          <Nav className="border-tab flex-wrap " tabs style={{margin:0}}>
            <NavItem className="fw-bold" style={{ margin: 0 }}>
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                className={BasicLineTab === 'VendorDetails' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('VendorDetails'); handleScroll('personal-data'); }}
              >
                <i className="icofont icofont-list"></i> Vendor Details
              </NavLink>
            </NavItem>


            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
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
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'VM-Notes' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('VM-Notes'); handleScroll('VM-Notes'); }}
              >
                <i className="icofont icofont-contacts"></i> VM Notes
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Files-Certificate"
                className={BasicLineTab === 'Files-Certificate' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Files-Certificate'); handleScroll('Files-Certificate'); }}
              >
                <i className="icofont icofont-files"></i> Files & Certificate
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Education' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Education'); handleScroll('Education'); }}
              >
                <i className="icofont icofont-hat-alt"></i> Education
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Experience' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Experience'); handleScroll('Experience'); }}
              >
                <i className="icofont icofont-stock-search"></i> Experience
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
           
                className={BasicLineTab === 'Test' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Test'); handleScroll('Test'); }}
              >
                <i className="icofont icofont-paper"></i> Test
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Billing' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Billing'); handleScroll('Billing'); }}
              >
                <i className="icofont icofont-credit-card"></i> Billing
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Portal_User' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Portal_User'); handleScroll('Portal_User'); }}
              >
                <i className="icofont icofont-credit-card"></i> Portal User
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Price List"
                className={BasicLineTab === 'Price List' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Price List'); handleScroll('Price_List'); }}
              >
                <i className="icofont icofont-coins"></i> Price List
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
             
                className={BasicLineTab === 'Evaluation' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Evaluation'); handleScroll('Evaluation'); }}
              >
                <i className="icofont icofont-star-shape"></i> Evaluation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
               
                className={BasicLineTab === 'Feedback' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Feedback'); handleScroll('Feedback'); }}
              >
                <i className="icofont icofont-read-book"></i> Feedback
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
              
                className={BasicLineTab === 'Vacation' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('Vacation'); handleScroll('Vacation'); }}
              >
                <i className="icofont icofont-travelling"></i> Vacation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
             
                className={BasicLineTab === 'History' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); setBasicLineTab('History'); handleScroll('History'); }}
              >
                <i className="icofont icofont-time"></i> History
              </NavLink>
            </NavItem>
                </Nav>
                
        </Collapse>
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
          </Navbar>

         
    //     </CardBody>
    //   </Card>
    // </Col>
 
  );
};

export default Simple;