import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
const Vacation = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }

    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Vacation</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">

                            <Col md="12" className="mb-3 d-flex flex-column align-items-end">
                                <Btn>Retrieve</Btn>
                            </Col>

                        </Row>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'Start Date'} </th>
                                    <th scope="col">{"End Date"} </th>
                                    <th scope="col">{'Description'} </th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Vacation;