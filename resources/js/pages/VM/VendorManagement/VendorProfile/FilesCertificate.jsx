import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row } from 'reactstrap';
import { H5 } from '../../../../AbstractElements';

const VMnote = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [cvFileName, setCvFileName] = useState('No file chosen');
    const [ndaFileName, setNdaFileName] = useState('No file chosen');
  
    const handleFileChange = (event, setFileName) => {
      const file = event.target.files[0];
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('No file chosen');
      }
    };

    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Files & Certificate</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <div className="form-group row mb-4">
                             
                                <label className="col-lg-2 text-lg-right col-form-label" style={{ alignSelf: 'center' }}>CV</label>
                                <div className="col-lg-4 text-lg-center">
                                    <label id="label_CV">{cvFileName}</label>
                                    <button className="container-btn-file btn-secondary" >
                                        Upload CV
                                        <input
                                            id="CV_file"
                                            required
                                            className="file"
                                            accept=".pdf,.zip"
                                            name="cv"
                                            type="file"
                                            onChange={(e) => handleFileChange(e, setCvFileName)}
                                        />
                                    </button>
                                    <span className="form-text text-muted py-2">Note: if exceeds 5MB please zip it.</span>
                                </div>

                              
                                <label className="col-lg-2 text-lg-right col-form-label" style={{ alignSelf: 'center' }}>NDA</label>
                                <div className="col-lg-4 text-lg-center">
                                    <label id="label_NDA">{ndaFileName}</label>
                                    <button className="container-btn-file btn-success">
                                        Upload NDA
                                        <input
                                            id="NDA_file"
                                            required
                                            className="file"
                                            name="nda"
                                            type="file"
                                            onChange={(e) => handleFileChange(e, setNdaFileName)}
                                        />
                                    </button>
                                    <span className="form-text text-muted py-2">Note: if exceeds 5MB please zip it.</span>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default VMnote;