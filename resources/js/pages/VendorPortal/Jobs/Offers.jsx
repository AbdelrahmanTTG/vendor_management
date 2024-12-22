import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import JobsTable from './JobsTable';

const Offers = () => {
  const baseURL = window.location.origin + "/api/Portal/Vendor";
  const [pageTasks, setPageTasks] = useState([]);
  const [pageLinks, setPageLinks] = useState([]);
  const { user } = useStateContext();
  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axiosClient.post(baseURL + "/allJobOffers", payload)
        .then(({ data }) => {
          // console.log(data);
          const [Tasks] = [(data?.Tasks)];
          setPageTasks(Tasks);
        });
    }
  }, [user]);

  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="Jobs Offers" parent="My Jobs" title="Jobs Offers" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              {/* <CardHeader> */}
              {/* <H5>List Of New Jobs</H5>                */}
              {/* </CardHeader> */}
              <CardBody>
                <JobsTable pageTasks={pageTasks} pageLinks={pageLinks} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment >
  );
};

export default Offers;