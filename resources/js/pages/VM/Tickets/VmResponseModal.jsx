import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Close, SaveChanges } from '../../../Constant';
import { toast } from 'react-toastify';
import axiosClient from "../../AxiosClint";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const VmResponseModal = (props) => {
  const [commentInput, setCommentInput] = useState("");


  const Res = {
    'user': props.fromInuts.user,
    'id': props.fromInuts.ticket_id,
    'comment': commentInput,
  };

  const sendTicketResponse = () => {
    if (commentInput.length == 0) {
      toast.error("please Enter Comment .....");
    } else {
      axiosClient.post("sendTicketVmResponse", Res)
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
              <CKEditor name="comment"
                editor={ClassicEditor}
                onChange={(e, editor) => {
                  const data = editor.getData();
                  setCommentInput(data);
                }}
              />
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

export default VmResponseModal;
