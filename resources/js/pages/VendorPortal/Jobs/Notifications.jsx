import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import JobsTable from './JobsTable';

const Notifications = () => {
  const baseURL = window.location.origin + "/Portal/Vendor";
  const [pageTasks, setPageTasks] = useState([]);
  const [tableLinks, setTableLinks] = useState([]);
  const { user } = useStateContext();
  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axios.post(baseURL + "/allPlannedJobs", payload)
        .then(({ data }) => {
          console.log(data);
          const [Tasks] = [(data?.Tasks)];
          setPageTasks(Tasks);
        });
    }
  }, [user]);

  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="Jobs Notifications" parent="My Jobs" title="Jobs Notifications" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <H5>List Of Heads Up </H5>
                <span> {'Use a class'} <code> {'table'} </code> {'to any table.'}</span>
              </CardHeader>
              <CardBody>             
                <JobsTable pageTasks={pageTasks} tableLinks={tableLinks} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Notifications;