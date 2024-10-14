import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import  InvoicesTable from './InvoicesTable';

const VerifiedInvoices = () => {
    const baseURL = window.location.origin +"/Portal/Vendor";
    const [pageInvoices, setPageInvoices] = useState([]);
    const [tableLinks, setTableLinks] = useState([]);
    const { user } = useStateContext();

    useEffect(() => {
        if (user) {
            const payload = {
                'id': user.id
            };
            axios.post(baseURL + "/paidInvoices", payload)
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
                                <InvoicesTable pageInvoices={pageInvoices} tableLinks={tableLinks} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};


export default VerifiedInvoices;
