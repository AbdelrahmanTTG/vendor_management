import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, FormGroup } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const Experience = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(null);
    const [yearOptions, setYearOptions] = useState([]);
    const [experienceYears, setExperienceYears] = useState('');
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const generatedYears = [];
        for (let year = currentYear; year >= 1900; year--) {
            generatedYears.push({ value: year, label: year });
        }
        setYearOptions(generatedYears);
    }, [currentYear]);

    const handleYearChange = (selectedOption) => {
        if (selectedOption) {
            const selected = selectedOption.value;
            setSelectedYear(selected);
            const yearsOfExperience = currentYear - selected;
            setExperienceYears(yearsOfExperience);
        }
    };
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            skill: null,
        };
        setRows([...rows, newRow]);
    };

    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Experience</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">

                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Started working from year</Label>
                                    <Col sm="9">

                                        <Select
                                            defaultValue={{ isDisabled: true, label: '-- Select year Started working --' }}
                                            options={yearOptions}
                                            className="js-example-basic-single col-sm-12"
                                            onChange={handleYearChange}
                                            value={yearOptions.find(option => option.value === selectedYear)}
                                        />
                                    </Col>
                                </FormGroup>

                            </Col>
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">

                                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Experience year</Label>
                                    <Col sm="9">

                                        <Input disabled value={experienceYears} className="form-control" type="text" placeholder="Experience year" />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="12" className="mb-3">
                                <FormGroup className="row">

                                <Label className="col-sm-2 col-form-label" for="validationCustom01">Summary of Experience</Label>
                                    <Col sm="10">
                                        <CKEditor editor={ClassicEditor} />
                                        </Col>
                                    </FormGroup>
                            </Col>
                        </Row>
                        <Label className="form-label" for="validationCustom01">Skill</Label>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'Skill'}</th>
                                    <th scope="col"></th>
                                    <th
                                        style={{ width: "10%" }} scope="col" onClick={addRow}>
                                        <Btn attrBtn={{ color: 'btn btn-light' }} >
                                            <i className="fa fa-plus-circle"></i>
                                        </Btn>
                                    </th>
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

export default Experience;