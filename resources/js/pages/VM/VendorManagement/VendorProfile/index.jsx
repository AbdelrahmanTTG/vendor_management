import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { Previous, Next } from '../../../../Constant';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import ExcelJS from 'exceljs';
import FormatTable from "../../Format";
import SweetAlert from 'sweetalert2'

const Vendor = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [fields, setFields] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [initialOptions, setInitialOptions] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsC, setOptionsC] = useState([]);
    const [optionsN, setOptionsN] = useState([]);
    const [optionsR, setOptionsR] = useState([]);
    const [optionsT, setOptionsT] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);


    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleFormatsChanged = () => { 
        setFormatsChanged(!formatsChanged)
    }
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
    const handelingSelectCountry = async (id) => {
        if (!id) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("GetCountry", {
                params: {
                    id: id
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name,
            }));

            setOptionsC(formattedOptions);
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
        handelingSelect("regions", setOptionsR, "region");
        handelingSelect("time_zone", setOptionsT, "timeZone");
    }, []);

    const options = [
        { value: 'name', label: 'Name' },
        { value: 'legal_name', label: 'Legal Name' },
        { value: 'prefix', label: 'Prefix' },
        { value: 'contact_name', label: 'Contact Name' },
        { value: 'email', label: 'Email' },
        { value: 'phone_number', label: 'Phone Number' },
        { value: 'anotherNumber', label: 'Another Number' },
        { value: 'status', label: 'Status' },
        { value: 'type', label: 'Type' },
        { value: 'region', label: 'Region' },
        { value: 'timezone', label: 'Time Zone' },
        { value: 'country', label: 'Country' },
        { value: 'city', label: 'City' },
        { value: 'nationality', label: 'Nationality' },
        { value: 'contact_linked_in', label: 'LinkedIn' },
        { value: 'contact_ProZ', label: 'ProZ' },
        { value: 'contact_other1', label: 'Other Contact 1' },
        { value: 'contact_other2', label: 'Other Contact 2' },
        { value: 'contact_other3', label: 'Other Contact 3' },


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
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: 'asc' });
    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            sortBy: sortConfig.key,
            sortDirection: sortConfig.direction,
            table: "vendors",
            export: ex,
        };
        try {
            setLoading2(true)
            const { data } = await axiosClient.post("Vendors", payload);
            setVendors(data.vendors.data);
            setFields(data.fields)
            setFormats(data.formats)
            setTotalPages(data.vendors.last_page);
            if (data.AllVendors) { exportToExcel(data.AllVendors) }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading2(false)
        }
    });
    useEffect(() => {
        fetchData();
    }, [currentPage, queryParams, sortConfig, formatsChanged]);
    const EX = () => {
      
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to export all vendors or just the table ?`,
                icon: 'warning',
                showCancelButton: true, 
                confirmButtonText: 'Table', 
                denyButtonText: 'All vendors',     
                showDenyButton: true,        
                cancelButtonText: 'Cancel',   
                confirmButtonColor: '#28a745', 
                denyButtonColor: '#4d8de1',  
                cancelButtonColor: '#6c757d', 
              
            }).then((result) => {
                if (result.isConfirmed) {
                    exportToExcel()
                } else if (result.isDenied) {
                    fetchData(true)
                } 
            });
       

    };
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
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const Add = () => {
        navigate('/vm/vendors/profiletest');
    }
    
    const exportToExcel = async (exportEx) => {
        let data = [];
        if (exportEx) {
            data = exportEx.map(item => {
                if (typeof item === 'object' && item !== null) {
                    const processedItem = { ...item };
                    for (const key in processedItem) {
                        if (typeof processedItem[key] === 'object' && processedItem[key] !== null) {
                            processedItem[key] = String(processedItem[key]?.name || processedItem[key]?.gmt || '');
                        } else if (processedItem[key] === null || processedItem[key] === undefined) {
                            processedItem[key] = '';
                        } else if (typeof processedItem[key] === 'number') {
                            processedItem[key] = processedItem[key];  
                        } else {
                            processedItem[key] = String(processedItem[key]);
                        }
                        if (key === 'status') {
                            processedItem[key] == 0 ? processedItem[key] = 'Active':"";
                            processedItem[key] == 1 ? processedItem[key] = 'Inactive':"";
                            processedItem[key] == 2 ? processedItem[key] = ' Wait for Approval ':"";
                            processedItem[key] == 3 ? processedItem[key] = ' Rejected':"";
                        }
                        if (key === 'type') {
                            processedItem[key] == 0 ? processedItem[key] = 'Freelance' : "";
                            processedItem[key] == 1 ? processedItem[key] = 'In House' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Agency' : "";
                            processedItem[key] == 3 ? processedItem[key] = 'Contractor' : "";                        }
                    }
                    return Object.values(processedItem);
                }
                return item;
            });
        } else {
            const tableRows = document.querySelectorAll("table tbody tr");
            tableRows.forEach(row => {
                const rowData = [];
                const cells = row.querySelectorAll("td");
                const dataWithoutLastTwo = Array.from(cells).slice(0, -2);
                dataWithoutLastTwo.forEach(cell => {
                    rowData.push(cell.innerText);
                });
                data.push(rowData);
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        const headersArray = ['id', ...fields];

        worksheet.columns = headersArray.map((key) => {
            return {
                header: key.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                key: key,
                width: 20,
            };
        });

        worksheet.mergeCells('A1:' + String.fromCharCode(65 + headersArray.length - 1) + '1');
        worksheet.getCell('A1').value = ' Vendor List';
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('A1').font = { bold: true };

        const headerRow = worksheet.getRow(2); 
        headersArray.forEach((header, index) => {
            headerRow.getCell(index + 1).value = header.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '); 
        });

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'D3D3D3' }, 
            };
            cell.font = { bold: true }; 
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; 
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }; 
        });

        data.forEach(rowData => {
            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                if (typeof cell.value === 'number') {
                    cell.numFmt = '0'; 
                } else {
                    cell.numFmt = '@'; 
                }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }; 
            });
        });

        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Vendor-List.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };



   const formatString = (input)=> {
        if (!input || typeof input !== 'string') return '';

        return input
            .split(/[_-]/) 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
            .join(' '); 
   }
    const handleDownload = async (filename) => {
        try {
            const response = await axiosClient.post("download", { filename }, { responseType: 'blob' });
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : filename;
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const response = err.response;
            console.error(response);
            alert('Error downloading the file: ' + (response?.data?.message || 'Unknown error'));
        }


    };
    return (
        <Fragment >
            <Col>
                <Card>

                    <CardHeader
                        className="pb-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer', paddingBottom: '25px' }}
                    >
                        <H5>Search</H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields:   </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                            </div>
                            <div className="search-panel pb-3 b-b-primary">
                                {selectedSearchCol.length > 0 &&
                                    <form onSubmit={searchVendors}>
                                         <Row>
                                        {selectedSearchCol.indexOf("name") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='nameInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'nameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'nameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm nameInput mb-1' type='text' name='name' required />
                                                </FormGroup>
                                            </Col>
                                        }{selectedSearchCol.indexOf("legal_name") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='legalInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='legal_name'>{'legal Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'legalInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'legalInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm legalInput mb-1' type='text' name='legal_name' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("prefix") > -1 &&
                                            <Col md='3'>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Prefix'}</Label>
                                                    <Select id='prefix' required
                                                        name='prefix'
                                                        options={
                                                            [
                                                                { value: 'Mr', label: 'Mr' },
                                                                { value: 'Ms', label: 'Ms' },
                                                                { value: 'Mss', label: 'Mss' },
                                                                { value: 'Mrs', label: 'Mrs' },
                                                            ]} className="js-example-basic-multiple prefixInput mb-1" isMulti
                                                    />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("contact_name") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactNameInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='contact_name'>{'Contact Name'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactNameInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactNameInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactNameInput mb-1' type='text' name='contact_name' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("email") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='emailInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Email'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'emailInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'emailInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm emailInput mb-1' type='email' name='email' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("phone_number") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='phoneNumberInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Phone Number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'phoneNumberInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'phoneNumberInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm phoneNumberInput mb-1' type='tel' name='Phone_number' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("anotherNumber") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='anotherNumberInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Another Number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'anotherNumberInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'anotherNumberInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm anotherNumberInput mb-1' type='tel' name='anothernumber' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("type") > -1 &&
                                            <Col md='3'>
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
                                            <Col md='3'>
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
                                            selectedSearchCol.indexOf("region") > -1 &&
                                            <Col md='3'>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Region'}</Label>
                                                    <Select name='region' id='region' required
                                                        options={optionsR} className="js-example-basic-single"
                                                        onChange={(option) => {
                                                            handelingSelectCountry(option.value)
                                                        }}
                                                        isMulti />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("timezone") > -1 &&
                                            <Col md='3'>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'Time Zone'}</Label>
                                                    <Select name='timezone' id='timezone' required
                                                        options={optionsT} className="js-example-basic-single"
                                                        isMulti />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("country") > -1 &&
                                            <Col md='3'>
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
                                        }{
                                            selectedSearchCol.indexOf("city") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='cityInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='name'>{'City / state'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'cityInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'cityInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm cityInput mb-1' type='text' name='City_state' required />
                                                </FormGroup>
                                            </Col>
                                        }{
                                            selectedSearchCol.indexOf("nationality") > -1 &&
                                            <Col md='3'>
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
                                        {
                                            selectedSearchCol.indexOf("contact_linked_in") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactLinkedInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Linked IN'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactLinkedInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactLinkedInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactLinkedInput mb-1' type='text' name='contact_linked_in' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("contact_ProZ") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactProzInput'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Proz'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactProzInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactProzInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactProzInput mb-1' type='text' name='contact_ProZ' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("contact_other1") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactOther1Input'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 1'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther1Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther1Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactOther1Input mb-1' type='text' name='contact_other1' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("contact_other2") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactOther2Input'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 2'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther2Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther2Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactOther2Input mb-1' type='text' name='contact_other2' required />
                                                </FormGroup>
                                            </Col>
                                        }
                                        {
                                            selectedSearchCol.indexOf("contact_other3") > -1 &&
                                            <Col md='3'>
                                                <FormGroup id='contactOther3Input'>
                                                    <Label className="col-form-label-sm f-12" htmlFor='linked_in'>{'Other Contact 3'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'contactOther3Input') }}><i className="fa fa-plus-circle"></i></Btn>
                                                        <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'contactOther3Input') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                    <Input className='form-control form-control-sm contactOther3Input mb-1' type='text' name='contact_other3' required />
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
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
            <Col sm="12">
                <Card>
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center">
                        <H5>Vendors</H5>
                        <div className="ml-auto">
                            <ButtonGroup>
                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: Add }} >Add new vendor</Btn>
                                <FormatTable title="Add vendors table formatting"
                                    Columns={[
                                    { value: 'name', label: 'Name' },
                                    { value: 'contact_name', label: 'Contact name' },
                                    { value: 'legal_Name', label: 'Legal name' },
                                    { value: 'prfx_name', label: 'prefix name' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'phone_number', label: 'Phone number' },
                                    { value: 'Anothernumber', label: 'Another number' },
                                    { value: 'country', label: 'Country' },
                                    { value: 'cv', label: 'CV' },
                                    { value: 'NDA', label: 'NDA' },
                                    { value: 'type', label: 'Type' },
                                    { value: 'status', label: 'Status' },
                                    { value: 'contact_linked_in', label: 'linked In' },
                                    { value: 'contact_ProZ', label: 'ProZ' },
                                    { value: 'contact_other1', label: 'Contact other 1' },
                                    { value: 'contact_other2', label: 'Contact other 2' },
                                    { value: 'contact_other3', label: 'Contact other 3' },
                                    { value: 'nationality', label: 'Nationality' },
                                    { value: 'region', label: 'Region' },
                                    { value: 'timezone', label: 'Time zone' },
                                    { value: 'reject_reason', label: 'Reject reason' },
                                    { value: 'city', label: 'City' },
                                    { value: 'street', label: 'Street' },
                                    { value: 'address', label: 'Address' },
                                    { value: 'note', label: 'Note' },
                                    ]} table="vendors"
                                    formats={formats} FormatsChanged={handleFormatsChanged}
                                />
                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: EX }}  >Export to Excel</Btn>

                            </ButtonGroup>
                            {/* <Btn  className="me-2">Add New vendor</Btn> */}
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0 px-3'>


                        <div className="table-responsive">
                            {
                                loading2 ? (
                                    <div className="loader-box" >
                                        <Spinner attrSpinner={{ className: 'loader-6' }} />
                                    </div>
                                ) :
                            <Table hover>
                              
                                       
                                <thead>
                                    <tr>

                                        {/* <th scope="col" onClick={() => handleSort('id')}>{'ID'} {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('name')}>{'Name'} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('email')}>{'Email'} {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('legal_Name')}>{'Legal Name'} {sortConfig.key === 'legal_Name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('phone_number')}>{'Phone Number'} {sortConfig.key === 'phone_number' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('country')}>{'Country'} {sortConfig.key === 'country' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        <th scope="col" onClick={() => handleSort('nationality')}>{'Nationality'} {sortConfig.key === 'nationality' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th> */}
                                        <th scope="col" onClick={() => handleSort('id')}>{'ID'} {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                                        {fields.map((field, fieldIndex) => (
                                            <th key={fieldIndex} onClick={() => handleSort(field)} >
                                                {formatString(field)}{sortConfig.key === field && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                            </th>
                                        ))}
                                        <th scope="col">{'Edit'}</th>
                                        <th scope="col">{'Delete'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors?.map((item, index) => (
                                        <tr key={index}>
                                            {Object.keys(item).map((key) => (
                                                <td key={key}>
                                                    
                                                    {key === 'status' || key === 'type' || key === 'cv' || key === "NDA" ? (
                                                        <div>
                                                            {key === 'cv' && (
                                                                <div>
                                                                    {item[key] ? (
                                                                        <Btn
                                                                            attrBtn={{
                                                                                className: "btn btn-pill btn-air-primary",
                                                                                color: "warning-gradien",
                                                                                onClick: () => handleDownload(item[key])
                                                                            }}
                                                                        >
                                                                            <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                                                        </Btn>

                                                                
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {key === 'NDA' && (
                                                                <div>
                                                                    {item[key] ? (
                                                                        <Btn
                                                                            attrBtn={{
                                                                                className: "btn btn-pill btn-air-primary",
                                                                                color: "secondary-gradien",
                                                                                onClick: () => handleDownload(item[key])
                                                                            }}
                                                                        >
                                                                            <i className="icon-zip" style={{ color: "black", fontSize: "18px" }}></i>
                                                                        </Btn>


                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {key === 'status' && (
                                                                <div>
                                                                    {item[key] == 0 && <span style={{ color: 'green' }}> Active</span>}
                                                                    {item[key] == 1 && <span style={{ color: 'blue' }}> Inactive</span>}
                                                                    {item[key] == 2 && <span style={{ color: 'gray' }}> Wait for Approval</span>}
                                                                    {item[key] == 3 && <span style={{ color: 'red' }}> Rejected</span>}
                                                                    {(item[key] < 0 || item[key] > 3) && <span>Status: Unknown</span>}
                                                                </div>
                                                            )}
                                                            {key === 'type' && (
                                                                <div>
                                                                    {item[key] == 0 && <span style={{ color: 'green' }}> Freelance</span>}
                                                                    {item[key] == 1 && <span style={{ color: 'blue' }}> In House</span>}
                                                                    {item[key] == 2 && <span style={{ color: 'gray' }}> Agency</span>}
                                                                    {item[key] == 3 && <span style={{ color: 'red' }}> Contractor</span>}
                                                                    {(item[key] < 0 || item[key] > 3) && <span>Status: Unknown</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        item[key] && typeof item[key] === 'object' && item[key]?.name || item[key]?.gmt ? (
                                                            item[key].name || item[key].gmt
                                                        ) : (
                                                            item[key] || ''
                                                        )
                                                    )}
                                                </td>
                                            ))}


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
                                }

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