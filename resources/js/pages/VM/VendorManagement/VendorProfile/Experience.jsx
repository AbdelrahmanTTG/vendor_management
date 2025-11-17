import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Form, Table, FormGroup } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosClient from "../../../../pages/AxiosClint";
import { useForm, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2';

const Experience = (props) => {
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
    const [isOpen, setIsOpen] = useState(false);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(null);
    const [yearOptions, setYearOptions] = useState([]);
    const [experienceYears, setExperienceYears] = useState('');
    const [rows, setRows] = useState([]);
    const { control, register, handleSubmit, unregister, reset, setValue, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState(null);
    const [optionsN, setOptionsN] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({});
    const [rowIdToDelete, setRowIdToDelete] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expID, setexpID] = useState('');
    const [dataE, setData] = useState();
    const [Sub, setSub] = useState(false);


    useEffect(() => {
        const generatedYears = [];
        for (let year = currentYear; year >= 1900; year--) {
            generatedYears.push({ value: year, label: year });
        }
        setYearOptions(generatedYears);
    }, [currentYear]);

    const handleYearChange = (selectedOption) => {
        if (selectedOption) {
            const selected = selectedOption.value;
            setSelectedYear(selectedOption);
            const yearsOfExperience = currentYear - selected;
            setExperienceYears(yearsOfExperience);
        }
    };
    const addRow = () => {
        const maxId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) : 0;
        const newRow = {
            id: maxId + 1,
            skill: null,
            type: null,
        };
        setRows([...rows, newRow]);
    };
    // const editRow = (id,idUpdate, selec) => {
    //     setRows(prevRows => [
    //         ...prevRows,
    //         {
    //             id: id,
    //             idUpdate: idUpdate,
    //             type: selec,
    //         },
    //     ]);
    // };
    const handleSelectChange = (selectedOption, rowId) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [rowId]: selectedOption,
        }));
    };
    useEffect(() => {
        setValue("experience_year", experienceYears)
    }, [experienceYears]);
    // useEffect(() => {
    //     handelingSelect("skills", setOptionsN, "skill");
    // }, []);
    useEffect(() => {
        if (props.mode === "edit" || dataE) {
            setLoading2(true);
            if (props.Experience || dataE) {
                if (props.Experience?.Experience || dataE) {
                    if (!dataE) { setData(props.Experience.Experience) }
                    const data = dataE;
                    if (data?.started_working) {
                        setValue("started_working", { value: data?.started_working, label: data?.started_working });
                        setSelectedYear({ value: data?.started_working, label: data?.started_working });
                    }

                    if (data?.experience_year) {
                        setValue("experience_year", data?.experience_year);
                    }

                    if (data?.summary) {
                        setValue("summary", data?.summary);
                    }

                    setexpID(data?.id)

                    if (data?.skills) {
                        // data.skills.forEach(element => {
                        //     editRow(element.skill_id, element.id,{ value: element.skill_id, label: element.name })
                        //     setValue(`skill-${element.skill_id}`, element.skill_id)
                        //     handleSelectChange({ value: element.skill_id, label: element.name }, element.skill_id)
                        // });
                        setRows(data.skills.map((element, index) => {
                            setValue(`skill-${index + 1}`, element.skill_id);
                            handleSelectChange({ value: element?.skill_id, label: element?.name }, index + 1)
                            return {
                                id: index + 1,
                                idUpdate: element.id,
                                skill: { value: element?.skill_id, label: element?.name },
                            };
                        }));

                    }
                    setLoading2(false);
                }
            }
        }
    }, [props.Experience, setValue, dataE]);
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
                label: item.name || item.gmt,
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
    const deleteRow = useCallback((rowId, idUpdate) => {
        if (idUpdate) {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete that skill ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(idUpdate);
                    if (success) {
                        SweetAlert.fire(
                            'Deleted!',
                            `This skill has been deleted..`,
                            'success'
                        );
                        setRowIdToDelete(rowId);
                    } else {
                        SweetAlert.fire(
                            'Ooops !',
                            ' An error occurred while deleting. :)',
                            'error'
                        );
                    }

                } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                    SweetAlert.fire(
                        'Cancelled',
                        'Your item is safe :)',
                        'info'
                    );
                }
            });
        } else {
            if (window.confirm("Are you sure you want to delete this row?")) {
                setRowIdToDelete(rowId);
            }
        }

    }, []);
    const onDelete = async (id) => {
        if (!props.backPermissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deleteSkill", { data: payload });
            return data
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false
        }
    };
    const handleClick = (data) => {
        if (props.onSubmit === 'onSubmit' && !isSubmitting) {
            onSubmit(data);
        } else if (props.onSubmit === 'onUpdate' || isSubmitting) {
            Update(data)
        }
    };
    const onSubmit = async (data) => {
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
            const formData = { ...data };
            const result = rows?.map((row, index) => {
                const skill = formData[`skill-${index + 1}`];
                delete formData[`skill-${row.id}`];
                return { skill };
            });
            const newFormData = {
                ...formData,
                vendor_id: props.id,
            };
            if (result && result.length > 0) {
                newFormData['skills'] = result;
            }
            newFormData.started_working = newFormData.started_working.value
            // console.log(newFormData)
            try {
                const response = await axiosClient.post("AddExperience", newFormData);
                setData(response.data)
                basictoaster("successToast", "Added successfully !");
                setIsSubmitting(true)
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
                setIsSubmitting(false)
            } finally {
                setSub(false);
            }
        }

    }
    const Update = async (data) => {
        if (!props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!props.id) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            setSub(true);
            const formData = { ...data };
            const result = rows?.map((row, index) => {
                const skill = formData[`skill-${row.id}`];
                delete formData[`skill-${row.id}`];
                return { skill, id: row.idUpdate };
            });
            const newFormData = {
                ...formData,
                vendor_id: props.id,
                experience: expID
            };
            if (result && result.length > 0) {
                newFormData['skills'] = result;
            }
            newFormData.started_working = newFormData.started_working.value
            // console.log(newFormData)
            try {
                const response = await axiosClient.post("UpdateExperience", newFormData);
                basictoaster("successToast", "Updated successfully !");
                // setIsSubmitting(true)
                setRows([])
                setRows(response.data.skills.map((element, index) => {
                    setValue(`skill-${index + 1}`, element.skill_id);
                    handleSelectChange({ value: element.skill_id, label: element.name }, index + 1)
                    return {
                        id: index + 1,
                        idUpdate: element.id,
                        skill: { value: element.skill_id, label: element.name },
                    };
                }));

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
                setIsSubmitting(false)
            }finally {
                setSub(false);
            }
        }
    }

    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            if (key.startsWith("skill-")) {
                const skillId = key.split("-")[1];
                basictoaster("dangerToast", `Skill number ${skillId} is required`);
                return
            }
            switch (key) {
                case "started_working":
                    basictoaster("dangerToast", "Started working from year is required");
                    return;
                case "experience_year":
                    basictoaster("dangerToast", "experience year is required");
                    return;
                case "summary":
                    basictoaster("dangerToast", "Summary of Experience is required");
                    return;
                default:
                    break;
            }
        }
    }
    useEffect(() => {
        if (rowIdToDelete !== null) {
            unregister(`skill${rowIdToDelete}`);
            setRows((prevRows) => prevRows.filter(row => row.id !== rowIdToDelete));
            setRowIdToDelete(null);
        }
    }, [rowIdToDelete]);

    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>Experience</H5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        {loading2 ? (
                            <div className="loader-box">
                                <Spinner
                                    attrSpinner={{ className: "loader-6" }}
                                />
                            </div>
                        ) : (
                            <div>
                                <Row className="g-3 mb-3">
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">
                                            <Label
                                                className="col-sm-6 col-form-label"
                                                for="validationCustom01"
                                            >
                                                {(props.backPermissions?.add ==
                                                    1 ||
                                                    props.backPermissions
                                                        ?.edit == 1) && (
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>
                                                )}
                                                Started working from year :
                                            </Label>
                                            <Col sm="6">
                                                <Controller
                                                    name="started_working"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            options={
                                                                yearOptions
                                                            }
                                                            value={selectedYear}
                                                            className="js-example-basic-single col-sm-12"
                                                            onChange={(
                                                                option
                                                            ) => {
                                                                handleYearChange(
                                                                    option
                                                                );
                                                                field.onChange(
                                                                    option
                                                                );
                                                            }}
                                                            isDisabled={
                                                                props
                                                                    .backPermissions
                                                                    ?.add !=
                                                                    1 &&
                                                                props
                                                                    .backPermissions
                                                                    ?.edit != 1
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">
                                            <Label
                                                className="col-sm-4 col-form-label"
                                                for="validationCustom01"
                                            >
                                                {(props.backPermissions?.add ==
                                                    1 ||
                                                    props.backPermissions
                                                        ?.edit == 1) && (
                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontSize: "18px",
                                                        }}
                                                    >
                                                        *
                                                    </span>
                                                )}
                                                Experience year :
                                            </Label>
                                            <Col sm="6">
                                                <input
                                                    readOnly
                                                    defaultValue={
                                                        experienceYears
                                                    }
                                                    className="form-control"
                                                    type="text"
                                                    name="experience_year"
                                                    onChange={() => {
                                                        return false;
                                                    }}
                                                    {...register(
                                                        "experience_year",
                                                        { required: true }
                                                    )}
                                                    placeholder="experience year"
                                                    disabled={
                                                        props.backPermissions
                                                            ?.add != 1 &&
                                                        props.backPermissions
                                                            ?.edit != 1
                                                    }
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md="12" className="mb-3">
                                        <FormGroup className="row">
                                            <Label
                                                className="col-sm-2 col-form-label"
                                                for="validationCustom01"
                                            >
                                                Summary of Experience:
                                            </Label>
                                            <Col sm="10">
                                                {props.backPermissions?.add ==
                                                    1 ||
                                                props.backPermissions?.edit ==
                                                    1 ? (
                                                    <>
                                                        {" "}
                                                        <CKEditor
                                                            editor={
                                                                ClassicEditor
                                                            }
                                                            data={
                                                                props.Experience
                                                                    ?.Experience
                                                                    ?.summary
                                                            }
                                                            onChange={(
                                                                event,
                                                                editor
                                                            ) => {
                                                                const data =
                                                                    editor.getData();
                                                                setValue(
                                                                    "summary",
                                                                    data
                                                                );
                                                            }}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            disabled
                                                            {...register(
                                                                "summary",
                                                                {
                                                                    required: false,
                                                                }
                                                            )}
                                                        />
                                                    </>
                                                ) : (
                                                    <p
                                                        dangerouslySetInnerHTML={{
                                                            __html: props
                                                                .Experience
                                                                ?.Experience
                                                                ?.summary,
                                                        }}
                                                    />
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Label
                                    className="form-label"
                                    for="validationCustom01"
                                >
                                    Skills
                                </Label>
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                style={{ width: "10%" }}
                                            >
                                                {"#"}
                                            </th>
                                            <th scope="col">{"Skill"}</th>
                                            {(props.backPermissions?.add == 1 ||
                                                props.backPermissions?.edit ==
                                                    1) && (
                                                <th
                                                    style={{ width: "10%" }}
                                                    scope="col"
                                                    onClick={addRow}
                                                >
                                                    <Btn
                                                        attrBtn={{
                                                            color: "btn btn-light",
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-circle"></i>
                                                    </Btn>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={row.id}>
                                                <td>{index + 1}</td>
                                                {props.backPermissions?.add ==
                                                    1 ||
                                                props.backPermissions?.edit ==
                                                    1 ? (
                                                    <>
                                                        <td>
                                                            <Controller
                                                                name={`skill-${row.id}`}
                                                                control={
                                                                    control
                                                                }
                                                                rules={{
                                                                    required: true,
                                                                }}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <CreatableSelect
                                                                        {...field}
                                                                        value={
                                                                            selectedOptions[
                                                                                row
                                                                                    .id
                                                                            ] ||
                                                                            null
                                                                        }
                                                                        options={
                                                                            optionsN
                                                                        }
                                                                        onInputChange={(
                                                                            inputValue
                                                                        ) =>
                                                                            handleInputChange(
                                                                                inputValue,
                                                                                "skills",
                                                                                `skill`,
                                                                                setOptionsN,
                                                                                optionsN
                                                                            )
                                                                        }
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
                                                                            handleSelectChange(
                                                                                option,
                                                                                row.id
                                                                            );
                                                                            field.onChange(
                                                                                option.value
                                                                            );
                                                                        }}
                                                                        isValidNewOption={(
                                                                            inputValue
                                                                        ) =>
                                                                            inputValue.trim() !==
                                                                            ""
                                                                        }
                                                                        formatCreateLabel={(
                                                                            inputValue
                                                                        ) =>
                                                                            `Add "${inputValue}"`
                                                                        }
                                                                        onCreateOption={(
                                                                            inputValue
                                                                        ) => {
                                                                            const newOption =
                                                                                {
                                                                                    value: inputValue,
                                                                                    label: inputValue,
                                                                                };
                                                                            setOptionsN(
                                                                                [
                                                                                    ...optionsN,
                                                                                    newOption,
                                                                                ]
                                                                            );
                                                                            handleSelectChange(
                                                                                newOption,
                                                                                row.id
                                                                            );
                                                                            field.onChange(
                                                                                inputValue
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </td>
                                                        <td
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                deleteRow(
                                                                    row.id,
                                                                    row.idUpdate
                                                                );
                                                            }}
                                                        >
                                                            <Btn
                                                                attrBtn={{
                                                                    color: "btn btn-danger",
                                                                }}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </Btn>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td>{row.skill.label}</td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {(props.backPermissions?.add == 1 ||
                                    props.backPermissions?.edit == 1) && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            marginTop: "2%",
                                        }}
                                    >
                                        <Btn
                                            attrBtn={{
                                                color: "primary",
                                                disabled: Sub,
                                                onClick: handleSubmit(
                                                    handleClick,
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
                                )}
                            </div>
                        )}
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Experience;
