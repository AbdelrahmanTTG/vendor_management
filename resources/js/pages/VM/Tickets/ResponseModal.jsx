import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Close, SaveChanges } from '../../../Constant';
import { toast } from 'react-toastify';
import axiosClient from "../../../pages/AxiosClint";

const ResponseModal = (props) => {  
  const [commentInput, setCommentInput] = useState("");
  const [fileInput, setFileInput] = useState("");

  const Res = {
    'user': props.fromInuts.user,
    'id': props.fromInuts.ticket_id,
    'file': fileInput,
    'comment': commentInput,
  };

  const sendTicketResponse = () => {
    if (commentInput.length == 0) {
      toast.error("please Enter Comment .....");
    } else {
      axiosClient.post("sendTicketResponse", Res, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
        .then(({ data }) => {
          switch (data.type) {
            case 'success':
              toast.success(data.message);
              props.changeTicketData(true); 
              break;
            case 'error':
              toast.error(data.message);
              break;
          }
        });
    }
    props.sendDataToParent(false);   
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
              <Label>{'Comment :'}</Label>
              <Input type='textarea' className='form-control' rows='5' name="comment" onChange={e => setCommentInput(e.target.value)} />
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
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >{Close}</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: () => sendTicketResponse() }}>{SaveChanges}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default ResponseModal;
