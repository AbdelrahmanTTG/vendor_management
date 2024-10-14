import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import InvoicesTable from './InvoicesTable';

const AllInvoices = () => {
  const baseURL = window.location.origin + "/Portal/Vendor";
  const [pageInvoices, setPageInvoices] = useState([]);
  const [tableLinks, setTableLinks] = useState([]);
  const { user } = useStateContext();

  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axios.post(baseURL + "/allInvoices", payload)
        .then(({ data }) => {
          console.log(data);
          // const [Invoices] = [(data?.Invoices.data)];
          const [Invoices] = [(data?.Invoices)];
          // const [Links] = [(data?.Invoices.links)];
          setPageInvoices(Invoices);
          // setTableLinks(Links);
        });
    }
  }, [user]);


  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="All Invoices" parent="My Invoices" title="All Invoices" >
        <Link to={`/Vendor/Invoices/addInvoice`}>
          <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
            <i className="icofont icofont-pencil-alt-2 me-1"></i>{'Add Invoice'}
          </Btn>
        </Link>
      </BreadcrumbsPortal>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <InvoicesTable pageInvoices={pageInvoices} tableLinks={tableLinks} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};


export default AllInvoices;