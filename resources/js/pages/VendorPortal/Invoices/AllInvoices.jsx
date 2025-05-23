import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, Spinner } from '../../../AbstractElements';
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
      axiosClient.post(baseURL + "/allInvoices", payload)
        .then(({ data }) => {
          const [Invoices] = [(data?.Invoices)];
          const [Links] = [(data?.Links)];
          setPageInvoices(Invoices);
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
      <BreadcrumbsPortal mainTitle="All Invoices" parent="My Invoices" title="All Invoices" >
        {(user.user_type == 'vendor') &&
          <Link to={`/Vendor/Invoices/addInvoice`}>
            <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
              <i className="icofont icofont-pencil-alt-2 me-1"></i>{'Add Invoice'}
            </Btn>
          </Link>
        }
      </BreadcrumbsPortal>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {loading ? (
                  <div className="loader-box" >
                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                  </div>
                ) :
                  <InvoicesTable pageInvoices={pageInvoices} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} viewVendor={user.user_type == 'vendor'?false:true}/>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};


export default AllInvoices;