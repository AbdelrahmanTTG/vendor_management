import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import JobsTable from './JobsTable';

const ClosedJobs = () => {
  const baseURL = "/Portal/Vendor";
  const [pageTasks, setPageTasks] = useState([]);
  const [tableLinks, setTableLinks] = useState([]);
  const { user } = useStateContext();
  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axiosClient.post(baseURL + "/allClosedJobs", payload)
        .then(({ data }) => {
          console.log(data);
          const [Tasks] = [(data?.Tasks)];
          setPageTasks(Tasks);
        });
    }
  }, [user]);

  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="Closed Jobs" parent="My Jobs" title="Closed Jobs" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              {/* <CardHeader> */}
                {/* <H5>List Of Finished Jobs</H5>                */}
              {/* </CardHeader> */}
              <CardBody className='b-l-primary'>
                <JobsTable pageTasks={pageTasks} tableLinks={tableLinks} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ClosedJobs;