import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import TableContext from '../../../_helper/Table';
import { useStateContext } from '../../context/contextAuth';
import { Link, useParams } from 'react-router-dom';
import  JobsTable from './JobsTable';

const ViewOffer = () => {
    const baseURL = window.location.origin;
    const [pageTasks, setPageTasks] = useState([]);
  
    const { user } = useStateContext();
    const { id,type } = useParams()


    useEffect(() => {
        if (user) {
            const payload = {
                'vendor': user.id,
                'id':id,
                'type':type,
            };

            axios.post(baseURL + "/Portal/Vendor/ViewOffer", payload)
                .then(({ data }) => {
                    console.log(data);
                    // const [Tasks] = [(data?.Tasks.data)];
                    const [Tasks] = [(data?.Task)];
                    // const [Links] = [(data?.Tasks.links)];
                    setPageTasks(Tasks);
                   
                });
        }
    }, [user]);

       

    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="Offer Details" parent="My Jobs" title="View Offer" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <H5>Offer Details</H5>
                                {/* <span> {'Use a class'} <code> {'table'} </code> {'to any table.'}</span> */}
                            </CardHeader>
                            <CardBody>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default ViewOffer;