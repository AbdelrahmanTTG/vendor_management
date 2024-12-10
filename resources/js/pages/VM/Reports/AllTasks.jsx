import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import { toast } from 'react-toastify';


const Report = () => {
    const [Tasks, setTasks] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsU, setOptionsU] = useState([]);
    const [optionsB, setOptionsB] = useState([]);
    const [optionsSL, setOptionsSL] = useState([]);
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsV, setOptionsV] = useState([]);
    const [optionsTY, setOptionsTY] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});
    const [queryParams, setQueryParams] = useState(null);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    // start search
    const handelingSelectUsers = async () => {
        try {
            const { data } = await axiosClient.post("getPmData");
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.user_name,
            }));
            setOptionsU(formattedOptions);
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrorMessage(response.data.errors);
            } else if (response && response.status === 401) {
                setErrorMessage(response.data.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }

    };
    const handleInputChange = (inputValue, tableName, fieldName, setOptions, options) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return
        try {
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
        }

    };

    useEffect(() => {
        handelingSelect("task_type", setOptionsTY, "task_type");
        handelingSelect("languages", setOptionsSL, "source_lang");
        handelingSelect("languages", setOptionsTL, "target_lang");
        handelingSelect("vendors", setOptionsV, "vendor");
        handelingSelect("brand", setOptionsB, "brand");
        handelingSelectUsers();
    }, []);

    const options = [
        { value: 'brand', label: 'Brand' },
        { value: 'code', label: 'Task Code' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'task_type', label: 'Task Type' },
        { value: 'status', label: 'Status' },
        { value: 'source_lang', label: 'Source Language' },
        { value: 'target_lang', label: 'Target Language' },
        { value: 'created_by', label: 'Created By' },
        { value: 'date', label: 'Date' },

    ];
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }
    const searchTasks = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let keyValue of formData.entries()) {
            if (keyValue[0] == 'start_date' || keyValue[0] == 'end_date')
                data[keyValue[0]] = formData.get(keyValue[0]);
            else
                data[keyValue[0]] = formData.getAll(keyValue[0]);
        }
        setQueryParams(data);
        setCurrentPage(1);
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
    // end search

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
            };
            try {
                setLoading(true);
                await axiosClient.post("allTasks", payload)
                    .then(({ data }) => {
                        if (data.type == 'error') {
                            toast.error(data.message);
                        } else {
                            setTasks(data?.Tasks);
                            setPageLinks(data?.Links);
                        }
                        setLoading(false);
                    });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [currentPage, queryParams]);

    const handlePageChange = (newPage) => {
        let tempPage = currentPage;
        if (newPage > 0) {
            tempPage = newPage;
        }
        setCurrentPage(tempPage);
    };

    return (
        <Fragment >
            <Col>
                <Card className="m-b-10">
                    <CardHeader
                        className=" py-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer' }}                    >
                        <H5>Filter </H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '20px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody className='p-t-0'>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields:   </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                            </div>
                            <div className="search-panel">
                                {selectedSearchCol.length > 0 &&
                                    <form onSubmit={searchTasks}>
                                        <Row className="pb-3">
                                            {selectedSearchCol.indexOf("code") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup id='codeInput'>
                                                        <Label className="col-form-label-sm f-12">{'Task Code'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'codeInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'codeInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm codeInput mb-1' type='text' name='code' placeholder='Enter Task Code...' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("vendor") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Vendor'}</Label>
                                                        <Select name='vendor' id='vendor' required
                                                            options={optionsV} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "vendors", "vendor", setOptionsV, optionsV)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("task_type") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Task Type'}</Label>
                                                        <Select id='task_type' required
                                                            name='task_type'
                                                            options={optionsV} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "task_type", "task_type", setOptionsTY, optionsTY)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("status") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Status'}</Label>
                                                        <Select id='status' required
                                                            name='status'
                                                            options={
                                                                [
                                                                    { value: '0', label: "In Progress" },
                                                                    { value: '1', label: "Delivered" },
                                                                    { value: '2', label: "Cancelled" },
                                                                    { value: '3', label: "Rejected" },
                                                                    { value: '4', label: "Waiting Vendor Confirmation" },
                                                                    { value: '5', label: "Waiting PM Confirmation", },
                                                                    { value: '7', label: "Heads-Up " },
                                                                    { value: '8', label: "Heads-Up ( Marked as Available )" },
                                                                    { value: '9', label: "Heads-Up ( Marked as Not Available )" },
                                                                ]} className="js-example-basic-multiple mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("source_lang") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Source Language'}</Label>
                                                        <Select name='job.priceList.source' id='source_lang' required
                                                            options={optionsSL} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "source_lang", setOptionsSL, optionsSL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("target_lang") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Target Language'}</Label>
                                                        <Select name='job.priceList.target' id='target_lang' required
                                                            options={optionsTL} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "target_lang", setOptionsTL, optionsTL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("created_by") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Created by'}</Label>
                                                        <Select name='created_by' id='created_by' required
                                                            options={optionsU} className="js-example-basic-single "
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("brand") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Brand'}</Label>
                                                        <Select id='brand' required
                                                            name='user.brand'
                                                            options={optionsB} className="js-example-basic-single "
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("date") > -1 &&
                                                <>
                                                    <Col md='4'>
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12" >{'Date From'}</Label>
                                                            <Input className='form-control digits' type='date' defaultValue='' name='start_date' required />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md='4'>
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12" >{'Date To'}</Label>
                                                            <Input className='form-control digits' type='date' defaultValue='' name='end_date' required />
                                                        </FormGroup>
                                                    </Col>
                                                </>
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
            <Col sm="12">
                <Card>
                    <CardBody className='pt-0 px-3'>
                        <div className="table-responsive">
                            {loading ? (
                                <div className="loader-box" >
                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                            ) :
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th scope="col">{'Code'}</th>
                                            <th scope="col">{'Subject'}</th>
                                            <th scope="col">{'Task Type'}</th>
                                            <th scope="col">{'Vendor'}</th>
                                            <th scope="col">{'Source'}</th>
                                            <th scope="col">{'Target'}</th>
                                            <th scope="col">{'Count'}</th>
                                            <th scope="col">{'Unit'}</th>
                                            <th scope="col">{'Rate'}</th>
                                            <th scope="col">{'Total Cost'}</th>
                                            <th scope="col">{'Currency'}</th>
                                            <th scope="col">{'Start Date'}</th>
                                            <th scope="col">{'Delivery Date'}</th>
                                            <th scope="col">{'Status'}</th>
                                            <th scope="col">{'Closed Date'}</th>
                                            <th scope="col">{'Created by'}</th>
                                            <th scope="col">{'Created at'}</th>
                                            <th scope="col">{'Brand'}</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Tasks.length > 0 ? (
                                            <>
                                                {Tasks.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.code}</td>
                                                        <td>{item.subject}</td>
                                                        <td>{item.task_type}</td>
                                                        <td>{item.vendor}</td>
                                                        <td>{item.jobPrice?.source_name}</td>
                                                        <td>{item.jobPrice?.target_name}</td>
                                                        <td>{item.count}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.rate}</td>
                                                        <td>{item.total_cost}</td>
                                                        <td>{item.currency}</td>
                                                        <td>{item.start_date}</td>
                                                        <td>{item.delivery_date}</td>
                                                        <td><span className='badge badge-info p-2'>{item.statusData.replace('Your', 'Vendor')}</span></td>
                                                        <td>{item.closed_date}</td>
                                                        <td>{item.created_by}</td>
                                                        <td>{item.created_at}</td>
                                                        <td>{item.brandName}</td>

                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={18} className='text-center bg-light f-14' >{'No Data Available'}</td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </Table>
                            }
                        </div>
                        {pageLinks && pageLinks.length > 3 && (
                            <div className="mt-5 ">
                                <Pagination aria-label="Page navigation example" className="pagination justify-content-end pagination-primary">
                                    {pageLinks.map((link, i) => (
                                        <PaginationItem key={i} active={link.active} className={`${link.url ? "" : "disabled"}`} onClick={() => handlePageChange(link.url ? link.url.split('page=').pop() : 0)}>
                                            <PaginationLink dangerouslySetInnerHTML={{ __html: link.label }} ></PaginationLink>
                                        </PaginationItem>

                                    ))}
                                </Pagination>
                            </div>)}
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Report;