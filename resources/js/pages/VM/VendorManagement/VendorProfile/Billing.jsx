import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, FormGroup } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const Billing = ({ id }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isChecked, setIsChecked] = useState({ Legal_Name: '', City_state: '', Street: '' });
    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            setIsChecked(
                {
                    Legal_Name: document.getElementById('Legal_Name').value,
                    City_state: document.getElementById('City_state').value,
                    Street: document.getElementById('Street').value,
                    Address: document.getElementById('Address').value,
                }
            )
        } else {
            setIsChecked({
                Legal_Name: '',
                City_state: "",
                Street: '',
                Address: '',
            })

        }


    };
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [rows, setRows] = useState([]);
    const options = [
    ];
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            type: null,
            inputValue: '',
        };
        setRows([...rows, newRow]);
    };

    const handleSelectChange = (selectedOption, rowId) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                return { ...row, type: selectedOption };
            }
            return row;
        });
        setRows(updatedRows);
    };
    const handleInputChange = (event, rowId) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                return { ...row, inputValue: event.target.value };
            }
            return row;
        });
        setRows(updatedRows);
    };
    const deleteRow = (rowId) => {
        alert("Are you sure you want to delete the ?")
        const updatedRows = rows.filter(row => row.id !== rowId);
        setRows(updatedRows);
    };
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
                                <Input className="radio_animated " id="edo-ani" type="checkbox" onChange={handleCheckboxChange} name="rdo-ani" />
                            </Col>
                            <Row>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Legal Name</Label>
                                        <Col sm="9">
                                            <Input className="form-control" defaultValue={isChecked.Legal_Name} type="text" placeholder="Legal Name" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Currency</Label>
                                        <Col sm="9">

                                            <Select className="js-example-basic-single col-sm-12" />

                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">City / state</Label>
                                        <Col sm="9">

                                            <Input className="form-control" defaultValue={isChecked.City_state} type="text" />
                                        </Col> </FormGroup> </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Street</Label>
                                        <Col sm="9">

                                            <Input className="form-control" defaultValue={isChecked.Street} type="text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Address</Label>
                                        <Col sm="9">

                                            <CKEditor editor={ClassicEditor}
                                                data={isChecked.Address}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>

                        </div>
                        <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                            <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">Bank details</Label>
                            <Row>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">
                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Bank name</Label>
                                        <Col sm="9">

                                            <Input className="form-control" type="text" />

                                        </Col></FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Account holder</Label>
                                        <Col sm="9">

                                            <Input className="form-control" type="text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">SWIFT / BIC</Label>
                                        <Col sm="9">

                                            <Input className="form-control" type="text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">IBAN</Label>
                                        <Col sm="9">

                                            <Input className="form-control" type="text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">
                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Payment terms</Label>
                                        <Col sm="9">

                                            <Input className="form-control" type="text" />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md="6" className="mb-3">
                                    <FormGroup className="row">

                                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Bank Address</Label>
                                        <Col sm="9">
                                            <CKEditor editor={ClassicEditor} />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                        <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                            <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">Wallets Payment methods</Label>
                            <Table hover>

                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'Method'}</th>
                                    <th scope="col">Account</th>
                                    <th style={{ width: "10%" }} scope="col" onClick={addRow}>
                                        <Btn attrBtn={{ color: 'btn btn-light' }} >
                                            <i className="fa fa-plus-circle"></i>
                                        </Btn>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>
                                            <Select
                                                options={options}
                                                className="js-example-basic-single col-sm-12"
                                                onChange={(selectedOption) => handleSelectChange(selectedOption, row.id)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.inputValue}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="form-control"
                                            />
                                        </td>
                                        <td onClick={() => deleteRow(row.id)}>
                                            <Btn attrBtn={{ color: 'btn btn-danger' }}>
                                                <i className="fa fa-trash"></i>
                                            </Btn>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                </Table>
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Billing;