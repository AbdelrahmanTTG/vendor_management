import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Close } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../../AxiosClint';

const RejectModal = (props) => {
  const baseURL = "/Portal/Vendor/";
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");

  const payload = {
    'user': props.fromInuts.user,
    'id': props.fromInuts.id,
    'note': noteInput,
  };


  const sendReject = () => {
    axiosClient.post(baseURL + "rejectAvailability", payload)
      .then(({ data }) => {
        switch (data.type) {
          case 'success':
            toast.success(data.message);
            break;
          case 'error':
            toast.error(data.message);
            break;
        }       
        navigate("/Vendor/Availability", { replace: true });
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
              <Label>{'Enter the reason for rejection :'}</Label>
              <Input type='textarea' className='form-control' rows='5' name="note" onChange={e => setNoteInput(e.target.value)} />
            </FormGroup>
          </Col>
        </Row>
        {props.children}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >{Close}</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: () => sendReject() }}>{'Send Rejection'}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default RejectModal;
