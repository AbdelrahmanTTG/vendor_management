import React, { Fragment, useState } from 'react';
import { Btn } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Col, Label, Input, Row } from 'reactstrap'
import { useForm } from 'react-hook-form';

const AddNewBtn = () => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        if (data !== '') {
            alert('You submitted the form and stuff!');
        } else {
            errors.showMessages();
        }
    };
    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: toggle }} className="me-2" >Add New Language</Btn>

            <CommonModal isOpen={modal} title='Add New Language' toggler={toggle} onSave={handleSubmit(onSubmit)} >
                <Row className="g-0">
                    <Col  >
                        <Label htmlFor="validationDefault01">Language</Label>
                        <input className="form-control" id="validationCustom01" type="text" placeholder="Language" name="Language" {...register('Language', { required: true })} />
                        <span style={{ color: '#dc3545', fontStyle: 'italic' }}>{errors.Language && 'Language name is required'}</span>
                        <div className="valid-feedback">Looks good!</div>
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    );
};

export default AddNewBtn;