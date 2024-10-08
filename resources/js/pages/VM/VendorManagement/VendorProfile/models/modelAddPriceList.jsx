import React, { Fragment, useState } from 'react';
import { Btn } from '../../../../../AbstractElements';
import CommonModal from '../../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const AddNewBtn = () => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        if (data !== '') {
            alert('You submitted the form and stuff!');
        } else {
            errors.showMessages();
        }
    };
    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-light', onClick: toggle }} className="me-2" >Add price list</Btn>
            <CommonModal isOpen={modal} title='Add new price list' toggler={toggle} size="xl" marginTop="-1%" onSave={handleSubmit(onSubmit)} >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Main-Subject Matter</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Main-Subject --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Sub–Subject Matter</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Sub–Subject --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Service</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Service --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Task Type</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Task Type --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Source Language</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Source Language --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Target Language</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Target Language --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Dialect</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Dialect --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Unit</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Unit --' }} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Rate</Label>
                            <Col sm="8">
                                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Rush Rate</Label>
                            <Col sm="8">
                                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Status</Label>
                            <Col sm="8">
                                <Select defaultValue={{ isDisabled: true, label: '-- Select Status --' }}
                                    options={[
                                        { value: 'Active', label: 'Active' },
                                        { value: 'Not Active', label: 'Not Active' },
                                        { value: 'Pending by PM', label: 'Pending by PM' }
                                    ]} className="js-example-basic-single col-sm-12" />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                {/* <Row className="g-0">
                    <Col  >
                        <Label htmlFor="validationDefault01">Language</Label>
                        <input className="form-control" id="validationCustom01" type="text" placeholder="Language" name="Language" {...register('Language', { required: true })} />
                        <span style={{ color: '#dc3545', fontStyle: 'italic' }}>{errors.Language && 'Language name is required'}</span>
                    </Col>
                </Row> */}

            </CommonModal>
        </Fragment>
    );
};

export default AddNewBtn;