import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, Progress, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import FormatTable from "../Format";
import SweetAlert from 'sweetalert2';
import ExcelJS from 'exceljs';

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
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsTY, setOptionsTY] = useState([]);
    const [optionsUnit, setOptionsUnit] = useState([]);
    const [optionsCU, setOptionsCU] = useState([]);

    
    const options = [
        { value: 'code', label: 'P.o number' },
        { value: 'payment_status', label: 'Payment status'},
        { value: 'status', label: 'VPO status'},
        { value: 'user_name', label: 'PM name'},
        { value: 'closed_date', label: 'VPO date'},
        { value: 'po_verified', label: 'CPO verified'},
        { value: 'po_verified_at', label: 'CPO verified date'},
        { value: 'vendor', label: 'Vendor' },
        { value: 'source_lang', label: 'Source Language'},
        { value: 'target_lang', label: 'Target Language'},
        { value: 'task_type', label: 'Task Type' },
        { value: 'count', label: 'Count' },
        { value: 'unit', label: 'Unit' },
        { value: 'rate', label: 'Rate' },
        { value: 'currency', label: 'Currency' },
        { value: 'totalamount', label: 'P.O amount' },
        { value: 'invoice_dated', label: 'Invoice date ' },

        


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
                    setFields(data?.fields);
                    setPageLinks(data?.Links);
                    setVPOs(data?.data?.data)
                    setFormats(data?.formats);
                    if (data.AllData) { exportToExcel(data.AllData) }

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
            } else if (keyValue[0] === "invoice_dated_from" || keyValue[0] === "invoice_dated_to" ) {
                if (!data["invoice_dated"]) {
                    data["invoice_dated"] = [];
                }
                data["invoice_dated"].push(keyValue[1]);
            }
            else {
                data[keyValue[0]] = formData.getAll(keyValue[0]);
            }
        }
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
    const handleDownload = async (status, filename) => { 
        try {
            const response = await axiosClient.post("downloadVPO", { status, filename }, { responseType: 'blob' });
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers['content-disposition'];
            const matches = contentDisposition ? contentDisposition.match(/filename="?([^"]+)"?/) : null;
            const fileName = matches ? matches[1].trim().replace(/^_+|_+$/g, '') : filename;
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
    }
      const EX = () => {
    
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to export all VPOs ?`,
                icon: 'warning',
                confirmButtonText: 'Export',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
    
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchData(true)
                }
            });
    };
       const exportToExcel = async (exportEx) => {
           if (!exportEx || exportEx.length === 0) return;

           setIsExporting(true);
           setProgress(0);

           let data = exportEx.map(item => {
               if (typeof item === 'object' && item !== null) {
                   const processedItem = { ...item };
                   for (const key in processedItem) {
                       if (typeof processedItem[key] === 'object' && processedItem[key] !== null) {
                           processedItem[key] = String(processedItem[key]?.name || processedItem[key]?.user_name || '');
                       } else if (processedItem[key] === null || processedItem[key] === undefined) {
                           processedItem[key] = '';
                       } else if (typeof processedItem[key] === 'number') {
                           processedItem[key] = processedItem[key];
                       } else {
                           processedItem[key] = String(processedItem[key]);
                       }
                       if (key === 'status') {
                           processedItem[key] = vpo_status?.[processedItem[key]];
                       }
                       if (key === 'payment_status') {
                           processedItem[key] = processedItem[key] == 1 ? "✅" : "❌";
                       }
                   }
                   return processedItem;
               }
               return null;
           }).filter(Boolean); 

           const workbook = new ExcelJS.Workbook();
           const worksheet = workbook.addWorksheet('Sheet 1');
           const headersArray = fields.map(field => field[0]).filter(header => header !== "VPO file");
           const headersArray2 = fields.map(field => field[1]).filter(header => header !== "vpo_file");

           worksheet.columns = headersArray2.map((key) => ({
               header: key?.replace('_name', '').split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
               key: key,
               width: 20,
           }));

           worksheet.mergeCells('A1:' + String.fromCharCode(65 + headersArray.length - 1) + '1');
           worksheet.getCell('A1').value = 'VPOs List';
           worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
           worksheet.getCell('A1').font = { bold: true };

           const headerRow = worksheet.getRow(2);
           headersArray.forEach((header, index) => {
               headerRow.getCell(index + 1).value = header?.replace(/_/g, ' ').split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
           });

           headerRow.eachCell((cell) => {
               cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
               cell.font = { bold: true };
               cell.alignment = { vertical: 'middle', horizontal: 'center' };
               cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
           });

           const totalRows = data.length;
           data.forEach((rowData, index) => {
               worksheet.addRow(rowData);
               setProgress(Math.round(((index + 1) / totalRows) * 50)); 
           });

           const buffer = await workbook.xlsx.writeBuffer();
           const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

           const reader = new FileReader();
           reader.onprogress = (event) => {
               if (event.lengthComputable) {
                   const percent = Math.round((event.loaded / event.total) * 50) + 50; 
                   setProgress(percent);
               }
           };

           reader.onloadend = () => {
               const url = window.URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = 'VPOs-List.xlsx';
               a.click();
               window.URL.revokeObjectURL(url);

               setTimeout(() => {
                   setIsExporting(false);
                   setProgress(0);
               }, 1000);
           };

           reader.readAsArrayBuffer(blob);
       };
    const [progress, setProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
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
                                                        <Input className='form-control form-control-sm codeInput mb-1' type='text' name='code' placeholder='Enter P.o number...' required />
                                                    </FormGroup>
                                                </Col>
                                            } {selectedSearchCol.indexOf("count") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup id='countInput'>
                                                        <Label className="col-form-label-sm f-12">{'count'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'countInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'countInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm countInput mb-1' type='text' name='count' placeholder='Enter count...' required />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("rate") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup id='rateInput'>
                                                        <Label className="col-form-label-sm f-12">{'Rate'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'rateInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'rateInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm rateInput mb-1' type="number" step="0.01" min="0" name='rate' placeholder='Enter rate...' required />
                                                    </FormGroup>
                                                </Col>
                                            }{selectedSearchCol.indexOf("totalamount") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup id='amountInput'>
                                                        <Label className="col-form-label-sm f-12">{'P.O amount'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'amountInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'amountInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm amountInput mb-1' type="number" step="0.01" min="0" name='totalamount' placeholder='Enter amount...' required />
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
                                            }{
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
                                            }{
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
                                                selectedSearchCol.indexOf("invoice_dated") > -1 &&
                                                <>
                                                    <Row>
                                                        <Col md='12'>
                                                            <Label className="col-form-label-sm f-14 font-weight-bold">{'Invoice date range'}</Label>
                                                        </Col>
                                                    </Row>
                                                    <Row>

                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12" >{'Date From'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='invoice_dated_from' required />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md='4'>
                                                            <FormGroup>
                                                                <Label className="col-form-label-sm f-12" >{'Date To'}</Label>
                                                                <Input className='form-control digits' type='date' defaultValue='' name='invoice_dated_to' required />
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
                                            }{
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
                                            }{
                                                selectedSearchCol.indexOf("target_lang") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Target Language'}</Label>
                                                            <Select name='target_lang' id='target_lang' required
                                                            options={optionsTL} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "target_lang", setOptionsTL, optionsTL)
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
                                                            options={optionsTY} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "task_type", "task_type", setOptionsTY, optionsTY)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("unit") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor='name'>{'Unit'}</Label>
                                                            <Select id='unit' required
                                                                name='unit'
                                                                options={optionsUnit} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "unit", "unit", setOptionsUnit, optionsUnit)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("currency") > -1 &&
                                                <Col md='4'>
                                                    <FormGroup>
                                                            <Label className="col-form-label-sm f-12" htmlFor='name'>{'Currency'}</Label>
                                                            <Select id='currency' required
                                                                name='currency'
                                                                options={optionsCU} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "currency", "Currency", setOptionsCU, optionsCU)
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
                    <div>
                        {isExporting > 0 && (
                            <div className="mt-3">
                                <Progress value={progress} color="success">{progress}%</Progress>
                            </div>
                        )}
                    </div>
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
                                <Btn attrBtn={{
                                    color: 'btn btn-primary-gradien', onClick: EX, disabled: loading  }}  >Export to Excel</Btn>

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
                                                            } else if (field[1] === "vpo_file") {
                                                                if (item[field[1]]) {
                                                                    value = (
                                                                        <button
                                                                            onClick={() => handleDownload(item.job_portal, item[field[1]])}
                                                                            className="text-2xl px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                backgroundColor: 'transparent',
                                                                                border: 'none',
                                                                                cursor: 'pointer',
                                                                                fontSize:"20px"
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-cloud-download" aria-hidden="true"></i>
                                                                        </button>
                                                                    );
                                                                } else {
                                                                    value = "🚫";
                                                                }
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