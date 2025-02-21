import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../AbstractElements';
import CommonModal from '../../VM/Model';
import { Col, Label, Row, FormGroup } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../pages/AxiosClint";
import { toast } from 'react-toastify';
const AddNewBtn = (props) => {
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
                default:
                    break;
            }
        };
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [optionsSub, setOptionsSub] = useState([]);
    const [idDepartment, setUserDepartment] = useState([]);
    const [Users, setUsers] = useState([]);
    const [optionsB, setOptionsB] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});

    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
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
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return
        try {
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name || item.gmt,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions(prev => ({ ...prev, [fieldName]: formattedOptions }));
            }
        } catch (err) {
            const response = err.response;
            console.log(err)

            if (response && response.status === 422) {
                setErrorMessage(response.data.errors);
            } else if (response && response.status === 401) {
                setErrorMessage(response.data.message);
            } else {
                // setErrorMessage("An unexpected error occurred.");
            }
        }

    };
    useEffect(() => {
        handelingSelect("brand", setOptionsB, "brand");
    }, [1]);
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
    const toggle = () => setModal(!modal);
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
            form.brand_id = form.brand_id?.value || '';
            form.status = form.status?.value || '';

            try {
                const formData = {
                    ...form,
                };
                const { data } = await axiosClient.post("Alias", formData);
                props.onAddData(data.alias)
                setValue("name", "")
                setValue("email", "")
                reset()
                toggle()
                basictoaster("successToast", "Alias has been added successfully.")

            } catch (err) {
                const response = err.response;
                // if (response && response.data) {
                //     setErrorMessage(response.data.message || "An unexpected error occurred.");
                // } else {
                //     setErrorMessage("An unexpected error occurred.");
                // }
                basictoaster("dangerToast", response.data.message)
            }
        } else {
            errors.showMessages();
        }
    }

    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: toggle }} className="me-2">{props.nameBtm}</Btn>
            <CommonModal onSave={handleSubmit(onSubmit)} marginTop="-10vh" size="lg" isOpen={modal} title={props.titelModel} toggler={toggle} style={{ Width: "600px", height: "80vh" }} >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Name alias</Label>
                            <Col sm="8">
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    {...register("name", { required: false })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Email alias</Label>
                            <Col sm="8">
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    {...register("email", { required: false })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Department</Label>
                            <Col sm="8">

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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Brand</Label>
                            <Col sm="8">
                                <Controller
                                    name="brand_id"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsB}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'Select Sub Subject Matter'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
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
                                            ) : 'Select department first'}
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Status</Label>
                            <Col sm="8">
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={[{ value: "1", label: "Active" }, { value: "0", label: "Inactive" }]}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            onChange={(option) => { field.onChange(option); }}
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
export default AddNewBtn;