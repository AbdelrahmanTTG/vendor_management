import React, { Fragment,  useEffect, useState } from 'react';
import { Container, Row, Col, Card,  CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import JobsTable from './JobsTable';

const Offers = () => {
  const baseURL = window.location.origin + "/api/Portal/Vendor";
  const [pageTasks, setPageTasks] = useState([]);
  const [pageLinks, setPageLinks] = useState([]);
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      let payload;           
      if (user.user_type == 'vendor') {
          payload = {
              'id': user.id,              
          };
      } else if (user.userType == 'admin') {
          payload = {
              'userType': 'admin',
              'id': 0,              
          };
      }   
      axiosClient.post(baseURL + "/allJobOffers", payload)
        .then(({ data }) => {
          const [Tasks] = [(data?.Tasks)];
          setPageTasks(Tasks);
          setLoading(false);
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
                {loading ? (
                  <div className="loader-box" >
                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                  </div>
                ) :
                  <JobsTable pageTasks={pageTasks} pageLinks={pageLinks} viewVendor={user.user_type == 'vendor'?false:true}/>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment >
  );
};

export default Offers;