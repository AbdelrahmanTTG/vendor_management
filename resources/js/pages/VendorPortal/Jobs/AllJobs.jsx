import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL } from '../../../AbstractElements';
import axios from 'axios';
import TableContext from '../../../_helper/Table';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Link } from 'react-router-dom';

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
                                                <th scope="col">{'Code'}</th>
                                                <th scope="col">{'Subject'}</th>
                                                <th scope="col">{'Task Type'}</th>
                                                <th scope="col">{'Rate'}</th>
                                                <th scope="col">{'Unit'}</th>
                                                <th scope="col">{'Total Cost'}</th>
                                                <th scope="col">{'Currency'}</th>
                                                <th scope="col">{'Start Date'}</th>
                                                <th scope="col">{'Delivery Date'}</th>
                                                <th scope="col">{'Status'}</th>
                                                <th scope="col">{'Actions'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageTasks.map((item) => (
                                                <tr key={item.id}>
                                                    <th scope="row">{item.id}</th>
                                                    <td>{item.code}</td>
                                                    <td>{item.subject}</td>
                                                    <td>{item.task_type.name}</td>
                                                    <td>{item.rate}</td>
                                                    <td>{item.count}</td>
                                                    <td>{item.total_cost}</td>
                                                    <td>{item.currency.name}</td>
                                                    <td>{item.start_date}</td>
                                                    <td>{item.delivery_date}</td>
                                                    <td>{item.status}</td>
                                                    <td>
                                                        <Btn attrBtn={{ className: "btn btn-primary-light", color: "default" }}>
                                                            <Link to={`/Vendor`}>
                                                                {'View'}
                                                            </Link>
                                                        </Btn>
                                                    </td>
                                                </tr>
                                            ))
                                            }
                                        </tbody>
                                    </Table>

                                    <div className="p-5 m-5">
                                        {tableLinks.map(link => (
                                            link.url ? (
                                                <Link key={link.label}
                                                    className={`p-1 mx-1 ${link.active ? " text-blue-500 font-bold" : ""}`}
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />


                                            ) : (
                                                <span key={link.label}
                                                    className='p-1 mx-1 text-slate-500'
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )
                                        ))}

                                    </div>
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