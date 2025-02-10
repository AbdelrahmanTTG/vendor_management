import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import FormatTable from "../Format";
const VPOs = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [VPOs, setVPOs] = useState([]);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [optionsU, setOptionsU] = useState([]);
    const [optionsV, setOptionsV] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});
    const [optionsSL, setOptionsSL] = useState([]);

    const options = [
        { value: 'code', label: 'P.o number' },
        { value: 'payment_status', label: 'Payment status' },
        { value: 'status', label: 'VPO status' },
        { value: 'user_name', label: 'PM name' },
        { value: 'closed_date', label: 'VPO date' },
        { value: 'po_verified', label: 'CPO verified' },
        { value: 'po_verified_at', label: 'CPO verified date' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'source_lang', label: 'Source Language' },

    ];
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
    const handleFormatsChanged = () => {
        setFormatsChanged(!formatsChanged)
    }
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            // sortBy: sortConfig.key,
            // sortDirection: sortConfig.direction,
            table: "VPOS",
            export: ex,
            view: props.permissions?.view

        };
        try {
            setLoading(true);
            await axiosClient.post("VPOS", payload)
                .then(({ data }) => {
                    console.log(data)
                    setFields(data?.fields);
                    setPageLinks(data?.Links);
                    setVPOs(data?.data?.data)
                    setFormats(data?.formats);

                    setLoading(false);
                });
        } catch (err) {
            console.error(err);
        }
    });
    const handlePageChange = (newPage) => {
        let tempPage = currentPage;
        if (newPage > 0) {
            tempPage = newPage;
        }
        setCurrentPage(tempPage);
    };
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }
    useEffect(() => {
        fetchData();
    }, [currentPage, formatsChanged, queryParams]);
    const formatString = (input) => {
        if (!input || typeof input !== 'string') return '';
        return input.replace('_name', '')
            .split(/[_-]/)
            .map(word => word.toUpperCase())
            .join(' ');
    };
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
    useEffect(() => {
        handelingSelectUsers();
    }, []);
    const vpo_status = [
        "Running",
        "Delivered",
        "Cancelled",
        "Rejected",
        "Waiting Vendor Acceptance",
        "Waiting PM Confirmation",
        "Not Started Yet",
        "Heads Up",
        "Heads Up ( Marked as Available )",
        "Heads Up ( Marked as Not Available )"];
    const searchVPOs = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let keyValue of formData.entries()) {
            if (keyValue[0] === "closed_date_from" || keyValue[0] === "closed_date_to") {
                if (!data["closed_date"]) {
                    data["closed_date"] = [];
                }
                data["closed_date"].push(keyValue[1]);
            } else if (keyValue[0] === "po_verified_at_from" || keyValue[0] === "po_verified_at_to") {
                if (!data["po_verified_at"]) {
                    data["po_verified_at"] = [];
                }
                data["po_verified_at"].push(keyValue[1]);
            }
            else {
                data[keyValue[0]] = formData.getAll(keyValue[0]);
            }
        }

        console.log(data)

        setQueryParams(data);
        setCurrentPage(1);
    }
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
                value: item.name,
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
                                    <form onSubmit={searchVPOs}>
                                        <Row className="pb-3">
                                            {selectedSearchCol.indexOf("code") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup id='codeInput'>
                                                        <Label className="col-form-label-sm f-12">{'P.o number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'codeInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'codeInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm codeInput mb-1' type='text' name='code' placeholder='Enter Task Code...' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("payment_status") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Payment status'}</Label>
                                                        <Select id='payment_status' required
                                                            name='payment_status'
                                                            options={
                                                                [
                                                                    { value: '1', label: "Paid" },
                                                                    { value: '2', label: "Unpaid" },
                                                                ]} className="js-example-basic-multiple mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("status") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'VPO status'}</Label>
                                                        <Select id='status' required
                                                            name='status'
                                                            options={
                                                                [
                                                                    { value: '0', label: "Running" },
                                                                    { value: '1', label: "Delivered" },
                                                                    { value: '2', label: "Cancelled" },
                                                                    { value: '3', label: "Rejected" },
                                                                    { value: '4', label: "Waiting Vendor Acceptance" },
                                                                    { value: '5', label: "Waiting PM Confirmation" },
                                                                    { value: '6', label: "Not Started Yet" },
                                                                    { value: '7', label: "Heads Up" },
                                                                    { value: '8', label: "Heads Up ( Marked as Available )" },
                                                                    { value: '9', label: "Heads Up ( Marked as Not Available )" },

                                                                ]} className="js-example-basic-multiple mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("user_name") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Created by'}</Label>
                                                        <Select name='user_name' id='user_name' required
                                                            options={optionsU} className="js-example-basic-single "
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }   {
                                                selectedSearchCol.indexOf("closed_date") > -1 &&
                                                <>
                                                    <Row>
                                                        <Col md='12'>
                                                            <Label className="col-form-label-sm f-14 font-weight-bold">{'VPO date range'}</Label>
                                                        </Col>
                                                    </Row>
                                                    <Row>

                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12" >{'Date From'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='closed_date_from' required />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12" >{'Date To'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='closed_date_to' required />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </>
                                            }{
                                                selectedSearchCol.indexOf("po_verified") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'CPO verified'}</Label>
                                                        <Select id='po_verified' required
                                                            name='po_verified'
                                                            options={
                                                                [
                                                                    { value: '1', label: "Verified" },
                                                                ]} className="js-example-basic-multiple mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("po_verified_at") > -1 &&
                                                <>
                                                    <Row>
                                                        <Col md='12'>
                                                            <Label className="col-form-label-sm f-14 font-weight-bold">{'CPO verified date range'}</Label>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12">{'Date From'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='po_verified_at_from' required />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12">{'Date To'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='po_verified_at_to' required />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </>

                                            }
                                            {
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
                                            }
                                            {
                                                selectedSearchCol.indexOf("source_lang") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Source Language'}</Label>
                                                            <Select name='source_lang' id='source_lang' required
                                                            options={optionsSL} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "source_lang", setOptionsSL, optionsSL)
                                                            }
                                                            isMulti />
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
            <Col sm="12">
                <Card>
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center py-3">
                        <div className="w-100 text-end">
                            <ButtonGroup >
                                <FormatTable title="Add VPOS table formatting"
                                    Columns={[
                                        { value: 'payment_status', label: '#' },
                                        { value: 'user_name', label: 'PM Name' },
                                        { value: 'code', label: 'P.O Number' },
                                        { value: 'status', label: 'VPO Status' },
                                        { value: 'closed_date', label: 'VPO Date' },
                                        { value: 'vpo_file', label: 'VPO File' },
                                        { value: 'po_verified', label: 'CPO Verified' },
                                        { value: 'po_verified_at', label: 'CPO Verified Date' },
                                        { value: 'vendor_name', label: 'Vendor Name' },
                                        { value: 'source_lang', label: 'Source Language' },
                                        { value: 'target_lang', label: 'Target Language' },
                                        { value: 'task_type_name', label: 'Task Type' },
                                        { value: 'count', label: 'Count' },
                                        { value: 'unit_name', label: 'Unit' },
                                        { value: 'rate', label: 'Rate' },
                                        { value: 'currency_name', label: 'Currency' },
                                        { value: 'totalamount', label: 'P.O Amount' },
                                        { value: 'verifiedStat', label: 'Invoice Status' },
                                        { value: 'invoice_dated', label: 'Invoice Date' },
                                        { value: 'date45', label: 'Due Date (45 Days)' },
                                        { value: 'date60', label: 'Max Due Date (60 Days)' },
                                        { value: 'PaidStat', label: 'Payment Status' },
                                        { value: 'payment_date', label: 'Payment Date' },
                                        { value: 'payment_method_name', label: 'Payment Method' },
                                        { value: 'portalStat', label: 'System' },


                                    ]} table="VPOS"
                                    formats={formats} FormatsChanged={handleFormatsChanged}
                                />
                                {/* <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: EX }}  >Export to Excel</Btn> */}

                            </ButtonGroup>

                        </div>
                    </CardHeader>
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
                                            {fields.map((field, fieldIndex) => (
                                                <th key={fieldIndex} onClick={() => handleSort(field)}>
                                                    {formatString(field[0])}

                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {VPOs.length > 0 ? (
                                            <>
                                                {VPOs.map((item, index) => (
                                                    <tr key={index}>
                                                        {fields.map((field, fieldIndex) => {
                                                            let value = item[field[1]];

                                                            if (field[1] === "status") {
                                                                value = vpo_status?.[item[field[1]]];
                                                            } else if (field[1] === "payment_status") {
                                                                value = item[field[1]] == "1" ? "✅" : "❌";
                                                            }

                                                            return <td key={fieldIndex}>{value}</td>;
                                                        })}

                                                    </tr>
                                                ))}

                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={fields.length ?? '18'} className='text-center bg-light f-14' >{'No Data Available'}</td>
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
    )
};
export default VPOs;