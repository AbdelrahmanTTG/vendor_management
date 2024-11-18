import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row } from 'reactstrap';
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { Previous, Next } from '../../../../Constant';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import ExcelJS from 'exceljs';

const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsC, setOptionsC] = useState([]);
    const [optionsN, setOptionsN] = useState([]);
    const [queryParams, setQueryParams] = useState(null);

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
    useEffect(() => {
        handelingSelect("countries", setOptionsC, "country");
        handelingSelect("countries", setOptionsN, "nationality");
    }, []);

    const options = [
        { value: 'name', label: 'Name' },
        { value: 'legal_name', label: 'Legal Name' },
        { value: 'email', label: 'Email' },
        { value: 'status', label: 'Status' },
        { value: 'type', label: 'Type' },
        { value: 'country', label: 'Country' },
        { value: 'nationality', label: 'Nationality' },
    ];
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }
    const searchVendors = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        //  setQueryParams(Object.fromEntries(formData));
        const data = {};
        for (let keyValue of formData.entries()) {
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

    };

    const delBtn = (event, divID) => {
        event.preventDefault();
        var divLength = document.querySelectorAll(["." + divID]).length;
        var div = document.querySelector(['#' + divID + " ." + divID + ":last-child"]);
        if (divLength > 1)
            div && div.remove();
    };

    const handleEdit = (vendor) => {
        setLoading(true);
        setTimeout(() => {
            navigate('/vm/vendors/editprofiletest', { state: { vendor } });
            setLoading(false);
        }, 10);
    };
    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
            };
            try {
                const { data } = await axiosClient.post("Vendors", payload);

                setVendors(data.data);
                setTotalPages(data.last_page);
            } catch (err) {
            }
        }
        fetchData();
    }, [currentPage, queryParams]);
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const getPaginationItems = () => {
        const items = [];
        const displayedPages = 5;
        const halfDisplayed = Math.floor(displayedPages / 2);
        let startPage = Math.max(1, currentPage - halfDisplayed);
        let endPage = Math.min(totalPages, currentPage + halfDisplayed);

        if (endPage - startPage < displayedPages - 1) {
            if (startPage === 1) {
                endPage = Math.min(startPage + displayedPages - 1, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(endPage - displayedPages + 1, 1);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        if (startPage > 1) {
            items.unshift(
                <PaginationItem disabled key="ellipsis-start">
                    <PaginationLink disabled>...</PaginationLink>
                </PaginationItem>
            );
        }
        if (endPage < totalPages) {
            items.push(
                <PaginationItem disabled key="ellipsis-end">
                    <PaginationLink disabled>...</PaginationLink>
                </PaginationItem>
            );
        }
        if (startPage > 1) {
            items.unshift(
                <PaginationItem onClick={() => handlePageChange(1)} key={1}>
                    <PaginationLink>{1}</PaginationLink>
                </PaginationItem>
            );
        }
        if (endPage < totalPages) {
            items.push(
                <PaginationItem onClick={() => handlePageChange(totalPages)} key={totalPages}>
                    <PaginationLink>{totalPages}</PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };
    const Add = () => {
        navigate('/vm/vendors/profiletest');
    }
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedVendors = [...vendors].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setVendors(sortedVendors);
    };
    const exportToExcel = () => {
        const tableRows = document.querySelectorAll("table tbody tr");
        const data = [];
        tableRows.forEach(row => {
            const rowData = [];
            row.querySelectorAll("td").forEach(cell => {
                rowData.push(cell.innerText);
            });
            data.push(rowData);
        });
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Legal Name', key: 'legal_name', width: 25 },
            { header: 'Phone Number', key: 'phone', width: 15 },
            { header: 'Country', key: 'country', width: 20 },
            { header: 'Nationality', key: 'nationality', width: 20 },
        ];

        data.forEach(rowData => {
            worksheet.addRow(rowData);
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'table-data.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    return (
        <Fragment >
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>Vendors</H5>
                        <div className="ml-auto">
                            <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: Add }} className="me-2">Add New vendor</Btn>
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0 px-3'>
                        <div className="search-panel mb-3">
                            <label className='f-12'>Searching Fields:   </label>
                            <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                        </div>
                        <div className="search-panel pb-3 b-b-primary">
                            {selectedSearchCol.length > 0 &&
                                <form onSubmit={searchVendors}>
                                    <Row>
                                        {selectedSearchCol.indexOf("name") > -1 &&
                                            <Col>
                                                <FormGroup id='nameInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm nameInput mb-1' type='text' name='name' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {selectedSearchCol.indexOf("legal_name") > -1 &&
                                            <Col>
                                                <FormGroup id='legalInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='legal_name'>{'legal Name'}<Btn attrBtn={{  datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'legalInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'legalInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm legalInput mb-1' type='text' name='legal_name' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("email") > -1 &&
                                            <Col>
                                                <FormGroup id='emailInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Email'}<Btn attrBtn={{  datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'emailInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'emailInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm emailInput mb-1' type='email' name='email' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("type") > -1 &&
                                            <Col>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Type'}</Label>
                                                    <Select id='type' required
                                                        name='type'
                                                        options={
                                                            [
                                                                { value: 'Freelance', label: 'Freelance' },
                                                                { value: 'Agency', label: 'Agency' },
                                                                { value: 'Contractor', label: 'Contractor' },
                                                                { value: 'In House', label: 'In House' },
                                                            ]} className="js-example-basic-multiple typeInput mb-1" isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("status") > -1 &&
                                            <Col>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Status'}</Label>
                                                    <Select id='status' required
                                                        name='status'
                                                        options={
                                                            [
                                                                { value: 'Active', label: 'Active' },
                                                                { value: 'Inactive', label: 'Inactive' },
                                                                { value: 'Rejected', label: 'Rejected' },
                                                                { value: 'Wait for Approval', label: 'Wait for Approval' },
                                                            ]} className="js-example-basic-multiple statusInput mb-1" isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("country") > -1 &&
                                            <Col>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Country'}</Label>
                                                    <Select name='country' id='country' required
                                                        options={optionsC} className="js-example-basic-single "
                                                        onInputChange={(inputValue) =>
                                                            handleInputChange(inputValue, "countries", "country", setOptionsC, optionsC)
                                                        }
                                                        isMulti />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("nationality") > -1 &&
                                            <Col>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'nationality'}</Label>
                                                    <Select name='nationality' id='nationality' required
                                                        options={optionsN} className="js-example-basic-single "
                                                        onInputChange={(inputValue) =>
                                                            handleInputChange(inputValue, "countries", "nationality", setOptionsN, optionsN)
                                                        }
                                                        isMulti />
                                                </FormGroup>
                                            </Col>
                                        }
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="d-inline">
                                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit' }}><i className="fa fa-search me-1"></i> Search</Btn>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            }
                        </div>
                        {/* <button onClick={exportToExcel} className="btn btn-primary mb-3">Export to Excel</button> */}

                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th scope="col" onClick={() => handleSort('id')}>{'ID'} {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('name')}>{'Name'} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('email')}>{'Email'} {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('legal_Name')}>{'Legal Name'} {sortConfig.key === 'legal_Name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('phone_number')}>{'Phone Number'} {sortConfig.key === 'phone_number' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('country')}>{'Country'} {sortConfig.key === 'country' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('nationality')}>{'Nationality'} {sortConfig.key === 'nationality' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col">{'Edit'}</th>
                                        <th scope="col">{'Delete'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.map((item, index) => (
                                        <tr key={index}>
                                            <td scope="row">{item.id || ''}</td>
                                            <td scope="row">{item.name || ''}</td>
                                            <td scope="row">{item.email || ''}</td>
                                            <td scope="row">{item.legal_Name || ''}</td>
                                            <td scope="row">{item.phone_number || ''}</td>
                                            <td scope="row">{item.country?.name || ''}</td>
                                            <td>{item.nationality?.name || ''}</td>
                                            <td>
                                                <button onClick={() => handleEdit(item)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                    <i className="icofont icofont-ui-edit"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <i className="icofont icofont-ui-delete"></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {totalPages > 1 &&
                                <Pagination aria-label="Page navigation example" className="pagination-primary mt-3">
                                    <PaginationItem onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                        <PaginationLink >{Previous}</PaginationLink>
                                    </PaginationItem>
                                    {getPaginationItems()}
                                    <PaginationItem onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                        <PaginationLink >{Next}</PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                            }
                        </div>
                    </CardBody>
                </Card>
            </Col>

        </Fragment>
    );
};

export default Vendor;