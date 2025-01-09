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

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        // if (values.length == 0) {
        //     setQueryParams(null);
        // }
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
        if (props.fields && props.fields.length > 0) {
            const fieldOptions = props.fields.map(fieldObj => ({
                value: fieldObj.name,
                label: fieldObj.label || fieldObj.name,
            }));
            setOptions(fieldOptions);
        }
    }, [props.fields]);
    const sub = (data) => {
        console.log(data)
    }
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
                            <div className="">
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
                                                                        isMulti
                                                                        value={selectedOption}
                                                                        options={options}
                                                                        onInputChange={handleInputChange}
                                                                        className="js-example-basic-single col-sm-12"
                                                                        isSearchable
                                                                        noOptionsMessage={() => loading ?
                                                                            <div className="loader-box">
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
                                                                        isMulti
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
                                <Row>
                                    <Col>
                                        <div className="d-inline">
                                            <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit', onClick: handleSubmit(sub) }}><i className="fa fa-search me-1"></i> Search</Btn>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
        </Fragment>
    )
}
export default Search