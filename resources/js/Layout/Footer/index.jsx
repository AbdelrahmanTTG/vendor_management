import React, { Fragment } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Footer, P } from '../../AbstractElements';
import { useLocation } from 'react-router-dom';

const FooterClass = () => {
  const location = useLocation();
  
  return (
    <Fragment>
      <Footer attrFooter={{ className: `footer ${location.pathname === '/viho/page-layout/footer-dark' ? 'footer-dark' : location.pathname === '/viho/page-layout/footer-fixed' ? 'footer-fix' : ''}` }} >
        <Container fluid={true}>
          <Row>
            <Col md="6" className="footer-copyright">
              <P attrPara={{ className: 'mb-0' }} >{'Copyright 2024 © Lingo Talents  All rights reserved.'}</P>
            </Col>
            <Col md="6">
             
            </Col>
          </Row>
        </Container>
      </Footer>
    </Fragment>
  );
};

export default FooterClass;