import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, FormGroup, Input } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
const Portal_User = () => {
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
                    <H5>Vendor Portal User</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody className="d-flex flex-column align-items-center">
                        <Col md="9" className="mb-3">
                            <FormGroup className="row">
                                <Label className="col-sm-2 col-form-label" for="validationCustom01">Login User Name</Label>
                                <Col sm="6">
                                    <Input className="form-control" type="email" />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="9" className="mb-3">
                            <FormGroup className="row">
                                <Label className="col-sm-2 col-form-label" for="validationCustom02">Login Password</Label>
                                <Col sm="6">
                                    <Input className="form-control" type="password" />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="9" className="mb-3">
                            <FormGroup className="row d-flex">
                                <Col sm="2" className="col-form-label" />
                                <Col sm="6" className="d-flex">
                                    <Btn attrBtn={{ color: 'primary', style: { flex: 1, marginRight: '10px' } }}>Send Email</Btn>
                                    <Btn attrBtn={{ color: 'info', style: { flex: 1 } }}>Generate Password</Btn>
                                </Col>
                            </FormGroup>
                        </Col>



                    </CardBody>


                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Portal_User;