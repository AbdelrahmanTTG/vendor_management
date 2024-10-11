import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../../pages/context/contextAuth';
import  JobsTable from './JobsTable';

const AllJobs = () => {
    const baseURL = window.location.origin +"/Portal/Vendor";
    const [pageTasks, setPageTasks] = useState([]);
    const [tableLinks, setTableLinks] = useState([]);
    const { user } = useStateContext();

    useEffect(() => {
        if (user) {
            const payload = {
                'id': user.id
            };
            axios.post(baseURL + "/allJobs", payload)
                .then(({ data }) => {
                    console.log(data);
                    // const [Tasks] = [(data?.Tasks.data)];
                    const [Tasks] = [(data?.Tasks)];
                    // const [Links] = [(data?.Tasks.links)];
                    setPageTasks(Tasks);
                    // setTableLinks(Links);
                });
        }
    }, [user]);


    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="All Jobs" parent="My Jobs" title="All Jobs" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader className=' b-l-primary'>
                                <H5>List Of All Jobs</H5>
                                {/* <span> {'Use a class'} <code> {'table'} </code> {'to any table.'}</span> */}
                            </CardHeader>
                            <CardBody>
                                <JobsTable pageTasks={pageTasks} tableLinks={tableLinks} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default AllJobs;