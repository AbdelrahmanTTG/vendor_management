import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import JobsTable from './JobsTable';

const AllJobs = () => {
    const baseURL = "/Portal/Vendor";
    const [pageTasks, setPageTasks] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useStateContext();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            const payload = {
                'id': user.id,
                'page': currentPage,
            };
            axiosClient.post(baseURL + "/allJobs", payload)
                .then(({ data }) => {                                   
                    const [Tasks] = [(data?.Tasks)];
                    const [Links] = [(data?.Links)];
                    setPageTasks(Tasks);
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
            <BreadcrumbsPortal mainTitle="All Jobs" parent="My Jobs" title="All Jobs" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            {/* <CardHeader className=' b-l-primary'> */}
                            {/* <H5>List Of All Jobs</H5> */}
                            {/* <span> {'Use a class'} <code> {'table'} </code> {'to any table.'}</span> */}
                            {/* </CardHeader> */}
                            <CardBody className='b-l-primary'>
                            {loading ? (
                                <div className="loader-box" >
                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                            ) :
                                <JobsTable pageTasks={pageTasks} pageLinks={pageLinks} currentPage={currentPage} sendDataToParent={handleDataFromChild} />
                            }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default AllJobs;