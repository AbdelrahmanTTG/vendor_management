import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../../AbstractElements';
import CommonModal from '../../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../AxiosClint";
import { toast } from 'react-toastify';

const EditNewBtn = (props) => {
    // toast.configure();
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
    const [loading2, setLoading2] = useState(false);

    const onSubmit = async (data) => {
        const formDate = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    return [key, value.value];
                }
                return [key, value];
            })
        );
        formDate['id'] = props?.data?.id || props?.id;
        formDate['currency'] = props?.currency?.value;

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
        let isMounted = true; 
        const fetchData = async (id) => {
            const payload = { id: id };
            try {
                setLoading2(true);
                const { data } = await axiosClient.post("getPriceList", payload);
          
                    setPriceList(data);
                
            } catch (err) {
                if (isMounted) console.error(err);
            } finally {
                if (isMounted) setLoading2(false); 
            }
        };

        if (props?.id) {
            fetchData(props?.id);
        }

        return () => {
            isMounted = false;
        };
    }, [props?.id]);

    useEffect(() => {
        if (props?.data || priceList?.length) {
            var data = props?.data || priceList[0];
        }
        if (data) {
            const statusLabels = {
                0: "Active",
                1: "Not Active",
                2: "Pending by PM"
            };
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
            setValue("Status", { value: data?.Status || "", label: statusLabels[data?.Status] || "Unknown" })
            setValue("currency", renameKeys(data?.currency, { id: "value", name: "label" }))
            handelingSelectTasks(data?.service?.id)
            handelingSelectSub(data?.subject?.id)

        }

    }, [props?.data, priceList, props?.id, modal])
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
    const [inputVal, setInputVal] = useState('');
    const [inputValMain, setInputValMain] = useState('');
    const [inputValSub, setInputValSub] = useState('');
    const [inputValTask, setInputTask] = useState('');
    const [inputValSL, setInputSL] = useState('');
    const [inputValTL, setInputTL] = useState('');
    const [inputValD, setInputD] = useState('');
    const [inputValD2, setInputD2] = useState('');
    const [inputValU, setInputU] = useState('');



    return (
        <Fragment>
            <Btn attrBtn={{ color: 'btn btn-primary-light', onClick: toggle }} className="me-2" > <i className="icofont icofont-ui-edit"></i></Btn>
            <CommonModal isOpen={modal} title='Edit price list' icon={<><i className="fa fa-info-circle" style={{ fontSize: '18px', color: 'darkred', marginRight: '1%' }}>  </i><span style={{ fontSize: '14px', color: 'darkred' }}>Type in the fields to search.</span></>} toggler={toggle} size="xl" marginTop="-1%" onSave={handleSubmit(onSubmit)} >
               
                  {
                             loading2 ? (
                               <div className="loader-box" >
                                 <Spinner attrSpinner={{ className: 'loader-6' }} />
                               </div>
                             ) :  <Row className="g-3 mb-3">
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
                                            inputValue={inputValMain}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputValMain(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "MainSubjectMatter", "subject", setOptionsMain, optionsMain);
                                            }}

                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                handelingSelectSub(option.value)
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputValMain(field.value.label);
                                                }
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
                                            inputValue={inputValSub}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputValSub(newInputValue);
                                                }
                                            }}
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputValSub(field.value.label);
                                                }
                                            }}

                                        />
                                    )}
                                />

                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                                    <Label className="col-sm-4 col-form-label" for="validationCustom01"> <span style={{ color: 'red', fontSize: "18px" }}>*</span> Service</Label>
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
                                            inputValue={inputVal}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputVal(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "services", "service", setOptionsSer, optionsSre);
                                            }}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                handelingSelectTasks(option.value);
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputVal(field.value.label);
                                                }
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
                                            inputValue={inputValTask}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputTask(newInputValue);
                                                }
                                            }}
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputTask(field.value.label);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                                    <Label className="col-sm-4 col-form-label" for="validationCustom01"> <span style={{ color: 'red', fontSize: "18px" }}>*</span> Source Language</Label>
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
                                            inputValue={inputValSL}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputSL(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "languages", "source_lang", setOptionsSL, optionsSL);
                                            }}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputSL(field.value.label);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">

                                    <Label className="col-sm-4 col-form-label" for="validationCustom01"> <span style={{ color: 'red', fontSize: "18px" }}>*</span> Target Language</Label>
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
                                            inputValue={inputValTL}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputTL(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "languages", "target_lang", setOptionsTL, optionsTL);
                                            }}
                                           
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputTL(field.value.label);
                                                }
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
                                            inputValue={inputValD}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputD(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "languages_dialect", "dialect", setOptionsD, optionsD);
                                            }}
                                           
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputD(field.value.label);
                                                }
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
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsD}
                                            inputValue={inputValD2}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputD2(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "languages_dialect", "dialect_target", setOptionsD, optionsD);
                                            }}
                                           
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputD2(field.value.label);
                                                }
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
                                            inputValue={inputValU}
                                            onInputChange={(newInputValue, { action }) => {
                                                if (action !== "input-blur" && action !== "menu-close") {
                                                    setInputVal(newInputValue);
                                                }
                                                handleInputChange(newInputValue, "unit", "unit", setOptionsUnit, optionsUnit);
                                            }}
                                           
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner attrSpinner={{ className: "loader-6" }} />
                                                    </div>
                                                ) : "No options found"
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                            onFocus={() => {
                                                if (field.value) {
                                                    setInputU(field.value.label);
                                                }
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
                                    defaultValue={props?.data?.rate}
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

                                    defaultValue={props?.data?.special_rate}
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
                                            value={field.value}
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
                 
                    </Row>}
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