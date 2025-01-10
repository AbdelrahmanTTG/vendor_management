import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import InvoicesTable from './InvoicesTable';

const VerifiedInvoices = () => {
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
            axiosClient.post(baseURL + "/paidInvoices", payload)
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
            <BreadcrumbsPortal mainTitle="Verified Invoices" parent="My Invoices" title="Verified Invoices" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            {/* <CardHeader className=' b-l-primary'> */}
                            {/*                                 */}
                            {/*                                 */}
                            {/* </CardHeader> */}
                            <CardBody className='b-l-primary'>
                                {loading ? (
                                    <div className="loader-box" >
                                        <Spinner attrSpinner={{ className: 'loader-6' }} />
                                    </div>
                                ) :
                                    <InvoicesTable pageInvoices={pageInvoices} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} />
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};


export default VerifiedInvoices;
