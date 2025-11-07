import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../../AbstractElements';
import CommonModal from '../../../Model';
import { Col, Label, Input, Row, FormGroup } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../AxiosClint";
import { toast } from 'react-toastify';
import { t } from 'i18next';

const AddNewBtn = (props) => {
    // toast.configure();
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case "successToast":
                toast.success(status, {
                    position: "top-right",
                });
                break;
            case "dangerToast":
                toast.error(status, {
                    position: "top-right",
                });
                break;
            default:
        }
    };
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const [optionsMain, setOptionsMain] = useState([]);

    const [optionsSub, setOptionsSub] = useState([]);

    const [optionsSre, setOptionsSer] = useState([]);

    const [optionsT, setOptionsT] = useState([]);

    const [optionsUnit, setOptionsUnit] = useState([]);

    const [optionsSL, setOptionsSL] = useState([]);

    const [optionsTL, setOptionsTL] = useState([]);

    const [optionsD, setOptionsD] = useState([]);
    const [optionsTD, setOptionsTD] = useState([]);

    const [optionsB, setOptionsB] = useState([]);
    const [selectedOptionC, setSelectedOptionC] = useState(null);

    const [initialOptions, setInitialOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [optionsC, setOptionsC] = useState([]);
    const [loading2, setLoading2] = useState(false);

    const onSubmit = async (data, keepOpen = false) => {
        if (props.id) {
            const formDate = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    if (typeof value === "object" && value !== null) {
                        return [key, value.value];
                    }
                    return [key, value];
                })
            );

            formDate["vendor"] = props.id;
            formDate["currency"] = props.currency?.value;

            try {
                const response = await axiosClient.post(
                    "AddPriceList",
                    formDate
                );

                props.getData(response.data, formDate, keepOpen);

                // props.getData(response.data, '', keepOpen);
                reset();
                setValue("rate", "");
                setValue("special_rate", "");

                basictoaster("successToast", "Added successfully!");
            } catch (err) {
                const response = err.response;

                if (response) {
                    if (response.status === 409) {
                        basictoaster("dangerToast", "This price list already exists");
                        return;
                    }

                    if (response.data) {
                        const errors = response.data;
                        Object.keys(errors).forEach((key) => {
                            const messages = errors[key];
                            if (messages.length > 0) {
                                messages.forEach((message) => {
                                    basictoaster("dangerToast", message);
                                });
                            }
                        });
                    }
                }
            }

        } else {
            basictoaster(
                "dangerToast",
                "Make sure to send your personal information first and send Billing data"
            );
        }
    };

    const renameKeys = (obj, keysMap) => {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };
    useEffect(() => {
        if (props.Currency) {
            setSelectedOptionC({
                value: props?.Currency?.id,
                label: props?.Currency?.name,
            });
        }
    }, [props.Currency]);
    // useEffect(() => {
    //     if (props.currency) {
    //         const updatedData = renameKeys(props.currency, { id: "value", name: "label" });
    //         setOptionsC(updatedData);
    //         setValue("currency", updatedData)
    //     }
    // }, [props.currency])
    // أضف هذا useEffect بعد useEffect الموجود حالياً
    useEffect(() => {
        if (props.c && typeof props.c === "object") {
            setModal(true);
            // console.log(props.c);
            if (props.c.subject_main) {
                setValue("subject_main", {
                    value: props.c.subject_main.id,
                    label: props.c.subject_main.name,
                });
                if (props.c.subject_main) {
                    handelingSelectSub(props.c.subject_main.id);
                }
            }
            if (props.c.subject) {
                setValue("subject", {
                    value: props.c.subject.id,
                    label: props.c.subject.name,
                });
            }
            if (props.c.service) {
                setValue("service", {
                    value: props.c.service.id,
                    label: props.c.service.name,
                });
                if (props.c.service) {
                    handelingSelectTasks(props.c.service.id);
                }
            }

            if (props.c.task_type) {
                setValue("task_type", {
                    value: props.c.task_type.id,
                    label: props.c.task_type.name,
                });
            }

            if (props.c.source_lang) {
                setValue("source_lang", {
                    value: props.c.source_lang.id,
                    label: props.c.source_lang.name,
                });
                if (props.c.source_lang) {
                    handelingSourceDilect(props.c.source_lang.id, "source");
                }
            }

            if (props.c.target_lang) {
                setValue("target_lang", {
                    value: props.c.target_lang.id,
                    label: props.c.target_lang.name,
                });
                if (props.c.target_lang) {
                    handelingSourceDilect(props.c.target_lang.id, "target");
                }
            }

            if (props.c.dialect) {
                setValue("dialect", {
                    value: props.c.dialect.id,
                    label: props.c.dialect.dialect,
                });
            }

            if (props.c.dialect_target) {
                setValue("dialect_target", {
                    value: props.c.dialect_target.id,
                    label: props.c.dialect_target.name,
                });
            }

            
            if (props.c.unit) {
                setValue("unit", {
                    value: props.c.unit.id,
                    label: props.c.unit.name,
                });
            }

            if (props.c.rate) {
                setValue("rate", props.c.rate);
            }

            if (props.c.special_rate) {
                setValue("special_rate", props.c.special_rate);
            }

            if (props.c.Status !== undefined) {
                const statusLabel =
                    props.c.Status == 0
                        ? "Active"
                        : props.c.Status == 1
                        ? "Not Active"
                        : props.c.Status == 2
                        ? "Pending by PM"
                        : "";
                setValue("Status", {
                    value: props.c.Status,
                    label: statusLabel,
                });
            }
        }
    }, [props.c, setValue]);
    const handleInputChange = (
        inputValue,
        tableName,
        fieldName,
        setOptions,
        options
    ) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                setLoading(true);
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    const handelingSelect = async (
        tablename,
        setOptions,
        fieldName,
        searchTerm = ""
    ) => {
        if (!tablename) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename,
                },
            });
            const formattedOptions = data.map((item) => ({
                value: item.id,
                label: item.name || item.gmt || item.dialect,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions((prev) => ({
                    ...prev,
                    [fieldName]: formattedOptions,
                }));
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
        if (!id) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("TaskType", {
                params: {
                    id: id,
                },
            });

            const formattedOptions = data.map((item) => ({
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
        if (!id) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("GetSubSubject", {
                params: {
                    id: id,
                },
            });

            const formattedOptions = data.map((item) => ({
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
    const handelingSourceDilect = async (id, type) => {
        if (!id) return;
        try {
            setLoading(true);
            const { data } = await axiosClient.get("findSourLangDil", {
                params: {
                    id: id,
                },
            });

            const formattedOptions = data.map((item) => ({
                value: item.id,
                label: item.dialect,
            }));
            if (type === "source") {
                setOptionsD(formattedOptions);
            } else {
                setOptionsTD(formattedOptions);
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
    return (
        <Fragment>
            <Btn
                attrBtn={{ color: "btn btn-primary-light", onClick: toggle }}
                className="me-2"
            >
                Add price list
            </Btn>
            <CommonModal
                isOpen={modal}
                title="Add new price list"
                icon={<>...</>}
                toggler={toggle}
                size="xl"
                marginTop="-1%"
                onSave={handleSubmit((data) => onSubmit(data, false))}
                extraButton={
                    <Btn
                        attrBtn={{
                            color: "info",
                            type: "button",
                            onClick: handleSubmit((data) =>
                                onSubmit(data, true)
                            ),
                        }}
                    >
                        Save & Continue
                    </Btn>
                }
            >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Main-Subject Matter
                            </Label>
                            <Col sm="8">
                                <Controller
                                    name="subject_main"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsMain}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(
                                                    inputValue,
                                                    "mainsubject",
                                                    "subject_main",
                                                    setOptionsMain,
                                                    optionsMain
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                handelingSelectSub(
                                                    option.value
                                                );
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
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                Sub–Subject Matter
                            </Label>
                            <Col sm="8">
                                <Controller
                                    name="subject"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value}
                                            options={optionsSub}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "Select Sub Subject Matter"
                                                )
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Service
                            </Label>
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
                                                handleInputChange(
                                                    inputValue,
                                                    "services",
                                                    "service",
                                                    setOptionsSer,
                                                    optionsSre
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                handelingSelectTasks(
                                                    option.value
                                                );
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
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Task Type
                            </Label>
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
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Source Language
                            </Label>
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
                                                handleInputChange(
                                                    inputValue,
                                                    "languages",
                                                    "source_lang",
                                                    setOptionsSL,
                                                    optionsSL
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                handelingSourceDilect(
                                                    option.value,
                                                    "source"
                                                );
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
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Target Language
                            </Label>
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
                                                handleInputChange(
                                                    inputValue,
                                                    "languages",
                                                    "target_lang",
                                                    setOptionsTL,
                                                    optionsTL
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                handelingSourceDilect(
                                                    option.value,
                                                    "target"
                                                );
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
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                Source Dialect
                            </Label>
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
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                Target Dialect{" "}
                            </Label>
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
                                            options={optionsTD}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Unit
                            </Label>
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
                                                handleInputChange(
                                                    inputValue,
                                                    "unit",
                                                    "unit",
                                                    setOptionsUnit,
                                                    optionsUnit
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
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
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Rate
                            </Label>
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
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                Special Rate
                            </Label>
                            <Col sm="8">
                                {/* <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="" /> */}
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="number"
                                    name="special_rate"
                                    {...register("special_rate", {
                                        required: false,
                                    })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Status
                            </Label>
                            <Col sm="8">
                                <Controller
                                    name="Status"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            id="Status"
                                            {...field}
                                            value={
                                                field.value || {
                                                    value: "",
                                                    label: "-- Select Status --",
                                                }
                                            }
                                            options={[
                                                { value: "0", label: "Active" },
                                                {
                                                    value: "1",
                                                    label: "Not Active",
                                                },
                                                {
                                                    value: "2",
                                                    label: "Pending by PM",
                                                },
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
                    {/* <Col md="6">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Brand
                            </Label>
                            <Col sm="8">
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
                                                handleInputChange(
                                                    inputValue,
                                                    "brand",
                                                    "sheet_brand",
                                                    setOptionsB,
                                                    optionsB
                                                )
                                            }
                                            noOptionsMessage={() =>
                                                loading ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col> */}
                    {/* <Col md="6" className="mb-3">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-4 col-form-label"
                                for="validationCustom01"
                            >
                                Currency
                            </Label>
                            <Col sm="8">
                               
                                <Controller
                                    name="currency"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={
                                                selectedOptionC ||
                                                props?.Currency
                                            }
                                            options={optionsC}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(
                                                    inputValue,
                                                    "currency",
                                                    "Currency",
                                                    setOptionsC,
                                                    optionsC
                                                )
                                            }
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                loading2 ? (
                                                    <div className="loader-box">
                                                        <Spinner
                                                            attrSpinner={{
                                                                className:
                                                                    "loader-6",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    "No options found"
                                                )
                                            }
                                            onChange={(option) => {
                                                setSelectedOptionC(option);
                                                field.onChange(option.value);
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