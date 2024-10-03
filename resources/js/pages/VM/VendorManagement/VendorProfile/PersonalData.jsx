import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Input, InputGroup, InputGroupText, Collapse, Row, Label } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const PersonalData = () => {
  const [nameLabel, setNameLabel] = useState('Name');
  const [ContactLabel, setContactLabel] = useState('Contact name');
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
}
  const handleVendorTypeChange = (selectedOption) => {
    if (selectedOption.value === 'Agency') {
      setNameLabel('Agency Name');
      setContactLabel('Contact person')
    } else {
      setContactLabel('Contact name')
      setNameLabel('Name');
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
                    <H5>Personal Data</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
        <Collapse isOpen={isOpen}>

        <CardBody>
          <Row className="g-3 mb-3">
            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Vendor Type</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Type --' }} options={[
                { value: 'Freelance', label: 'Freelance' },
                { value: 'Agency', label: 'Agency' },
                { value: 'Contractor', label: 'Contractor' },
                { value: 'In House', label: 'In House' },
              ]} className="js-example-basic-single col-sm-12" onChange={handleVendorTypeChange} />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Status</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Status --' }} options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Wait for Approval', label: 'Wait for Approval' },
              ]} className="js-example-basic-single col-sm-12" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">{nameLabel}</Label>
              <Input className="form-control" type="text" placeholder={nameLabel} />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">{ContactLabel}</Label>
              <InputGroup>
                <select className="input-group-text" id="inputGroup">
                  <option disabled="disabled" selected="selected">Prefix</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mss">Mss</option>
                  <option value="Mrs">Mrs</option>
                </select>
                <Input className="form-control" type="text" placeholder={ContactLabel} />
              </InputGroup>
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Legal Name</Label>
              <Input className="form-control leg" type="text" placeholder="As Mentioned in ID and Passport" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">ُEmail</Label>
              <Input className="form-control" type="email" placeholder="email" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Phone Number</Label>
              <InputGroup>
                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" />
                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" />
              </InputGroup>
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Contact</Label>
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text "><i className="icofont icofont-plus" style={{ fontSize: "10px" }}></i></span>
                </div>
                <Select isDisabled
                  className="js-example-basic-single col-sm-11"
                  isMulti />
              </div>
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Region</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Region --' }} className="js-example-basic-single col-sm-12" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Country of region</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Country --' }} className="js-example-basic-single col-sm-12" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Nationality</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Nationality --' }} className="js-example-basic-single col-sm-12" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Nationality</Label>
              <div className="d-flex justify-content-between align-items-center">
                <div className="ratings" style={{ fontSize: "25px" }}>
                  <i className="fa fa-star rating-color"></i>
                  <i className="fa fa-star rating-color"></i>
                  <i className="fa fa-star rating-color"></i>
                  <i className="fa fa-star rating-color"></i>
                  <i className="fa fa-star"></i>
                </div>
              </div>
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Time Zone</Label>
              <Input className="form-control" type="text" placeholder="Time Zone" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">City/state</Label>
              <Input className="form-control" type="text" placeholder="" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Street</Label>
              <Input className="form-control" type="text" placeholder="" />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Address</Label>
              <CKEditor editor={ClassicEditor} />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Notes</Label>
              <CKEditor editor={ClassicEditor} />
            </Col>

            <Col md="4" className="mb-3">
              <Label className="form-label" for="validationCustom01">Rejection Reason</Label>
              <CKEditor editor={ClassicEditor} />
            </Col>
          </Row>

          {/* <Row className="g-3 mb-3">
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Vendor Type</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Type --' }} options={[
                { value: 'Freelance', label: 'Freelance' },
                { value: 'Agency', label: 'Agency' },
                { value: 'Contractor', label: 'Contractor' },
                { value: 'In House', label: 'In House' },
              ]} className="js-example-basic-single col-sm-12" onChange={handleVendorTypeChange} />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Status</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Status --' }} options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Wait for Approval', label: 'Wait for Approval' },
              ]} className="js-example-basic-single col-sm-12" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">{nameLabel}</Label>
              <Input className="form-control" type="text" placeholder={nameLabel} />

            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">{ContactLabel}</Label>
              <InputGroup>
                <select class="input-group-text" id="inputGroup">
                  <option disabled="disabled" selected="selected">Prefix</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mss">Mss</option>
                  <option value="Mrs">Mrs</option>
                </select>
                <Input className="form-control" type="text" placeholder={ContactLabel} />

              </InputGroup>

            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Legal Name</Label>
              <Input className="form-control leg" type="text" placeholder="As Mentioned in ID and Passport" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Email</Label>
              <Input className="form-control" type="email" placeholder="email" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Phone Number</Label>
              <InputGroup>
                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" />
                <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" />
              </InputGroup>
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Contact</Label>
              <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                  <span className="input-group-text "><i className="icofont icofont-plus" style={{ fontSize: "10px" }}></i></span>
                </div>
                <Select isDisabled
                  className="js-example-basic-single col-sm-11"
                  isMulti />
              </div>
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Region</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Region --' }} className="js-example-basic-single col-sm-12" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Country of region</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Country --' }} className="js-example-basic-single col-sm-12" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Nationality</Label>
              <Select defaultValue={{ isDisabled: true, label: '-- Select Nationality --' }} className="js-example-basic-single col-sm-12" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Nationality</Label>
              <div className="d-flex justify-content-between align-items-center">
                            <div className="ratings" style={{fontSize:"25px"}}>
                                <i class="fa fa-star rating-color"></i>
                                <i class="fa fa-star rating-color"></i>
                                <i class="fa fa-star rating-color"></i>
                                <i class="fa fa-star rating-color"></i>
                                <i class="fa fa-star"></i>
                            </div>
                        </div>
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Time Zone</Label>
              <Input className="form-control"  type="text" placeholder="Time Zone" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">City/state</Label>
              <Input className="form-control"  type="text" placeholder="" />
            </Col>
            <Col md="6">
              <Label className="form-label" for="validationCustom01">Street</Label>
              <Input className="form-control"  type="text" placeholder="" />
            </Col>
            <Col md="6">
            <Label className="form-label" for="validationCustom01">Address</Label>
            <CKEditor
                  editor={ClassicEditor}
                />
            </Col>
            <Col md="6">
            <Label className="form-label" for="validationCustom01">Notes</Label>
            <CKEditor
                  editor={ClassicEditor}
                />
            </Col>
            <Col md="6">
            <Label className="form-label" for="validationCustom01">Rejection Reason</Label>
            <CKEditor
                  editor={ClassicEditor}
                />
            </Col>
          </Row> */}
        </CardBody>
        </Collapse>
      </Card>
    </Fragment>
  );
};

export default PersonalData;