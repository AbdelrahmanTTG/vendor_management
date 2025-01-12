import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../../AbstractElements';
import CommonModal from '../../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../AxiosClint";
import { toast } from 'react-toastify';

const EditNewBtn = (props) => {
    toast.configure();
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            default:
        }
    };
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const [optionsMain, setOptionsMain] = useState([]);

    const [optionsSub, setOptionsSub] = useState([]);

    const [optionsSre, setOptionsSer] = useState([]);

    const [optionsT, setOptionsT] = useState([]);

    const [optionsUnit, setOptionsUnit] = useState([]);

    const [optionsSL, setOptionsSL] = useState([]);

    const [optionsTL, setOptionsTL] = useState([]);

    const [optionsD, setOptionsD] = useState([]);

    const [initialOptions, setInitialOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [optionsC, setOptionsC] = useState([]);
    const [priceList, setPriceList] = useState([]);

    const onSubmit = async (data) => {
        // const keys = Object.keys(data);
        // const extractedValues = keys.map(key => {
        //     const value = props?.data[key];
        //     return value && typeof value === 'object' ? value.id : value;
        // });
        // const extractedValues2 = keys.map(key => formData[key]);
        // const areEqual = extractedValues2.every((val, index) => val === extractedValues[index]);

        const formDate = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return [key, value.value];
                }
                return [key, value];
            })
        );
        formDate['id'] = props?.data?.id || props?.id;

        try {
            const response = await axiosClient.post("UpdatePriceList", formDate);
            toggle()
            props?.getData(response.data)
            reset()
            setValue("rate", '')
            setValue("special_rate", '')
            basictoaster("successToast", "Updated successfully !");
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
    };
    useEffect(() => {
        const fetchData = async (id) => {
            const payload = { id: id,}
            try {
                const { data } = await axiosClient.post("getPriceList", payload);
                setPriceList(data);
            } catch (err) {
                console.error(err);
            } finally {
            }            
        };
        if (props?.id) {
            fetchData(props?.id);
        }
    }, [ props?.id]);
    useEffect(() => {
        if (props?.data || priceList?.length) {
            var data = props?.data || priceList[0];
        }
        if (data) {
            setValue("subject", renameKeys(data?.subject, { id: "value", name: "label" }))
            setValue("sub_subject", renameKeys(data?.sub_subject, { id: "value", name: "label" }))
            setValue("service", renameKeys(data?.service, { id: "value", name: "label" }))
            setValue("task_type", renameKeys(data?.task_type, { id: "value", name: "label" }))
            setValue("source_lang", renameKeys(data?.source_lang, { id: "value", name: "label" }))
            setValue("target_lang", renameKeys(data?.target_lang, { id: "value", name: "label" }))
            setValue("dialect", renameKeys(data?.dialect, { id: "value", dialect: "label" }))
            setValue("dialect_target", renameKeys(data?.dialect_target, { id: "value", dialect: "label" }))
            setValue("unit", renameKeys(data?.unit, { id: "value", name: "label" }))
            setValue("rate", data?.rate)
            setValue("special_rate", data?.special_rate)
            setValue("Status", { value: data?.Status || "", label: data?.Status || "" })
            setValue("currency", renameKeys(data?.currency, { id: "value", name: "label" }))
            handelingSelectTasks(data?.service?.id)
        }

    }, [props?.data, priceList, props?.id])
    const renameKeys = (obj, keysMap) => {
        if (!obj) { return }
        return Object?.keys(obj)?.reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };

    const handleInputChange = (inputValue, tableName, fieldName, setOptions, options) => {

        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                setLoading(true);
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name || item.gmt || item.dialect,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions(prev => ({ ...prev, [fieldName]: formattedOptions }));
            }
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
    const handelingSelectTasks = async (id) => {
        if (!id) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("TaskType", {
                params: {
                    id: id
                }
            });

            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name,
            }));

            setOptionsT(formattedOptions);

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
    const handelingSelectSub = async (id) => {
        if (!id) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("GetSubSubject", {
                params: {
                    id: id
                }
            });

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
    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-light', onClick: toggle }} className="me-2" > <i className="icofont icofont-ui-edit"></i></Btn>
            <CommonModal isOpen={modal} title='Edit price list' icon={<><i className="fa fa-info-circle" style={{ fontSize: '18px', color: 'darkred', marginRight: '1%' }}>  </i><span style={{ fontSize: '14px', color: 'darkred' }}>Type in the fields to search.</span></>} toggler={toggle} size="xl" marginTop="-1%" onSave={handleSubmit(onSubmit)} >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Main-Subject Matter</Label>
                            <Col sm="8">
                                <Controller
                                    name="subject"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsMain}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "MainSubjectMatter", "subject", setOptionsMain, optionsMain)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                handelingSelectSub(option.value)
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>

                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Sub–Subject Matter</Label>
                            <Col sm="8">
                                <Controller
                                    name="sub_subject"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsSub}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'Select Main Subject Matter'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />

                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Service</Label>
                            <Col sm="8">

                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Service --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="service"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}

                                            options={optionsSre}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "services", "service", setOptionsSer, optionsSre)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                handelingSelectTasks(option.value)
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Task Type</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Task Type --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="task_type"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsT}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Source Language</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Source Language --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="source_lang"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsSL}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "languages", "source_lang", setOptionsSL, optionsSL)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Target Language</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Target Language --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="target_lang"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsTL}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "languages", "target_lang", setOptionsTL, optionsTL)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Source Dialect</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Dialect --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="dialect"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsD}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "languages_dialect", "dialect", setOptionsD, optionsD)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Target Dialect</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Dialect --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="dialect_target"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsD}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "languages_dialect", "dialect_target", setOptionsD, optionsD)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Unit</Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Unit --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="unit"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsUnit}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "unit", "unit", setOptionsUnit, optionsUnit)
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading ? (
                                                <div className="loader-box" >
                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                </div>
                                            ) : 'No options found'}
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Rate</Label>
                            <Col sm="8">
                                {/* <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" /> */}
                                <input

                                    value={props?.data?.rate}

                                    className="form-control"
                                    type="number"
                                    name="rate"
                                    {...register("rate", { required: true })}

                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Rush Rate</Label>
                            <Col sm="8">
                                {/* <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" /> */}
                                <input

                                    value={props?.data?.special_rate}
                                    className="form-control"
                                    type="number"
                                    name="special_rate"
                                    {...register("special_rate", { required: true })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Status</Label>
                            <Col sm="8">

                                <Controller
                                    name="Status"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            id='Status'
                                            {...field}
                                            value={field.value}
                                            options={[
                                                { value: 'Active', label: 'Active' },
                                                { value: 'Not Active', label: 'Not Active' },
                                                { value: 'Pending by PM', label: 'Pending by PM' }
                                            ]}
                                            className="js-example-basic-single col-sm-12"
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6" className="mb-3">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Currency</Label>
                            <Col sm="8">
                                <Controller
                                    name="currency"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            isDisabled
                                            value={renameKeys(props?.data?.currency, { id: "value", name: "label" }) || renameKeys(priceList[0]?.currency, { id: "value", name: "label" })}
                                            className="js-example-basic-single col-sm-12"
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                {/* <Row className="g-0">
                    <Col  >
                        <Label htmlFor="validationDefault01">Language</Label>
                        <input className="form-control" id="validationCustom01" type="text" placeholder="Language" name="Language" {...register('Language', { required: true })} />
                        <span style={{ color: '#dc3545', fontStyle: 'italic' }}>{errors.Language && 'Language name is required'}</span>
                    </Col>
                </Row> */}

            </CommonModal>
        </Fragment>
    );
};

export default EditNewBtn;