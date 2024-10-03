import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { H5, P } from '../../../../AbstractElements';

const Simple = () => {
  const [BasicLineTab, setBasicLineTab] = useState('1');
  const scrollNav = (direction) => {
    const scrollContainer = document.querySelector('.nav-scroll');
    const scrollAmount = 200;

    if (direction === 'left') {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const handleScroll = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Col sm="12" xl="6" className="xl-100">
      <Card>
        <CardBody style={{paddingBottom:"0px"}}>
        <button className="scroll-btn left" onClick={() => scrollNav('left')}><i className={`icon-angle-left`} style={{ fontSize: '24px' }}></i></button>
          <div className="nav-wrapper">
            <Nav className="border-tab nav-scroll" tabs>
              <NavItem>
                <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'VendorDetails' ? 'active' : ''}
                  onClick={() => {setBasicLineTab('1'); handleScroll('personal-data');}} 
                >
                 <i className="icofont icofont-list"></i>Vendor Details
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'InstantMessaging' ? 'active' : ''}
                  onClick={() => {setBasicLineTab('1'); handleScroll('messaging');}} 
                >
                  <i className="icofont icofont-ui-messaging"></i>Instant Messaging
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Files&Certificate' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-files"></i>Files & Certificate
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'VM Notes' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-contacts"></i>VM Notes
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Education' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
               <i className="icofont icofont-hat-alt"></i>Education
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Experience' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-stock-search"></i>Experience
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Test' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-paper"></i>Test
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Billing' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-credit-card"></i>Billing
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Price List' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-coins"></i>Price List
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Evaluation' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-star-shape"></i>Evaluation
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Feedback' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-read-book"></i>Feedback
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '14px'}}
                  href="#javascript"
                  className={BasicLineTab === 'Vacation' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-travelling"></i>Vacation
                </NavLink>
              </NavItem>
              <NavItem>
              <NavLink style={{ fontSize: '15px'}}
                  href="#javascript"
                  className={BasicLineTab === 'History' ? 'active' : ''}
                  onClick={() => setBasicLineTab('3')}
                >
                  <i className="icofont icofont-time"></i>History
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <button  className="scroll-btn right" onClick={() => scrollNav('right')}><i className={`icon-angle-right`} style={{ fontSize: '24px' }}></i></button>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Simple;