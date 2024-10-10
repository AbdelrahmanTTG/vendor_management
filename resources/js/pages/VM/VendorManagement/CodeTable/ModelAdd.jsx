import React, { Fragment, useState } from 'react';
import { Btn } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const AddNewBtn = (props) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };
    const onSubmit = data => {
        if (data !== '') {
            alert('You submitted the form and stuff!');
        } else {
            errors.showMessages();
        }
    };
    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: toggle }} className="me-2" >{props.nameBtm}</Btn>
            <CommonModal isOpen={modal} title={props.titelModel} toggler={toggle}  onSave={handleSubmit(onSubmit)} >
                <Row className="g-0">
                    <Col  >
                        {props.fields ? (
                            props.fields.map((fieldObj, index) => (
                                <div key={index}>
                                    <FormGroup className="row">
                                        <Label className="col-sm-3 col-form-label" htmlFor={fieldObj.name}>
                                            {capitalizeWords(fieldObj.name)}
                                        </Label>
                                        <Col sm="9">
                                            {fieldObj.field === "selec" &&(
                                                <Select defaultValue={{ isDisabled: true, label: `-- Select ${fieldObj.name} --` }} className="js-example-basic-single col-sm-12" />
                                            )}
                                            {fieldObj.field === "input" &&(
                                                <input
                                                    className="form-control"
                                                    id={fieldObj.name}
                                                    type={fieldObj.type}
                                                    name={fieldObj.name}
                                                    {...register(fieldObj.name, { required: true })}
                                                />
                                            )}
                                           
                                        </Col>
                                        {errors[fieldObj.name] && (
                                            <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                                                {fieldObj.name} is required
                                            </span>
                                        )}
                                    </FormGroup>
                                </div>
                            ))
                        ) : null}


                        {/* <Label htmlFor="validationDefault01">Language</Label>
                        <input className="form-control" id="validationCustom01" type="text" placeholder="Language" name="Language" {...register('Language', { required: true })} />
                        <span style={{ color: '#dc3545', fontStyle: 'italic' }}>{errors.Language && 'Language name is required'}</span>
                        <div className="valid-feedback">Looks good!</div> */}
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    );
};

export default AddNewBtn;