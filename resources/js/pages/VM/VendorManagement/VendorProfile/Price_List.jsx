import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input , Table } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';

const PriceList = () => {
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
                    <H5>Vendor Price List</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="10" className="mb-3">
                                <Label className="form-label" for="validationCustom01">Tools</Label>
                                <Input className="form-control" type="text" placeholder="" />

                            </Col>
                            <Col md="2" className="mb-3 d-flex flex-column justify-content-end align-items-center">
                                <Btn>Save</Btn>
                            </Col>

                            <Col md="6" className="mb-3">
                                <Label className="form-label" for="validationCustom01">Currency</Label>
                                <Select isDisabled className="js-example-basic-single col-sm-12" />
                            </Col>
                        </Row>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th cope="col">{"Main-Subject Matter"}</th>
                                    <th cope="col">{'Sub–Subject Matter'}</th>
                                    <th cope="col">{"Service"}</th>
                                    <th cope="col">{'Task Type'}</th>
                                    <th cope="col">{'Source-Target Language'} </th>
                                    <th cope="col">{"Unit"}</th>
                                    <th cope="col">{'Rate'}</th>
                                    <th cope="col">{'Currency'}</th>
                                    <th cope="col">{'Status'} </th>
                                    <th cope="col">{'Actions'}</th>
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

export default PriceList;