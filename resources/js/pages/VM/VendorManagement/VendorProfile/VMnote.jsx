import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col,  Collapse, Label, Row } from 'reactstrap';
import {  H5 } from '../../../../AbstractElements';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const VMnote = () => {
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
                    <H5>VM Notes</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="11" className="mb-3">
                                <Label className="form-label" for="validationCustom01">VM/Vendor</Label>
                                <CKEditor editor={ClassicEditor} className="flex-grow-1" />
                            </Col>
                            <Col md="1" className="mb-3 d-flex align-items-center justify-content-center">
                                <button className="btn btn-primary" style={{ width: '100%' }}><i className="fa fa-send"></i></button>                            </Col>
                            <Col md="12" className="mb-3">
                                <Label className="form-label" for="validationCustom01">VM/PM</Label>
                                <CKEditor editor={ClassicEditor} />
                            </Col>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default VMnote;