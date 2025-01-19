import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useStateContext } from '../../../pages/context/contextAuth';
import FormatTable from "../Format";
import SweetAlert from 'sweetalert2';
import ExcelJS from 'exceljs';

const Report = (props) => {
    const { user } = useStateContext();
    const [tickets, setTickets] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [optionsU, setOptionsU] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [fields, setFields] = useState([]);
    const [headerFields, setHeaderFields] = useState([]);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleFormatsChanged = () => {
        setFormatsChanged(!formatsChanged)
    }
    useEffect(() => {
        formatData(formats);
    }, [formats]);
    const formatData = (format) => {

        const labelMapping = {

            'brand': 'Brand',
            'opened_by': 'Opened By',
            'closed_by': 'Closed By',
            'created_by': 'Requester Name',
            'number_of_resource': 'Number Of Rescource',
            'request_type': 'Request Type',
            'service': 'Service',
            'task_type': 'Task Type',
            'rate': 'Rate',
            'count': 'Count',
            'unit': 'Unit',
            'currency': 'Currency',
            'source_lang': 'Source Language',
            'target_lang': 'Target Language',
            'start_date': 'Start Date',
            'delivery_date': 'Delivery Date',
            'subject': 'Subject Matter',
            'software': 'Software',
            'created_at': 'Request Time',
            'time_of_opening': 'Time Of Opening',
            'time_of_closing': 'Time Of CLosing',
            'TimeTaken': 'Taken Time',
            'new': 'New Vendors',
            'existing': 'Existing Vendors',
            'existing_pair': 'Existing Vendors with New Pairs',
            'status': 'Status',

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
    const handelingSelectUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.post("getVmData");
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
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        handelingSelectUsers();
    }, []);

    const searchTickets = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {};
        for (let keyValue of formData.entries()) {
            if (keyValue[0] == 'created_by')
                data[keyValue[0]] = formData.getAll(keyValue[0]);
            else
                data[keyValue[0]] = formData.get(keyValue[0]);
        }
        setQueryParams(data);
        setCurrentPage(1);
    }

    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            permissions: props.permissions,
            user: user.id,
            table: "vm_activity",
            export: ex,
        };
        try {
            setLoading(true);
            await axiosClient.post("vmActivity", payload)
                .then(({ data }) => {
                    if (data.type == 'error') {
                        toast.error(data.message);
                    } else {
                        setHeaderFields(data?.headerFields);
                        setFormats(data?.formats);
                        setFields(data?.fields);
                        if (data.AllTickets) { exportToExcel(data.AllTickets) }
                        else {
                            setTickets(data?.Tickets);
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
        // if (queryParams != null)
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
        return input
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    // export 
    const EX = () => {
        SweetAlert.fire({
            title: 'Are you sure?',
            text: `Do you want to export all Data ?`,
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
        let data = [];
        if (exportEx) {
            data = exportEx.map(item => {
                if (typeof item === 'object' && item !== null) {
                    fields.map(key => {
                        if (item[key] === null || item[key] === undefined) {
                            item[key] = '';
                        } else if (typeof item[key] === 'number') {
                            item[key] = item[key];
                        } else {
                            item[key] = String(item[key]);
                        }
                    })
                    return item;
                }
            });
        }
        // else {
        //     const tableRows = document.querySelectorAll("table tbody tr");
        //     tableRows.forEach(row => {
        //         const rowData = [];
        //         const cells = row.querySelectorAll("td");
        //         Array.from(cells).forEach(cell => {
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
                header: key
                    .split(/[_-]/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                key: key,
                width: 20,
            };
        });
        if (headersArray.length >= 26) {
            worksheet.mergeCells('A1:' + String.fromCharCode(64 + (headersArray.length) / 26, 64 + (headersArray.length) % 26) + '1');
        } else {
            worksheet.mergeCells('A1:' + String.fromCharCode(65 + headersArray.length - 1) + '1');
        }
        worksheet.getCell('A1').value = ' Vm Activity';
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('A1').font = { bold: true };

        const headerRow = worksheet.getRow(2);
        headersArray.forEach((header, index) => {
            headerRow.getCell(index + 1).value = headerFields[index].replace(/_/g, ' ')
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
            a.download = 'vm_activity_report.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    return (
        <Fragment >
            <Col>
                <Card className="m-b-10">
                    <CardHeader
                        className=" py-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer' }}
                    >
                        <H5>Date Filter </H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '20px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody className='p-t-0'>
                            <div className="search-panel">
                                <form onSubmit={searchTickets}>
                                    <Row className="pb-3">
                                        <Col md='6'>
                                            <FormGroup>
                                                <Label className="col-form-label-sm f-12" >{'Start Date'}</Label>
                                                <Input className='form-control digits' type='date' defaultValue='' name='start_date' required />
                                            </FormGroup>
                                        </Col>
                                        <Col md='6'>
                                            <FormGroup>
                                                <Label className="col-form-label-sm f-12" >{'End Date'}</Label>
                                                <Input className='form-control digits' type='date' defaultValue='' name='end_date' required />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {props.permissions?.view == 1 &&
                                        <Row>
                                            <Col md='12'>
                                                <FormGroup>
                                                    <Label className="col-form-label-sm f-12" >{'VM Name'}</Label>
                                                    <Select name='created_by' id='created_by' required
                                                        options={optionsU} className="js-example-basic-single "
                                                        isMulti />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    }
                                    <Row className='b-t-primary p-t-20'>
                                        <Col>
                                            <div className="d-inline">
                                                <Btn attrBtn={{ color: 'btn btn-primary-gradien', className: "btn-sm ", type: 'submit' }}><i className="fa fa-search me-1"></i> Search</Btn>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
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
                                        { value: 'brand', label: 'Brand' },
                                        { value: 'opened_by', label: 'Opened By' },
                                        { value: 'closed_by', label: 'Closed By' },
                                        { value: 'created_by', label: 'Requester Name' },
                                        { value: 'number_of_resource', label: 'Number Of Rescource' },
                                        { value: 'request_type', label: 'Request Type' },
                                        { value: 'service', label: 'Service' },
                                        { value: 'task_type', label: 'Task Type' },
                                        { value: 'rate', label: 'Rate' },
                                        { value: 'count', label: 'Count' },
                                        { value: 'unit', label: 'Unit' },
                                        { value: 'currency', label: 'Currency' },
                                        { value: 'source_lang', label: 'Source Language' },
                                        { value: 'target_lang', label: 'Target Language' },
                                        { value: 'start_date', label: 'Start Date' },
                                        { value: 'delivery_date', label: 'Delivery Date' },
                                        { value: 'subject', label: 'Subject Matter' },
                                        { value: 'software', label: 'Software' },
                                        { value: 'created_at', label: 'Request Time' },
                                        { value: 'time_of_opening', label: 'Time Of Opening' },
                                        { value: 'time_of_closing', label: 'Time Of CLosing' },
                                        { value: 'TimeTaken', label: 'Taken Time' },
                                        { value: 'new', label: 'New Vendors' },
                                        { value: 'existing', label: 'Existing Vendors' },
                                        { value: 'existing_pair', label: 'Existing Vendors with New Pairs' },
                                        { value: 'status', label: 'Status' },

                                    ]} table="vm_activity"
                                    formats={formats} FormatsChanged={handleFormatsChanged}
                                />
                                {queryParams != null && tickets.length > 0 &&
                                    <Btn attrBtn={{ color: 'btn btn-primary-gradien', onClick: EX }}  >Export to Excel</Btn>
                                }
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
                                            {headerFields.map((field, fieldIndex) => (
                                                <th key={fieldIndex}>
                                                    {formatString(field)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            <>
                                                {tickets.map((item, index) => (
                                                    <tr key={index}>
                                                        {fields.map((field, fieldIndex) => (
                                                            <td key={fieldIndex}>
                                                                {typeof item[field] === 'object' && item[field] !== null ? (
                                                                    item[field].name || item[field].name || "No Name"
                                                                ) : (
                                                                    item[field]
                                                                )}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={(fields.length) ?? '27'} className='text-center bg-light f-14' >{'No Data Available'}</td>
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