import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { BreadcrumbsPortal} from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import InvoicesTable from './InvoicesTable';

const VerifiedInvoices = () => {
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
            axiosClient.post(baseURL + "/paidInvoices", payload)
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
                                <InvoicesTable pageInvoices={pageInvoices} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};


export default VerifiedInvoices;
