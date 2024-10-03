import React, { Fragment, useContext, useState } from 'react';
import { Container, Row, Col, Card, CardHeader,CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, H6, LI, P, UL } from '../../../AbstractElements';

import TableContext from '../../../_helper/Table';

const AllJobs = () => {
    
    const data1  = [
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
     
  return (
    <Fragment>
       <BreadcrumbsPortal mainTitle="All Jobs" parent="My Jobs" title="All Jobs" />
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
                                <th scope="col">{'First Name'}</th>
                                <th scope="col">{'Last Name'}</th>
                                <th scope="col">{'Username'}</th>
                                <th scope="col">{'Role'}</th>
                                <th scope="col">{'Country'}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data1.map((item) =>
                                    <tr key={item.id}>
                                        <th scope="row">{item.id}</th>
                                        <td>{item.first_name}</td>
                                        <td>{item.last_name}</td>
                                        <td>{item.user_name}</td>
                                        <td>{item.role}</td>
                                        <td>{item.country}</td>
                                    </tr>
                                )
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

export default AllJobs;