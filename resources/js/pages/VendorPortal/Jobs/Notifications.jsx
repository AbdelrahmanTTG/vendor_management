import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import TableContext from '../../../_helper/Table';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';


const Notifications = () => {
  const baseURL = window.location.origin;
  const [pageTasks, setPageTasks] = useState([]);
  const { user } = useStateContext();
  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axios.post(baseURL + "/Portal/Vendor/allPlannedJobs", payload)
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
                <H5>Listing</H5>
                <span> {'Use a class'} <code> {'table'} </code> {'to any table.'}</span>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <Table>
                    <thead className="bg-primary">
                      <tr>
                        <th scope="col">{'#'}</th>
                        <th scope="col">{'Code'}</th>
                        <th scope="col">{'Subject'}</th>
                        <th scope="col">{'Task Type'}</th>
                        <th scope="col">{'Rate'}</th>
                        <th scope="col">{'Unit'}</th>
                        <th scope="col">{'Total Cost'}</th>
                        <th scope="col">{'Currency'}</th>
                        <th scope="col">{'Start Date'}</th>
                        <th scope="col">{'Delivery Date'}</th>
                        <th scope="col">{'Status'}</th>
                        <th scope="col">{'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageTasks.map((item) => (
                        <tr key={item.id}>
                          <th scope="row">{item.id}</th>
                          <td>{item.code}</td>
                          <td>{item.subject}</td>
                          <td>{item.task_type.name}</td>
                          <td>{item.rate}</td>
                          <td>{item.count}</td>
                          <td>{item.total_cost}</td>
                          <td>{item.currency.name}</td>
                          <td>{item.start_date}</td>
                          <td>{item.delivery_date}</td>
                          <td>{item.status}</td>
                          <td>
                            <Btn attrBtn={{ className: "btn btn-primary-light", color: "default" }}>
                              <Link to={`/Vendor`}>
                                {'View'}
                              </Link>
                            </Btn>
                          </td>
                        </tr>
                      ))
                      }
                    </tbody>
                  </Table>
                  </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Notifications;