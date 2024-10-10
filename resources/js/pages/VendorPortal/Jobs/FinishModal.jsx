import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Close, SaveChanges } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const FinishModal = (props) => {
  const baseURL = window.location.origin + "/Portal/Vendor/";
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");
  const [fileInput, setFileInput] = useState("");

  const vendorRes = {
    'vendor': props.fromInuts.vendor,
    'task_id': props.fromInuts.id,
    'file': fileInput,
    'note': noteInput,
  };
  const finishJob = () => {

    axios.post(baseURL + "finishJob", vendorRes, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-rapidapi-host": "file-upload8.p.rapidapi.com",
        "x-rapidapi-key": "your-rapidapi-key-here",
      },
    })
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
            <FormGroup className='mb-0'>
              <Label>{'Notes :'}</Label>
              <Input type='textarea' className='form-control' rows='5' name="note" onChange={e => setNoteInput(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label">{'UploadFile'}</Label>
              <Col sm="9">
                <Input className="form-control" accept="zip, .rar" type="file" onChange={e => setFileInput(e.target.files[0])} />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        {props.children}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >{Close}</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: () => finishJob() }}>{SaveChanges}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default FinishModal;
