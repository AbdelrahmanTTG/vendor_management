import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
const Feedback = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                    <H5>Feedback</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">

                            <Col md="12" className="mb-3 d-flex flex-column align-items-end">
                                <Btn>Retrieve Data</Btn>
                            </Col>

                        </Row>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'PM'}</th>
                                    <th scope="col">{'Job'} </th>
                                    <th scope="col">{'Task'} </th>
                                    <th scope="col">{'Evaluation Rank'}</th>
                                    <th scope="col">{'Evaluation Check List'}</th>
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

export default Feedback;