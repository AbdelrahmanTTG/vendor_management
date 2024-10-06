import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const Billing = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isChecked, setIsChecked] = useState({Legal_Name: '', City_state:'' , Street:''});

    const handleCheckboxChange = (event) => {
        if(event.target.checked){
            setIsChecked(
                {
                    Legal_Name:document.getElementById('Legal_Name').value,
                    City_state:document.getElementById('City_state').value,
                    Street:document.getElementById('Street').value,
                }
            )
        }else{
            setIsChecked({
                Legal_Name:'',
                City_state:"",
                Street:'',
             
            })
        
        }
       
        
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
                    <H5>Billing Data</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                            <Col className="d-flex align-items-center mb-3">
                                <Label className="col-form-label m-0" style={{ lineHeight: '1.5', paddingRight: '10px' }}>
                                    Use Same Vendo Data :
                                </Label>
                                <Input className="radio_animated " id="edo-ani" type="checkbox"  onChange={handleCheckboxChange} name="rdo-ani" />
                            </Col>
                            <Row>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Billing Legal Name</Label>
                                    <Input className="form-control" value={isChecked.Legal_Name} type="text" placeholder="Legal Name" />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Billing Currency</Label>
                                    <Select defaultValue={{ isDisabled: true, label: '-- Select Currency --' }} className="js-example-basic-single col-sm-12" />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">City / state</Label>
                                    <Input className="form-control" value={isChecked.City_state} type="text" placeholder="" />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Street</Label>
                                    <Input className="form-control" value={isChecked.Street} type="text" placeholder="" />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Billing Address</Label>
                                    <CKEditor editor={ClassicEditor} />
                                </Col>
                            </Row>

                        </div>
                        <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                        <Label className="col-form-label m-r-10 mb-3 fw-bold">Bank details</Label>
                            <Row>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Bank name</Label>
                                    <Input className="form-control" type="text" placeholder />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Account holder</Label>
                                    <Input className="form-control" type="text" placeholder />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">SWIFT / BIC</Label>
                                    <Input className="form-control" type="text" placeholder />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">IBAN</Label>
                                    <Input className="form-control" type="text" placeholder />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Payment terms</Label>
                                    <Input className="form-control" type="text" placeholder />
                                </Col>
                                <Col md="4" className="mb-3">
                                    <Label className="form-label" for="validationCustom01">Bank Address</Label>
                                    <CKEditor editor={ClassicEditor} />
                                </Col>
                            </Row>

                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Billing;