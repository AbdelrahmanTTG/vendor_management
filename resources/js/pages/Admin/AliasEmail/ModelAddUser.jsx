import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../AbstractElements';
import CommonModal from '../../VM/Model';
import { Col, Label, Row, FormGroup } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../pages/AxiosClint";
import { toast } from 'react-toastify';
const AddNewUser = (props) => {
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: "top-right"
                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: "top-right"
                });
                break;
            case 'warningToast':
                toast.warn(status, {
                    position: "top-right"
                });
                break;
            default:
                break;
        }
    };

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idDepartment, setUserDepartment] = useState([]);
    const [optionsSub, setOptionsSub] = useState([]);
    const [Users, setUsers] = useState([]);

    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const toggle = () => {
        setModal(!modal);
        setTimeout(() => {
            props.handleEditClick(null);
        }, 500);
    }
    useEffect(() => {
        if (props.data) {
            setModal(props.data)
        }
    }, [props.data])
    const handelingDepartment = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get("Departments");
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name,
            }));

            setOptionsSub(formattedOptions);

        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrorMessage(response.data.errors);
            } else if (response && response.status === 401) {
                setErrorMessage(response.data.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        handelingUsers()
    }, [idDepartment])
    const handelingUsers = async () => {
        if (idDepartment.length <= 0) {
            setUsers([])
            return
        }
        try {
            setLoading(true);
            const { data } = await axiosClient.post("Employees", {
                department_ids: idDepartment
            });
            // console.log(data)
            const formattedOptions = data.map(item => ({
                value: item.email,
                label: item.name,
            }));

            setUsers(formattedOptions);

        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrorMessage(response.data.errors);
            } else if (response && response.status === 401) {
                setErrorMessage(response.data.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (modal) {
            handelingDepartment()
        }
    }, [modal])
    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className="custom-option" style={{ padding: '8px 10px', borderBottom: '1px solid #eee' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <td style={{ width: '45%', padding: '5px' }}>{data.label}</td>
                            {/* <td style={{ width: '10%', padding: '5px' }}><i className="fa fa-arrow-right" aria-hidden="true"></i>
                            </td> */}
                            <td style={{ width: '45%', padding: '5px' }}>{data.value}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
    const onSubmit = async (form) => {
        if (form !== '') {
            try {
                
                const formData = {
                    ...form,
                    id: props?.aliasId
                };
                const { data } = await axiosClient.post("updateEmailJoinAlias", formData);
                props.onUpdateData(data?.id, data?.added_users)
                toggle()
                if (data?.added_users.length > 0) {
                    basictoaster("successToast", `Emails added successfully`);
                }
                if (data?.existing_users.length > 0) {
                    const existingEmails = data.existing_users.map(user => user).join(",");
                    basictoaster("warningToast", `The following accounts are already added: ${existingEmails}`);
                }
            } catch (err) {
                const response = err.response;
                // if (response && response.data) {
                //     setErrorMessage(response.data.message || "An unexpected error occurred.");
                // } else {
                //     setErrorMessage("An unexpected error occurred.");
                // }
                // console.log(err)
                basictoaster("dangerToast", response.data.message)

            }

        } else {
            errors.showMessages();
        }
    }
    return (
        <Fragment>
            <CommonModal onSave={handleSubmit(onSubmit)} marginTop="-10vh" size="lg" isOpen={modal} title={props.titelModel} toggler={toggle} style={{ Width: "600px", height: "80vh" }} >
                <Row className="g-3 mb-3">
                    <Col md="12">
                        <FormGroup className="row">
                            <Label className="col-sm-2 col-form-label" for="validationCustom01">Department</Label>
                            <Col sm="10">

                                <Select
                                    value={optionsSub.value}
                                    options={optionsSub}
                                    className="js-example-basic-single col-sm-12"
                                    isSearchable
                                    noOptionsMessage={() => loading ? (
                                        <div className="loader-box" >
                                            <Spinner attrSpinner={{ className: 'loader-6' }} />
                                        </div>
                                    ) : 'Select department'}
                                    onChange={(option) => {
                                        setUserDepartment(option ? option.map(item => item.value) : []);
                                    }}
                                    isMulti

                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup className="row">
                            <Label className="col-sm-2 col-form-label" for="validationCustom01">User</Label>
                            <Col sm="10">
                                <Controller
                                    name="users"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={Users}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box">
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'Select department first '}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                            components={{
                                                Option: customOption,
                                            }}
                                            isMulti
                                            getOptionLabel={(option) => option.value}
                                            getOptionValue={(option) => option.value}
                                        />
                                    )}
                                />

                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    )
};
export default AddNewUser;