import React, { Fragment, useState, useEffect } from 'react';
import { Btn, H5, Spinner } from '../../../AbstractElements';
import CommonModal from '../../../pages/VM/Model';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, Button, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../pages/AxiosClint";
import { toast } from 'react-toastify';

const Search = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    // const [options, setOptions] = useState([]);
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
    }, [data])
    const options = [

        { value: 'Alias', label: 'Alias name' },
        { value: 'email', label: 'Alias email' },
        { value: 'users', label: 'User email' },


    ];

    const sub = (event) => {
        
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = formData.getAll(key);
        }
        // console.log(data)
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
                        <CardBody className='p-t-0'>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields:   </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                            </div>
                            <div className="search-panel">
                                {selectedSearchCol.length > 0 &&
                                    <form onSubmit={sub}>
                                        <Row className="pb-3">
                                            {selectedSearchCol.indexOf("Alias") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='nameInput'>
                                                        <Label className="col-form-label-sm f-12">{'Alias name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm nameInput mb-1' type='text' name='name' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {selectedSearchCol.indexOf("email") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='emailInput'>
                                                        <Label className="col-form-label-sm f-12">{'Alias email'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'emailInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'emailInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm emailInput mb-1' type='email' name='email' required />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {selectedSearchCol.indexOf("users") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='usersInput'>
                                                        <Label className="col-form-label-sm f-12">{'User email'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'usersInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'usersInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm usersInput mb-1' type='email' name='users' required />
                                                    </FormGroup>
                                                </Col>
                                            }

                                        </Row>
                                        <Row className='b-t-primary p-t-20'>
                                            <Col>
                                                <div className="d-inline">
                                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit' }}><i className="fa fa-search me-1"></i> Search</Btn>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                }
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
        </Fragment>
    )
}
export default Search