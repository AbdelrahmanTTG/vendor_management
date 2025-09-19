import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, Media, FormGroup } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import axiosClient from "../../../AxiosClint";
import { toast } from 'react-toastify';
import { useForm, Controller, set } from 'react-hook-form';

const Test = (props) => {
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
                break;
        }
    };
    const [isOpen, setIsOpen] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});

    const [optionsMain, setOptionsMain] = useState([]);
    const [optionsSub, setOptionsSub] = useState([]);
    const [optionsSL, setOptionsSL] = useState([]);
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsSre, setOptionsSer] = useState([]);
    const [testFileName, setTestFileName] = useState(null);
    const [testFile, setTestFile] = useState(false);

    const [selectedOption, setSelectedOption] = useState("1");
    const [testResult, setTestResult] = useState("1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [Sub, setSub] = useState(false);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleTestResultChange = (event) => {
        setTestResult(event.target.value);
    };
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
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


    const handleFileChange = (event, setFileName) => {
        const file = event.target.files[0];

        setFileName(file ? file : null);
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
    const onSubmit = async (data) => {
        if (props?.mode == "edit" && !props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!testFileName) {
            basictoaster("dangerToast", " The test file must be attached.");
            return;
        }
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        if (!props.id) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            setSub(true);
            const formData = new FormData();
            formData.append('test', testFileName);
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    formData.append(key, value.value);
                } else {
                    formData.append(key, value);
                }
            });
            formData.append('test_type', selectedOption);
            formData.append('test_result', testResult);
            formData.append('vendor_id', props.id);
            try {
                const response = await axiosClient.post("VendorTest", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                basictoaster("successToast", isSubmitting ? "Test Updated successfully" : "Test submitted successfully");
                setIsSubmitting(true)

            } catch (err) {
                console.error("Error:", err.response ? err.response.data : err.message);
            }finally {
                setSub(false);
            }

        }


    }
    const renameKeys = (obj, keysMap) => {
        if (!obj) { return }
        return Object?.keys(obj)?.reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };
    useEffect(() => {
        if (props.VendorTestData) {
            if (props.VendorTestData.VendorTestData) {
                setIsChecked(true)
                const data = props.VendorTestData.VendorTestData
                setSelectedOption(data?.test_type)
                setTestResult(data?.test_result)
                if (data.test_upload) {
                    setTestFileName(data.test_upload)
                    setTestFile(true)
                 }


                setValue("source_lang", renameKeys(data?.source_lang, { id: "value", name: "label" }))
                setValue("target_lang", renameKeys(data?.target_lang, { id: "value", name: "label" }))
                setValue("main_subject", renameKeys(data?.main_subject, { id: "value", name: "label" }))
                setValue("sub_subject", renameKeys(data?.sub_subject, { id: "value", name: "label" }))
                setValue("service", renameKeys(data?.service, { id: "value", name: "label" }))
            }
        }
    }, [props.VendorTestData])
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "service":
                    basictoaster("dangerToast", "Service is required");
                    return;
                case "sub_subject":
                    basictoaster("dangerToast", "Sub subject is required");
                    return;
                case "main_subject":
                    basictoaster("dangerToast", "Main subject is required");
                    return;
                case "target_lang":
                    basictoaster("dangerToast", "Target lang is required");
                    return;
                case "source_lang":
                    basictoaster("dangerToast", "Source lang is required");
                    return;
                case "file":
                    basictoaster("dangerToast", "File is required");
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
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>Test</H5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Col sm="2">
                            <Media>
                                <Label className="col-form-label m-r-10">
                                    Tested ?
                                </Label>
                                <Media
                                    body
                                    className="text-end icon-state switch-outline"
                                >
                                    <Label className="switch">
                                        <Input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span className="switch-state bg-primary"></span>
                                    </Label>
                                </Media>
                            </Media>
                        </Col>
                        {isChecked && (
                            <div>
                                <div
                                    className="border border-default p-3 mb-3 "
                                    style={{ borderStyle: "dashed!important" }}
                                >
                                    <Label className="col-form-label m-r-10">
                                        Test Status
                                    </Label>
                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label
                                            className="col-form-label m-0"
                                            style={{ lineHeight: "1.5" }}
                                        >
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Test Type :
                                        </Label>
                                        <div className="radio radio-primary me-3 ms-4">
                                            <Input
                                                id="radio11"
                                                value="1"
                                                className="form-control"
                                                type="radio"
                                                name="radio1"
                                                checked={selectedOption == "1"}
                                                onChange={handleChange}
                                            />
                                            <Label
                                                for="radio11"
                                                style={{
                                                    margin: 0,
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                <span className="digits">
                                                    {"Client Test"}
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="radio radio-danger ">
                                            <Input
                                                id="radio12"
                                                value="0"
                                                className="form-control"
                                                type="radio"
                                                name="radio1"
                                                checked={selectedOption == "0"}
                                                onChange={handleChange}
                                            />
                                            <Label
                                                for="radio12"
                                                style={{
                                                    margin: 0,
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                <span className="digits">
                                                    {"On boarding test"}
                                                </span>
                                            </Label>
                                        </div>
                                    </Col>

                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label
                                            className="col-form-label m-0"
                                            style={{ lineHeight: "1.5" }}
                                        >
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Test result :
                                        </Label>
                                        <div className="radio radio-primary me-3 ms-3">
                                            <Input
                                                id="radio21"
                                                type="radio"
                                                name="radio2"
                                                value="1"
                                                checked={testResult == "1"}
                                                onChange={
                                                    handleTestResultChange
                                                }
                                            />
                                            <Label
                                                for="radio21"
                                                style={{
                                                    margin: 0,
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                <span className="digits">
                                                    {"Pass"}
                                                </span>
                                            </Label>
                                        </div>
                                        <div className="radio radio-danger ms-5">
                                            <Input
                                                id="radio22"
                                                type="radio"
                                                name="radio2"
                                                value="0"
                                                checked={testResult == "0"}
                                                onChange={
                                                    handleTestResultChange
                                                }
                                            />
                                            <Label
                                                for="radio22"
                                                style={{
                                                    margin: 0,
                                                    lineHeight: "1.5",
                                                }}
                                            >
                                                <span className="digits">
                                                    {"Fail"}
                                                </span>
                                            </Label>
                                        </div>
                                    </Col>
                                    <Col className="d-flex align-items-center ms-5 gap-4 mt-3">
                                        <Label
                                            className="col-form-label m-0"
                                            style={{ lineHeight: "1.5" }}
                                        >
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Test Upload :
                                        </Label>
                                        <div className="radio radio-primary me-3">
                                            <Controller
                                                name="test"
                                                control={control}
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files[0];
                                                            if (file) {
                                                                const fileName =
                                                                    file.name.toLowerCase();
                                                                const fileSize =
                                                                    file.size;
                                                                const allowedExtensions =
                                                                    [
                                                                        ".zip",
                                                                        ".rar",
                                                                    ];
                                                                if (
                                                                    fileSize >
                                                                    5 *
                                                                        1024 *
                                                                        1024
                                                                ) {
                                                                    if (
                                                                        !allowedExtensions.some(
                                                                            (
                                                                                ext
                                                                            ) =>
                                                                                fileName.endsWith(
                                                                                    ext
                                                                                )
                                                                        )
                                                                    ) {
                                                                        alert(
                                                                            "If the file is larger than 5MB, it must be a ZIP or RAR file."
                                                                        );
                                                                        e.target.value =
                                                                            "";
                                                                        return;
                                                                    }
                                                                }
                                                            }
                                                            handleFileChange(
                                                                e,
                                                                setTestFileName
                                                            );
                                                            field.onChange(e);
                                                        }}
                                                    />
                                                )}
                                            />

                                            {testFile ? (
                                                <span className="form-text text-muted py-2 m-1">
                                                    Download.
                                                    <button
                                                        style={{
                                                            backgroundColor:
                                                                "transparent",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            marginLeft: "10px",
                                                        }}
                                                        color="transparent"
                                                        onClick={() =>
                                                            handleDownload(
                                                                testFileName
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            style={{
                                                                fontSize:
                                                                    "1.6em",
                                                                marginTop:
                                                                    "3px",
                                                            }}
                                                            className="fa fa-cloud-download"
                                                        ></i>
                                                    </button>{" "}
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </Col>
                                </div>
                                <div
                                    className="border border-default p-3 mb-3 test_details"
                                    style={{ borderStyle: "dashed!important" }}
                                >
                                    <Label className="col-form-label m-r-10 mb-3 fw-bold">
                                        Test specification
                                    </Label>
                                    <Row>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label
                                                    className="col-sm-3 col-form-label"
                                                    for="validationCustom01"
                                                >
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>{" "}
                                                    Source
                                                </Label>
                                                <Col sm="9">
                                                    <Controller
                                                        name="source_lang"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    optionsSL
                                                                }
                                                                onInputChange={(
                                                                    inputValue
                                                                ) =>
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
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    field.onChange(
                                                                        option
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label
                                                    className="col-sm-3 col-form-label"
                                                    for="validationCustom01"
                                                >
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>{" "}
                                                    Target
                                                </Label>
                                                <Col sm="9">
                                                    <Controller
                                                        name="target_lang"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    optionsTL
                                                                }
                                                                onInputChange={(
                                                                    inputValue
                                                                ) =>
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
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    field.onChange(
                                                                        option
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label
                                                    className="col-sm-3 col-form-label"
                                                    for="validationCustom01"
                                                >
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>{" "}
                                                    Main-Subject Matter
                                                </Label>
                                                <Col sm="9">
                                                    <Controller
                                                        name="main_subject"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    optionsMain
                                                                }
                                                                onInputChange={(
                                                                    inputValue
                                                                ) =>
                                                                    handleInputChange(
                                                                        inputValue,
                                                                        "mainsubject",
                                                                        "main_subject",
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
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    handelingSelectSub(
                                                                        option.value
                                                                    );

                                                                    field.onChange(
                                                                        option
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label
                                                    className="col-sm-3 col-form-label"
                                                    for="validationCustom01"
                                                >
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>{" "}
                                                    Sub–Subject Matter
                                                </Label>
                                                <Col sm="9">
                                                    <Controller
                                                        name="sub_subject"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    optionsSub
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
                                                                        "Select Sub Subject Matter"
                                                                    )
                                                                }
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    field.onChange(
                                                                        option
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6" className="mb-3">
                                            <FormGroup className="row">
                                                <Label
                                                    className="col-sm-3 col-form-label"
                                                    for="validationCustom01"
                                                >
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>{" "}
                                                    Service
                                                </Label>
                                                <Col sm="9">
                                                    <Controller
                                                        name="service"
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    optionsSre
                                                                }
                                                                onInputChange={(
                                                                    inputValue
                                                                ) =>
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
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    field.onChange(
                                                                        option
                                                                    );
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Btn
                                        attrBtn={{
                                            color: "primary",
                                            disabled: Sub,
                                            onClick: handleSubmit(
                                                onSubmit,
                                                onError
                                            ),
                                        }}
                                    >
                                        {Sub ? (
                                            <>
                                                <Spinner size="sm" />{" "}
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Btn>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Test;