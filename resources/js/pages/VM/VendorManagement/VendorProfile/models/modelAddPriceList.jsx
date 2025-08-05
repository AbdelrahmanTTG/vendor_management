import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../../AbstractElements';
import CommonModal from '../../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../AxiosClint";
import { toast } from 'react-toastify';

const AddNewBtn = (props) => {
    // toast.configure();
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
       
    const [optionsB, setOptionsB] = useState([]);

    const [initialOptions, setInitialOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [optionsC, setOptionsC] = useState([]);

    const onSubmit = async (data) => {
        if (props.id) {
            const formDate = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return [key, value.value];
                    }
                    return [key, value];
                })
            );
            formDate['vendor'] = props.id;
            formDate['currency'] = props.currency?.value
            try {
                const response = await axiosClient.post("AddPriceList", formDate);
                props.getData(response.data)
                toggle()
                reset()
                setValue("rate", '')
                setValue("special_rate", '')

                basictoaster("successToast", "Added successfully !");
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
        } else {
            basictoaster("dangerToast", "Make sure to send your personal information first and send Billing data ");

        }

    };
    const renameKeys = (obj, keysMap) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };
    // useEffect(() => {
    //     if (props.currency) {
    //         const updatedData = renameKeys(props.currency, { id: "value", name: "label" });
    //         setOptionsC(updatedData);
    //         setValue("currency", updatedData)
    //     }
    // }, [props.currency])
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
            <Btn attrBtn={{ color: 'btn btn-primary-light', onClick: toggle }} className="me-2" >Add price list</Btn>
            <CommonModal isOpen={modal} title='Add new price list' icon={<><i className="fa fa-info-circle" style={{ fontSize: '18px', color: 'darkred', marginRight: '1%' }}></i><span style={{ fontSize: '14px', color: 'darkred' }}> Type in the fields to search.</span></>} toggler={toggle} size="xl" marginTop="-1%" onSave={handleSubmit(onSubmit)} >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Main-Subject Matter</Label>
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
                                                handleInputChange(inputValue, "fields", "subject", setOptionsMain, optionsMain)
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
                                    rules={{ required: false }}
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
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Service</Label>
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Task Type</Label>
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Source Language</Label>
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Target Language</Label>
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
                                    rules={{ required: false }}
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Target Dialect </Label>
                            <Col sm="8">
                                {/* <Select defaultValue={{ isDisabled: true, label: '-- Select Dialect --' }} className="js-example-basic-single col-sm-12" /> */}
                                <Controller
                                    name="dialect_target"
                                    control={control}
                                    rules={{ required: false }}
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Unit</Label>
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

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Rate</Label>
                            <Col sm="8">
                                {/* <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" /> */}
                                <input

                                    defaultValue=""
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

                                    defaultValue=""
                                    className="form-control"
                                    type="number"
                                    name="special_rate"
                                    {...register("special_rate", { required: false })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Status</Label>
                            <Col sm="8">

                                <Controller
                                    name="Status"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            id='Status'
                                            {...field}
                                            value={field.value || { value: '', label: '-- Select Status --' }}
                                            options={[
                                                { value: '0', label: 'Active' },
                                                { value: '1', label: 'Not Active' },
                                                { value: '2', label: 'Pending by PM' }
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Brand</Label>
                            < Col sm="8" >
                                <Controller
                                    name="sheet_brand"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                           value={field.value}
                                            options={optionsB}                                           
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "brand", "sheet_brand", setOptionsB, optionsB)
                                            }
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                    </div>
                                                ) : 'No options found'
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    {/* <Col md="6" className="mb-3">
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
                                            value={optionsC}
                                            className="js-example-basic-single col-sm-12"
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}

                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col> */}
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

export default AddNewBtn;