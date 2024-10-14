import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Close, SaveChanges } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlanModal = (props) => {
  const baseURL = window.location.origin + "/Portal/Vendor/";
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");
  const [statusInput, setStatusInput] = useState("8");

  const vendorRes = {
    'vendor': props.fromInuts.vendor,
    'task_id': props.fromInuts.id,
    'status': statusInput,
    'note': noteInput,
  };

  const planTaskReply = () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    axios.post(baseURL + "planTaskReply", vendorRes)
      .then(({ data }) => {
        switch (data.type) {
          case 'success':
            toast.success(data.message);
            break;
          case 'error':
            toast.error(data.message);
            break;
        }
        navigate("/Vendor/Jobs");
      });
  };

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggler} size={props.size} centered>
      <ModalHeader toggle={props.toggler}>
        {props.title}
      </ModalHeader>
      <ModalBody className={props.bodyClass}>
        <Row>
          <Col>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label">{'Select Reply'}</Label>
              <Col sm="9">
                <Input type="select" name="status" className="custom-select form-control" onChange={e => setStatusInput(e.target.value)}>
                  <option value="8">{'Available'}</option>
                  <option value="9">{'Not Available'}</option>
                </Input>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup className='mb-0'>
              <Label>{'Notes :'}</Label>
              <Input type='textarea' className='form-control' rows='5' name="note" onChange={e => setNoteInput(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>
        {props.children}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >{Close}</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: () => planTaskReply() }}>{SaveChanges}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default PlanModal;
