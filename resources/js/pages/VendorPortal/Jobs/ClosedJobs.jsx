import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import JobsTable from './JobsTable';

const ClosedJobs = () => {
  const baseURL = "/Portal/Vendor";
  const [pageTasks, setPageTasks] = useState([]);
  const [pageLinks, setPageLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      let payload;           
      if (user.user_type == 'vendor') {
          payload = {
              'id': user.id,
              'page': currentPage,
          };
      } else if (user.userType == 'admin') {
          payload = {
              'userType': 'admin',
              'id': 0,
              'page': currentPage,
          };
      }
      axiosClient.post(baseURL + "/allClosedJobs", payload)
        .then(({ data }) => {
          const [Tasks] = [(data?.Tasks)];
          const [Links] = [(data?.Links)];
          setPageTasks(Tasks);
          setPageLinks(Links);
          setLoading(false);
        });
    }
  }, [user, currentPage]);

  function handleDataFromChild(data) {
    setCurrentPage(data);
  }
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
                {loading ? (
                  <div className="loader-box" >
                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                  </div>
                ) :
                  <JobsTable pageTasks={pageTasks} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} viewVendor={user.user_type == 'vendor'?false:true}/>
                }
                </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ClosedJobs;