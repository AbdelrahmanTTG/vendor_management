import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader ,Form} from 'reactstrap';
import { Btn } from '../../AbstractElements';

const CommonModal = (props) => {
  return (
    <Form className="needs-validation" noValidate="" onSubmit={props.onSave}>
    <Modal isOpen={props.isOpen} toggle={props.toggler} size={props.size} backdrop="static"centered>
      <ModalHeader toggle={props.toggler}>
        {props.title}
      </ModalHeader>
      <ModalBody className={props.bodyClass}>
        {props.children}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >Close</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: props.onSave }}>Save Changes</Btn>
      </ModalFooter>
    </Modal>
    </Form>
  );
};

export default CommonModal;