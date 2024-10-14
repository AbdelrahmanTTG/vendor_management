import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Col, Label, Row, FormGroup } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';

const AddNewBtn = (props) => {
    const [modal, setModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [initialOptions, setInitialOptions] = useState({});
    const [loading, setLoading] = useState(false);
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
                break;
        }
    };
    const toggle = () => setModal(!modal);
    const { control, register, handleSubmit, reset , formState: { errors } } = useForm();

    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    const onSubmit = async (form) => {
       
        if (form !== '') {
            try {
                const formData = {
                    ...form, 
                    table: props.dataTable
                };
                const { data } = await axiosClient.post("SubmetData", formData);
                props.onAddData(data);
                toggle();
                basictoaster("successToast", `Added successfully`)
                reset()
                const inputs = document.getElementsByClassName("form-control");
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    setErrorMessage(response.data.message || "An unexpected error occurred.");
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
                basictoaster("dangerToast", response.data.message)

            }

        } else {
            errors.showMessages();
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
            <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: toggle }} className="me-2">{props.nameBtm}</Btn>
            <CommonModal isOpen={modal} title={props.titelModel} toggler={toggle} onSave={handleSubmit(onSubmit)}>

                <Row className="g-0">
                    <Col>
                        {props.fields ? (
                            props.fields.map((fieldObj, index) => {
                                const [options, setOptions] = useState([]);
                                const [selectedOption, setSelectedOption] = useState(null);

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
                                            <Label className="col-sm-3 col-form-label" htmlFor={fieldObj.name}>
                                                {capitalizeWords(fieldObj.name)}
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
                                                                value={selectedOption} 
                                                                options={options}
                                                                onInputChange={handleInputChange}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                noOptionsMessage={() => loading ? <div className="loader-box">
                                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                                </div> : 'No options found'}
                                                                onChange={(option) => {   
                                                                    setSelectedOption(option); 
                                                                    field.onChange(option.value);    
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
                                                                value={selectedOption} 
                                                                options={fieldObj.static}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                onChange={(option) => {
                                                                    setSelectedOption(option);     
                                                                    field.onChange(option.value);
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

export default AddNewBtn;
