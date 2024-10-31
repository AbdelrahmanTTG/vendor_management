import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import InvoicesTable from './InvoicesTable';

const AllInvoices = () => {
  const baseURL = "/Portal/Vendor";
  const [pageInvoices, setPageInvoices] = useState([]);
  const [pageLinks, setPageLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useStateContext();

  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id,
        'page': currentPage,
      };
      axiosClient.post(baseURL + "/allInvoices", payload)
        .then(({ data }) => {         
          const [Invoices] = [(data?.Invoices)];
          const [Links] = [(data?.Links)];
          setPageInvoices(Invoices);
          setPageLinks(Links);
        });
    }
  }, [user, currentPage]);

  function handleDataFromChild(data) {
      setCurrentPage(data);
  }

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
                <InvoicesTable pageInvoices={pageInvoices} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};


export default AllInvoices;