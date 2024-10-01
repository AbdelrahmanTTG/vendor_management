import React, { Fragment, useState } from 'react';
import { Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, InputGroup, InputGroupText, Row, Collapse } from 'reactstrap';
// import { CustomStyles, Username } from '../../../../Constant';
import { useForm } from 'react-hook-form';
import { Btn, H5 } from '../../../AbstractElements';
import Select from 'react-select';
import DatePicker from "react-datepicker";
const CustomerInput = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const onSubmit = data => {
        if (data !== '') {
            alert('You submitted the form and stuff!');
        } else {
            errors.showMessages();
        }
    };
    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '20px' }}
                >
                    <H5>Search Customer</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Form className="needs-validation" noValidate="" onSubmit={handleSubmit(onSubmit)}>
                            <Row className="g-3 mb-3">
                                <Col md="4">
                                    <Label className="form-label" for="validationCustom01">Customer Name</Label>
                                    <Input className="form-control" type="text" placeholder="" />
                                </Col>
                                <Col md="4">
                                    <Label className="form-label" for="validationCustom02">Website</Label>
                                    <Input className="form-control" type="text" placeholder="" />
                                </Col>
                                <Col md="4">
                                    <Label className="form-label" for="validationCustom03">Customer Alias</Label>
                                    <Input className="form-control" type="text" placeholder="" />

                                </Col>
                            </Row>

                            <Row className="g-3 mb-3">
                                <Col md='4'>
                                    <Label className="form-label" for="validationCustom04">Status</Label>
                                    <Select className="js-example-basic-single col-sm-12" />
                                </Col>
                                <Col md='4'>
                                    <Label className="form-label" for="validationCustom05">Created By</Label>
                                    <Select className="js-example-basic-single col-sm-12" />
                                </Col>
                                <Col md="4">
                                    <Label className="form-label" for="validationCustom06">Client Type</Label>
                                    <Select className="js-example-basic-single col-sm-12" />
                               </Col>
                            </Row>
                            <Row className="g-3 mb-3 d-flex justify-content-start">
                                <Col md="auto">
                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien' }} className="me-2 ">{'search'}</Btn>
                                </Col>
                                <Col md="auto">
                                    <Btn attrBtn={{ color: 'btn btn-warning-gradien' }} className="me-2">{'Clear Filter'}</Btn>
                                </Col>
                                <Col md="auto">
                                    <Btn attrBtn={{ color: 'btn btn-info-gradien' }}>{'Export To Excel'}</Btn>
                                </Col>
                            </Row>

                        </Form>
                    </CardBody>

                </Collapse>

            </Card>
        </Fragment>
    );

};

export default CustomerInput;