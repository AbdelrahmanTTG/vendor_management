import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Col, Label, Row, FormGroup } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';
import _ from 'lodash';

const EditBtn = (props) => {
    const [modal, setModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [initialOptions, setInitialOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [selectedOption, setSelectedOption] = useState({});

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
    const toggle = () => setModal(!modal);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    useEffect(() => {
        if (props.selectedRow) {
            const { id, ...rest } = props.selectedRow;
            setOriginalData(rest);

            const finalData = { ...rest };

            props.fields.forEach(fieldObj => {
                if (fieldObj.static) {
                    const activeStatus = props.selectedRow.Active == 0
                        ? { value: 0, label: 'Inactive' }
                        : { value: 1, label: 'Active' };

                    setValue(fieldObj.name, activeStatus);
                    setSelectedOption(prev => ({ ...prev, [fieldObj.name]: activeStatus }));

                    finalData[fieldObj.name] = activeStatus;
                }

                if (fieldObj.tableData) {
                    const initialValue = {
                        value: props.selectedRow[fieldObj.name]?.id || '',
                        label: props.selectedRow[fieldObj.name]?.name || ''
                    };

                    setValue(fieldObj.name, initialValue);
                    setSelectedOption(prev => ({ ...prev, [fieldObj.name]: initialValue }));

                    finalData[fieldObj.name] = initialValue;
                }
            });

            setOriginalData(finalData)

        }
    }, [props.selectedRow, setValue]);



    const capitalizeWords = (str) => {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const hasDataChanged = (formData) => {
        return !_.isEqual(originalData, formData);
    };
    const onSubmit = async (form) => {

        if (form !== '') {
            if (hasDataChanged(form)) {
                try {
                    const formData = {
                        ...Object.keys(form).reduce((acc, key) => {
                            const value = form[key];
                            if (value && typeof value === 'object' && value.value !== undefined) {
                                acc[key] = value.value;
                            } else {
                                acc[key] = value;
                            }

                            return acc;
                        }, {}),
                        id: props.selectedRow.id,
                        table: props.dataTable
                    };

                    const { data } = await axiosClient.post("updateeData", formData);
                    props.onUpdateData(data);
                    toggle();
                    basictoaster("successToast", `Updated successfully`);
                } catch (err) {
                    const response = err.response;
                    if (response && response.data) {
                        setErrorMessage(response.data.message || "An unexpected error occurred.");
                    } else {
                        setErrorMessage("An unexpected error occurred.");
                    }
                    basictoaster("dangerToast", response.data.message);
                }
            } else {
                basictoaster("dangerToast", "No changes were made.");
            }
        } else {
            errors.showMessages();
        }
    };
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return;
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
                label: item.name,
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

    return (
        <Fragment>
            <button onClick={toggle} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                <i className="icofont icofont-ui-edit"></i>
            </button>

            <CommonModal isOpen={modal} title={props.titelModel} toggler={toggle} onSave={handleSubmit(onSubmit)}>

                <Row className="g-0">
                    <Col>
                        {props.fields ? (
                            props.fields.map((fieldObj, index) => {
                                const [options, setOptions] = useState([]);
                                const initialValue = selectedOption[fieldObj.name] || (() => {
                                    const value = props.selectedRow[fieldObj.name];
                                    if (typeof value === 'object' && value !== null) {
                                        return {
                                            value: value.id || '',
                                            label: value.name || ''
                                        };
                                    }

                                    return value || '';
                                })();

                                useEffect(() => {
                                    if (fieldObj.tableData) {
                                        handelingSelect(fieldObj.tableData, setOptions, fieldObj.name);
                                    }
                                }, [fieldObj.tableData]);

                                const handleInputChange = (inputValue) => {
                                    if (inputValue.length === 0) {
                                        setOptions(initialOptions[fieldObj.name] || []);
                                    } else if (inputValue.length >= 1) {
                                        const existingOption = options.some(option =>
                                            option.label.toLowerCase().includes(inputValue.toLowerCase())
                                        );
                                        if (!existingOption) {
                                            setLoading(true);
                                            handelingSelect(fieldObj.tableData, setOptions, fieldObj.name, inputValue);
                                        }
                                    }
                                };

                                return (
                                    <div key={index}>
                                        <FormGroup className="row">
                                            <Label className="col-sm-3 col-form-label" htmlFor={fieldObj.label}>
                                                {capitalizeWords(fieldObj.label)}
                                            </Label>
                                            <Col sm="9">
                                                {fieldObj.field === "selec" && fieldObj.tableData && (
                                                    <Controller
                                                        name={fieldObj.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={initialValue}
                                                                options={options}
                                                                onInputChange={handleInputChange}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                noOptionsMessage={() => loading ? <div className="loader-box">
                                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                                </div> : 'No options found'}
                                                                onChange={(option) => {
                                                                    setSelectedOption(prev => ({ ...prev, [fieldObj.name]: option }));
                                                                    field.onChange(option);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                {fieldObj.field === "selec" && fieldObj.static && (
                                                    <Controller
                                                        name={fieldObj.name}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                value={initialValue}
                                                                options={fieldObj.static}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                onChange={(option) => {
                                                                    setSelectedOption(prev => ({ ...prev, [fieldObj.name]: option }));
                                                                    field.onChange(option);
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                {fieldObj.field === "input" && (
                                                    <input
                                                        className="form-control"
                                                        id={fieldObj.name}
                                                        type={fieldObj.type}
                                                        name={fieldObj.name}
                                                        defaultValue={initialValue}
                                                        {...register(fieldObj.name, { required: true })}
                                                    />
                                                )}
                                            </Col>
                                            {errors[fieldObj.name] && (
                                                <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                                                    {fieldObj.name} is required
                                                </span>
                                            )}
                                        </FormGroup>
                                    </div>
                                );
                            })
                        ) : null}
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    );
};

export default EditBtn;
