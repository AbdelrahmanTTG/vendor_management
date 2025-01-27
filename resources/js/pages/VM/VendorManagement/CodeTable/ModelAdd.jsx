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
    const { control, register, handleSubmit, reset , formState: { errors } } = useForm();
    const resetForm = () => {
        setSelectedOptions({});
    };
    const capitalizeWords = (str) => {
        if (!str) return '';
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
                resetForm()
                const inputs = document.getElementsByClassName("inp");
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
                props.onAddData(data);
                toggle();
                basictoaster("successToast", `Added successfully`)
                reset()
               
            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    setErrorMessage(response.data.message || "An unexpected error occurred.");
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
                // console.log(err)
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
    const [selectedOptions, setSelectedOptions] = useState({});
    const handleSelectChange = (name, option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [name]: option 
        }));
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
                                // const [selectedOption, setSelectedOption] = useState(null);

                                // useEffect(() => {
                                //     if (fieldObj.tableData) {
                                //         handelingSelect(fieldObj.tableData, setOptions, fieldObj.name);
                                //     }
                                // }, [fieldObj.tableData]);

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
                                                                value={selectedOptions[fieldObj.name] || null}                                                                options={options}
                                                                onInputChange={handleInputChange}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                noOptionsMessage={() => loading ? <div className="loader-box">
                                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                                </div> : 'No options found'}
                                                                onChange={(option) => {   
                                                                    handleSelectChange(fieldObj.name, option);
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
                                                                value={selectedOptions[fieldObj.name] || null} 
                                                                options={fieldObj.static}
                                                                className="js-example-basic-single col-sm-12"
                                                                isSearchable
                                                                onChange={(option) => {
                                                                    handleSelectChange(fieldObj.name, option);
                                                                    field.onChange(option.value);
                                                                }}
                                                            />
                                                        )}
                                                    />

                                                )}
                                                {fieldObj.field === "input" && (
                                                    <input
                                                        className="form-control inp"
                                                        id={fieldObj.name}
                                                        type={fieldObj.type}
                                                        name={fieldObj.name}
                                                    defaultValue=""
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
