import React, { Fragment, useState, useEffect } from 'react';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, Button, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';

const Search = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    const [options, setOptions] = useState([]);
    const [data, setData] = useState({});

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setData(null);
        }
    }
    const capitalizeWords = (str) => {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
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
    useEffect(() => { 
        props.getQu(data)
    },[data])
    useEffect(() => {
        if (props.fields && props.fields.length > 0) {
            const fieldOptions = props.fields.map(fieldObj => ({
                value: fieldObj.name,
                label: fieldObj.label || fieldObj.name,
            }));
            setOptions(fieldOptions);
        }
    }, [props.fields]);
    const sub = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = formData.getAll(key);
        }
        setData(data)
    }
    const addBtn = (event, divID) => {
        event.preventDefault();
        const div = document.querySelector(["." + divID]);
        const container = document.getElementById(divID);
        container.appendChild(div.cloneNode(true));
        document.querySelector(["." + divID + ":last-child"]).value = '';
    };
    const delBtn = (event, divID) => {
        event.preventDefault();
        var divLength = document.querySelectorAll(["." + divID]).length;
        var div = document.querySelector(['#' + divID + " ." + divID + ":last-child"]);
        if (divLength > 1)
            div && div.remove();
    };
    return (
        <Fragment >
            <Col>
                <Card>
                    <CardHeader
                        className="pb-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer', paddingBottom: '25px' }}>
                        <H5>Search</H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields: </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                            </div>
                            <form onSubmit={sub}>

                            <div className="" style={{ display: "flex" }}>
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
                                        const isSelected = selectedSearchCol.includes(fieldObj.name);
                                        if (!isSelected) {
                                            return null;
                                        }
                                        return (
                                            <Col key={index} md="4" >
                                                {fieldObj.field === "selec" && fieldObj.tableData && (
                                                    <Col md="11">
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor={fieldObj.label}>
                                                                {capitalizeWords(fieldObj.label)}
                                                            </Label>
                                                            <Controller
                                                                name={fieldObj.name}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        isMulti
                                                                        options={options}
                                                                        value={selectedOption}
                                                                        onInputChange={handleInputChange}
                                                                        className="js-example-basic-multiple mb-1"
                                                                        isSearchable
                                                                        noOptionsMessage={() =>
                                                                            loading ? (
                                                                                <div className="loader-box">
                                                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                                                </div>
                                                                            ) : 'No options found'
                                                                        }
                                                                        onChange={(option) => {
                                                                            setSelectedOption(option);
                                                                            field.onChange(option.value);
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                                {fieldObj.field === "selec" && fieldObj.static && (
                                                    <Col md="11">
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor={fieldObj.label}>
                                                                {capitalizeWords(fieldObj.label)}
                                                            </Label>
                                                            <Controller
                                                                name={fieldObj.name}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        isMulti
                                                                        options={fieldObj.static}
                                                                        value={selectedOption}
                                                                        className="js-example-basic-multiple mb-1"
                                                                        isSearchable
                                                                        onChange={(option) => {
                                                                            setSelectedOption(option);
                                                                            field.onChange(option.value);
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                                {fieldObj.field === "input" && (
                                                    <Col md="11" className='mb-3' >
                                                        <FormGroup id={`prefix-${fieldObj.name}`}>
                                                            <Label className="col-form-label-sm f-12" htmlFor={fieldObj.name}>
                                                                {capitalizeWords(fieldObj.label)}
                                                                <Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, `prefix-${fieldObj.name}`) }}><i className="fa fa-plus-circle"></i></Btn>
                                                                <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, `prefix-${fieldObj.name}`) }}><i className="fa fa-minus-circle"></i></Btn>
                                                            </Label>

                                                            <input style={{ marginBottom: '20px' }}
                                                                className={`form-control prefix-${fieldObj.name}`}
                                                                id={fieldObj.name}
                                                                type={fieldObj.type}
                                                                name={fieldObj.name}
                                                                {...register(fieldObj.name, { required: true })}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                                {errors[fieldObj.name] && (
                                                    <Col md="3">
                                                        <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                                                            {fieldObj.name} is required
                                                        </span>
                                                    </Col>
                                                )}
                                            </Col>

                                        );
                                    })
                                ) : null}

                            </div>
                            <Row>
                                <Col>
                                    <div className="d-inline">
                                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit' }}><i className="fa fa-search me-1"></i> Search</Btn>
                                    </div>
                                </Col>
                                </Row>
                                </form>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
        </Fragment>
    )
}
export default Search