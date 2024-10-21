import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, Media, FormGroup } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';

const Test = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
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
                    <H5>Test</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Col sm="2">
                            <Media>
                                <Label className="col-form-label m-r-10">Tested ?</Label>
                                <Media body className="text-end icon-state switch-outline">
                                    <Label className="switch">
                                        <Input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                                        <span className="switch-state bg-primary"></span>
                                    </Label>
                                </Media>
                            </Media>
                        </Col>
                        {isChecked &&
                            <div>
                                <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                                    <Label className="col-form-label m-r-10">Test Status</Label>
                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label className="col-form-label m-0" style={{ lineHeight: '1.5' }}>
                                            Test Type :
                                        </Label>
                                        <div className="radio radio-primary me-3 ms-4">
                                            <Input id="radio11" type="radio" name="radio1" value="option1" defaultChecked />
                                            <Label for="radio11" style={{ margin: 0, lineHeight: '1.5' }}>
                                                <span className="digits">{"Client Test"}</span>
                                            </Label>
                                        </div>
                                        <div className="radio radio-danger ">
                                            <Input id="radio12" type="radio" name="radio1" value="option1" />
                                            <Label for="radio12" style={{ margin: 0, lineHeight: '1.5' }}>
                                                <span className="digits">{"On boarding test"}</span>
                                            </Label>
                                        </div>
                                    </Col>

                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label className="col-form-label m-0" style={{ lineHeight: '1.5' }}>
                                            Test result :
                                        </Label>
                                        <div className="radio radio-primary me-3 ms-3">
                                            <Input id="radio21" type="radio" name="radio2" value="option1" defaultChecked />
                                            <Label for="radio21" style={{ margin: 0, lineHeight: '1.5' }}>
                                                <span className="digits">{"Pass"}</span>
                                            </Label>
                                        </div>
                                        <div className="radio radio-danger ms-5">
                                            <Input id="radio22" type="radio" name="radio2" value="option1" />
                                            <Label for="radio22" style={{ margin: 0, lineHeight: '1.5' }}>
                                                <span className="digits">{"Fail"}</span>
                                            </Label>
                                        </div>
                                    </Col>
                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label className="col-form-label m-0" style={{ lineHeight: '1.5' }}>
                                            Test Upload :
                                        </Label>
                                        <div className="radio radio-primary me-3">
                                            <Input id="radio21" type="file" name="" />

                                        </div>

                                    </Col>




                                </div>
                                <div className="border border-default p-3 mb-3 test_details" style={{ borderStyle: "dashed!important" }}>
                                    <Label className="col-form-label m-r-10 mb-3 fw-bold">Test specification</Label>
                                    <Row>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label" for="validationCustom01">Source</Label>
                                                <Col sm="9">
                                                    <Select className="js-example-basic-single col-sm-12" />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">

                                                <Label className="col-sm-3 col-form-label" for="validationCustom01">Target</Label>
                                                <Col sm="9">


                                                    <Select  className="js-example-basic-single col-sm-12" />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">

                                                <Label className="col-sm-3 col-form-label" for="validationCustom01">Main-Subject Matter</Label>
                                                <Col sm="9">

                                                    <Select className="js-example-basic-single col-sm-12" />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">

                                                <Label className="col-sm-3 col-form-label" for="validationCustom01">Main-Subject Matter</Label>
                                                <Col sm="9">

                                                    <Select  className="js-example-basic-single col-sm-12" />
                                                </Col>
                                            </FormGroup></Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label" for="validationCustom01">Sub–Subject Matter</Label>
                                                <Col sm="9">
                                                <Select  className="js-example-basic-single col-sm-12" />
                                           </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        }

                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Test;