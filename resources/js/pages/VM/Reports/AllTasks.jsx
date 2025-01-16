import React, { Fragment, useEffect, useState, useCallback  } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import { toast } from 'react-toastify';
import FormatTable from "../Format";
import SweetAlert from 'sweetalert2';
import ExcelJS from 'exceljs';

const Report = (props) => {
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
    const [fields, setFields] = useState([]);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleFormatsChanged = () => {
        setFormatsChanged(!formatsChanged)
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
    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            table: "job_task",           
            export: ex,
            view: props.permissions?.view

        };
        try {
            setLoading(true);
            await axiosClient.post("allTasks", payload)
                .then(({ data }) => {
                    if (data.type == 'error') {
                        toast.error(data.message);
                    } else {                        
                        setFormats(data?.formats);
                        setFields(data?.fields);
                        console.log(data.AllTasks)
                        if (data.AllTasks) { exportToExcel(data.AllTasks) }
                        else{
                            setTasks(data?.Tasks);
                            setPageLinks(data?.Links);
                        }
                    }
                    setLoading(false);
                });
        } catch (err) {
            console.error(err);
        }
    });

    useEffect(() => {       
        fetchData();
    }, [currentPage, queryParams, formatsChanged]);

    const handlePageChange = (newPage) => {
        let tempPage = currentPage;
        if (newPage > 0) {
            tempPage = newPage;
        }
        setCurrentPage(tempPage);
    };
    const formatString = (input) => {
        if (!input || typeof input !== 'string') return '';
        return input.replace('_name', '')
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // export 
    const EX = () => {

        SweetAlert.fire({
            title: 'Are you sure?',
            text: `Do you want to export all tasks ?`,
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
        let data = exportEx;
        // if (exportEx) {
        //     data = exportEx.map(item => {                
        //         if (typeof item === 'object' && item !== null) {
        //             fields.map(key =>{
        //                 if (item[key] === null || item[key] === undefined) {
        //                     item[key] = '';
        //                 } else if (typeof item[key] === 'number') {
        //                     item[key] = item[key];
        //                 } else {
        //                     item[key] = String(item[key]);
        //                 }
        //                 if (key === 'status') {
        //                     item[key] = String(item['statusData'].replace('Your', 'Vendor'));                          
        //                 }                       
        //             })
        //             return item;
        //         }                
        //     });
        // }
        // else {
        //     const tableRows = document.querySelectorAll("table tbody tr");
        //     tableRows.forEach(row => {
        //         const rowData = [];
        //         const cells = row.querySelectorAll("td");
        //         const dataWithoutLastTwo = Array.from(cells);
        //         dataWithoutLastTwo.forEach(cell => {
        //             rowData.push(cell.innerText);
        //         });
        //         data.push(rowData);
        //     });
        // }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        const headersArray = [...fields];

        worksheet.columns = headersArray.map((key) => {
            return {
                header: key.replace('_name', '')
                .split(/[_-]/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                key: key,
                width: 20,
            };
        });

        worksheet.mergeCells('A1:' + String.fromCharCode(65 + headersArray.length - 1) + '1');
        worksheet.getCell('A1').value = ' Tasks List';
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
            a.download = 'Tasks-List.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    useEffect(() => {
          formatData(formats);
    }, [formats]);
      const formatData = (format) => {
  
          const labelMapping = {
         
              'subject': 'Subject',
              'task_type': 'Task Type',
              'vendor': 'Vendor',
              'source_name': 'Source',
              'target_name': 'Target',
              'count': 'Count',
              'unit': 'Unit',
              'rate': 'Rate',
              'total_cost': 'Total Cost',
              'currency': 'Currency',
              'start_date': 'Start Date',
              'delivery_date': 'Delivery Date',
              'status': 'Status',
              'closed_date': 'Closed Date',
              'created_by': 'Created by',
              'created_at': 'Created at',
              'brand_name': 'Brand'
         
          };
          format?.flatMap(element =>
              element.format = element.format.split(',').map(value => {
                  const trimmedValue = value.trim();
                  return {
                      value: trimmedValue,
                      label: labelMapping[trimmedValue] || trimmedValue
                  };
              })
          );
          // return data;
  
      }
   
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
                                                            options={optionsTY} className="js-example-basic-single "
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
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center py-3">
                        <div className="w-100 text-end">
                            <ButtonGroup >
                                <FormatTable title="Add Tasks table formatting"
                                    Columns={[
                                        { value: 'subject', label: 'Subject' },
                                        { value: 'task_type', label: 'Task Type' },
                                        { value: 'vendor', label: 'Vendor' },
                                        { value: 'source_name', label: 'Source' },
                                        { value: 'target_name', label: 'Target' },
                                        { value: 'count', label: 'Count' },
                                        { value: 'unit', label: 'Unit' },
                                        { value: 'rate', label: 'Rate' },
                                        { value: 'total_cost', label: 'Total Cost' },
                                        { value: 'currency', label: 'Currency' },
                                        { value: 'start_date', label: 'Start Date' },
                                        { value: 'delivery_date', label: 'Delivery Date' },
                                        { value: 'status', label: 'Status' },
                                        { value: 'closed_date', label: 'Closed Date' },
                                        { value: 'created_by', label: 'Created by' },
                                        { value: 'created_at', label: 'Created at' },
                                        { value: 'brand_name', label: 'Brand' },

                                    ]} table="job_task"
                                    formats={formats} FormatsChanged={handleFormatsChanged}
                                />
                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: EX }}  >Export to Excel</Btn>

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
                                                <th key={fieldIndex}>
                                                    {formatString(field)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Tasks.length > 0 ? (
                                            <>
                                                {Tasks.map((item, index) => (
                                                    <tr key={index}>
                                                        {fields.map((field, fieldIndex) => (
                                                            <td key={fieldIndex}>
                                                                {field == 'status' ?
                                                                    <span className='badge badge-info p-2'>{item.statusData.replace('Your', 'Vendor')}</span>
                                                                    :
                                                                    <>
                                                                        {item[field]}
                                                                    </>
                                                                }

                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={fields.length??'18'} className='text-center bg-light f-14' >{'No Data Available'}</td>
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