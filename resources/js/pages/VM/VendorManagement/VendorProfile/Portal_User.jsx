import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, FormGroup, Form } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosClient from "../../../../pages/AxiosClint";

const Portal_User = (props) => {
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: "top-right"                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: "top-right"                });
                break;
            default:
                break;
        }
    };
    const [isOpen, setIsOpen] = useState(true);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [value, setValueemail] = useState(props.email);
    const [inputType, setInputType] = useState('text'); 
    const [value2, setValue2] = useState(''); 

    const toggleCollapse = () => {
        setIsOpen(!isOpen);

    }
    const Generate = () => {
        const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
        const allCharacters = uppercaseLetters + lowercaseLetters + numbers + symbols;
        let password = "";
        password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
        password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        for (let i = password.length; i < 8; i++) {
            password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
        }
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        setValue('password', password)
    }

 
    const onSubmit = async (data) => {
        if (props?.mode == "edit" && !props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        if (!props.email) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            const formData = { ...data };
            formData["email"] = props.email
            try {
                const response = await axiosClient.post("GeneratePassword", formData);
                basictoaster("successToast", "Password created successfully !");
            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    const errors = response.data;
                    Object.keys(errors).forEach(key => {
                        const messages = errors[key];
                        if (messages.length > 0) {
                            messages.forEach(message => {
                                basictoaster("dangerToast", message);
                            });
                        }
                    });
                }
            }
        }
    };
 
    useEffect(() => {
        setValueemail(props.email)
    }, [props.email])
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "password":
                    basictoaster("dangerToast", "password is required");
                    return;
                default:
                    break;
            }
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
                    <H5>Vendor Portal User</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody className="d-flex flex-column align-items-center">

                        <Col md="9" className="mb-3">
                            <FormGroup className="row">
                                <Label className="col-sm-2 col-form-label" for="validationCustom01">Login User Name</Label>
                                <Col sm="6">
                                    <input
                                        readOnly
                                        defaultValue={value || "" || props?.email}
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        onChange={() => setValueemail(props.email)}
                                        placeholder="email"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="9" className="mb-3">
                            <FormGroup className="row">
                                <Label className="col-sm-2 col-form-label" for="validationCustom02"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Login Password</Label>
                                <Col sm="6">
                                    <input
                                        value={""}
                                        className="form-control"
                                        type="password"
                                        name="password" 
                                        autoComplete="off"
                                        {...register("password", { required: true })}
                                        placeholder="password"
                                    />

                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="9" className="mb-3">
                            <FormGroup className="row d-flex">
                                <Col sm="2" className="col-form-label" />
                                <Col sm="6" className="d-flex">
                                    <Btn attrBtn={{ color: 'primary', style: { flex: 1, marginRight: '10px' }, onClick: handleSubmit(onSubmit, onError) }}>Send Email</Btn>

                                    <Btn attrBtn={{ color: 'info', style: { flex: 1 }, onClick: Generate }}>Generate Password</Btn>
                                </Col>
                            </FormGroup>
                        </Col>



                    </CardBody>


                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Portal_User;