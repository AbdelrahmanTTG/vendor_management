import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import TableContext from '../../../_helper/Table';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import  JobsTable from './JobsTable';

const AllJobs = () => {
    const baseURL = window.location.origin;
    const [pageTasks, setPageTasks] = useState([]);
    const [tableLinks, setTableLinks] = useState([]);
    const { user } = useStateContext();

    useEffect(() => {
        if (user) {
            const payload = {
                'id': user.id
            };
            axios.post(baseURL + "/Portal/Vendor/allJobs", payload)
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

    // console.log(pageTasks);
    //  console.log(tableLinks);

    const data1 = [
        {
            "id": 1,
            "first_name": "Alexander",
            "last_name": "Orton",
            "user_name": "@mdorton",
            "role": "Admin",
            "country": "USA"
        },
        {
            "id": 2,
            "first_name": "John Deo",
            "last_name": "Deo",
            "user_name": "@johndeo",
            "role": "User",
            "country": "USA"
        },
        {
            "id": 3,
            "first_name": "Randy Orton",
            "last_name": "the Bird",
            "user_name": "@twitter",
            "role": "admin",
            "country": "UK"
        },
        {
            "id": 4,
            "first_name": "Randy Mark",
            "last_name": "Ottandy",
            "user_name": "@mdothe",
            "role": "user",
            "country": "AUS"
        },
        {
            "id": 5,
            "first_name": "Ram Jacob",
            "last_name": "Thornton",
            "user_name": "@twitter",
            "role": "admin",
            "country": "IND"
        }
    ];
    //console.log(data1);
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