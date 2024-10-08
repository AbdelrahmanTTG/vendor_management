import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, FormGroup } from 'reactstrap';
import { H5 } from '../../../../AbstractElements';
import Select from 'react-select';

const Education = () => {
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
                    <H5>Education</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">University name</Label>
                                    <Col sm="9">
                                        <Input className="form-control" type="text" placeholder="University name" />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="6" className="mb-3">
                                <FormGroup className="row">

                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Latest Degree</Label>
                                    <Col sm="9">

                                        <Select defaultValue={{ isDisabled: true, label: '-- Select Latest Degree --' }} options={[
                                            { value: 'Associate degree', label: 'Associate degree' },
                                            { value: "Bachelor's degree", label: "Bachelor's degree" },
                                            { value: "Master's degree", label: "Master's degree" },
                                            { value: "Doctoral degree", label: "Doctoral degree" },
                                        ]} className="js-example-basic-single col-sm-12" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Year of graduation</Label>
                                    <Col sm="9">

                                        <Input className="form-control" type="text" placeholder="" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">

                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Status</Label>
                                    <Col sm="9">

                                <Select defaultValue={{ isDisabled: true, label: '-- Select Major --' }} options={[
                                    { value: 'Information Technology', label: 'Information Technology' },
                                    { value: "Mechanical Engineering", label: "Mechanical Engineering" },
                                    { value: "Statistics", label: "Statistics" },
                                    { value: "Engineering", label: "Engineering" },
                                    { value: "Other", label: "Other" },
                                        ]} className="js-example-basic-single col-sm-12" />
                                        </Col>
                                    </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Education;