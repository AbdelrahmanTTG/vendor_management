import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { H5, P } from '../../../../AbstractElements';

const Simple = () => {
  const [BasicLineTab, setBasicLineTab] = useState('VendorDetails');
  const scrollNav = (direction) => {
    const scrollContainer = document.querySelector('.nav-scroll');
    const scrollAmount = 190;

    if (direction === 'left') {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
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
  

  return (
    <Col sm="12" xl="6" className="xl-100">
      <Card >
        <CardBody style={{ paddingBottom: '0px' ,paddingRight:"0px",paddingLeft:"0px"}}>
          <Nav className="border-tab flex-wrap" tabs style={{margin:0}}>
            <NavItem className="fw-bold" style={{ margin: 0 }}>
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#VendorDetails"
                className={BasicLineTab === 'VendorDetails' ? 'active' : ''}
                onClick={() => { setBasicLineTab('VendorDetails'); handleScroll('personal-data'); }}
              >
                <i className="icofont icofont-list"></i> Vendor Details
              </NavLink>
            </NavItem>


            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#InstantMessaging"
                className={BasicLineTab === 'InstantMessaging' ? 'active' : ''}
                onClick={() => { setBasicLineTab('InstantMessaging'); handleScroll('messaging'); }}
              >
                <i className="icofont icofont-ui-messaging"></i> Instant Messaging
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#VM-Notes"
                className={BasicLineTab === 'VM-Notes' ? 'active' : ''}
                onClick={() => { setBasicLineTab('VM-Notes'); handleScroll('VM-Notes'); }}
              >
                <i className="icofont icofont-contacts"></i> VM Notes
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Files-Certificate"
                className={BasicLineTab === 'Files-Certificate' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Files-Certificate'); handleScroll('Files-Certificate'); }}
              >
                <i className="icofont icofont-files"></i> Files & Certificate
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Education"
                className={BasicLineTab === 'Education' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Education'); handleScroll('Education'); }}
              >
                <i className="icofont icofont-hat-alt"></i> Education
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Experience"
                className={BasicLineTab === 'Experience' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Experience'); handleScroll('Experience'); }}
              >
                <i className="icofont icofont-stock-search"></i> Experience
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Test"
                className={BasicLineTab === 'Test' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Test'); handleScroll('Test'); }}
              >
                <i className="icofont icofont-paper"></i> Test
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Billing"
                className={BasicLineTab === 'Billing' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Billing'); handleScroll('Billing'); }}
              >
                <i className="icofont icofont-credit-card"></i> Billing
              </NavLink>
            </NavItem>
            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Portal_User"
                className={BasicLineTab === 'Portal_User' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Portal_User'); handleScroll('Portal_User'); }}
              >
                <i className="icofont icofont-credit-card"></i> Portal User
              </NavLink>
            </NavItem>
            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Price List"
                className={BasicLineTab === 'Price List' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Price List'); handleScroll('Price_List'); }}
              >
                <i className="icofont icofont-coins"></i> Price List
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Evaluation"
                className={BasicLineTab === 'Evaluation' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Evaluation'); handleScroll('Evaluation'); }}
              >
                <i className="icofont icofont-star-shape"></i> Evaluation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Feedback"
                className={BasicLineTab === 'Feedback' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Feedback'); handleScroll('Feedback'); }}
              >
                <i className="icofont icofont-read-book"></i> Feedback
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#Vacation"
                className={BasicLineTab === 'Vacation' ? 'active' : ''}
                onClick={() => { setBasicLineTab('Vacation'); handleScroll('Vacation'); }}
              >
                <i className="icofont icofont-travelling"></i> Vacation
              </NavLink>
            </NavItem>

            <NavItem className="fw-bold">
              <NavLink
                style={{ fontSize: '11px', paddingLeft: "10px", paddingRight: "10px", margin: 0 }}
                href="#History"
                className={BasicLineTab === 'History' ? 'active' : ''}
                onClick={() => { setBasicLineTab('History'); handleScroll('History'); }}
              >
                <i className="icofont icofont-time"></i> History
              </NavLink>
            </NavItem>
          </Nav>
        </CardBody>
      </Card>
    </Col>
 
  );
};

export default Simple;