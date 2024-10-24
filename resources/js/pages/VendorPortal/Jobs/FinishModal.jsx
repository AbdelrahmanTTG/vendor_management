import React, { useState } from 'react';
import { Card, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import { Btn, P } from '../../../AbstractElements';
import { Close, SaveChanges } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const FinishModal = (props) => {
  const baseURL = window.location.origin + "/Portal/Vendor/";
  const navigate = useNavigate();
  const [noteInput, setNoteInput] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [evSelectInput, setEvSelectInput] = useState("5");
  const [evNoteInput, setEvNoteInput] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const vendorRes = {
    'vendor': props.fromInuts.vendor,
    'task_id': props.fromInuts.id,
    'file': fileInput,
    'note': noteInput,
    'ev_select': evSelectInput,
    'ev_note': evNoteInput,
    'ev_checkBox': selectedCheckboxes,
  };
  const handleEvOnChange = (id) => {
    const checkBoxArray = selectedCheckboxes;
    // Find index
    const findIdx = checkBoxArray.indexOf(id);
    // Index > -1 means that the item exists and that the checkbox is checked
    // and in that case we want to remove it from the array and uncheck it
    if (findIdx > -1) {
        checkBoxArray.splice(findIdx, 1);
    } else {
        checkBoxArray.push(id);
    }
    setSelectedCheckboxes(checkBoxArray);   
    console.log(checkBoxArray) ;
};

  const finishJob = () => {
    axios.post(baseURL + "finishJob", vendorRes, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    <Modal isOpen={props.isOpen} toggle={props.toggler} size='lg' centered>
      <ModalHeader toggle={props.toggler}>
        {props.title}
      </ModalHeader>
      <ModalBody className={props.bodyClass}>
        <Row>
          <Col>
            <FormGroup className='mb-0 row'>
              <Label className="col-sm-3 col-form-label">{'Notes :'}</Label>
              <Col sm="9">
                <Input type='textarea' className='form-control' rows='5' name="note" onChange={e => setNoteInput(e.target.value)} />
              </Col>
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
        {props.vmConfig.enable_evaluation == 1 &&
          <Card className='b-t-primary p-3 mt-2'>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label">{'Rate P.M.'}</Label>
              <Col sm="6">
                <div className="input-group">
                  <Input className="form-control col-sm-6" type="range" min="0" max="10" name="v_ev_select" defaultValue={evSelectInput} onChange={e => setEvSelectInput(e.target.value)} />
                  <span className="mx-3 txt-primary">{evSelectInput}</span>
                </div>
              </Col>
            </FormGroup>
            <FormGroup className='mb-0 row'>
              <Label className="col-sm-3 col-form-label">{'Notes :'}</Label>
              <Col sm="9">
                <Input type='textarea' className='form-control' rows='3' name="v_note" onChange={e => setEvNoteInput(e.target.value)} />
              </Col>
            </FormGroup>
            {evSelectInput < 5 &&
              <div className="table-responsive">
                <Table>
                  <thead className="bg-primary">
                    <tr>
                      <th scope="col">{'#'}</th>
                      <th scope="col">{'Items to be checked'}</th>

                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(props.vmConfig).map((item, i) => (
                      (i !== 0 && item != null &&
                        <tr key={i}>
                          <td><input type='checkbox' value={'1'} name={`v_ev_val${i}`} onChange={() => handleEvOnChange(`v_ev_val${i}`)} /></td>
                          <td><P>{item} </P></td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
              </div>
            }
          </Card>
        }
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: 'secondary', onClick: props.toggler }} >{Close}</Btn>
        <Btn attrBtn={{ color: 'primary', onClick: () => finishJob() }}>{SaveChanges}</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default FinishModal;
