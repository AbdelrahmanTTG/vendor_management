import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { Btn, H4, H5, P, Image, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import CountUp from 'react-countup';
import countImage from '../../../assets/images/dashboard/safari.png';
import FormatTable from "../Format";
import SweetAlert from 'sweetalert2';
import ExcelJS from 'exceljs';
import { encryptData } from "../../../crypto";

const TicketsList = (props) => {
    const [tickets, setTickets] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [totalCount, setTotalCount] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [initialOptions, setInitialOptions] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsT, setOptionsT] = useState([]);
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsSL, setOptionsSL] = useState([]);
    const [optionsS, setOptionsS] = useState([]);
    const [optionsU, setOptionsU] = useState([]);
    const [optionsB, setOptionsB] = useState([]);
    const [optionsR, setOptionsR] = useState([]);
    const [optionsD, setOptionsD] = useState([]);
    const [optionsTY, setOptionsTY] = useState([]);
    const [optionsMain, setOptionsMain] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const [fields, setFields] = useState([]);
    const [headerFields, setHeaderFields] = useState([]);
    const [formats, setFormats] = useState(null);
    const [formatsChanged, setFormatsChanged] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: 'desc' });
    
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
    const handelingSelectUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.post("getPMSalesData");
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
        handelingSelect("services", setOptionsS, "service");
        handelingSelect("languages", setOptionsSL, "source_lang");
        handelingSelect("languages", setOptionsTL, "target_lang");
        handelingSelect("tools", setOptionsT, "software");
        handelingSelect("brand", setOptionsB, "brand");
        handelingSelect("task_type", setOptionsTY, "task_type");
        handelingSelect("regions", setOptionsR, "region");
        handelingSelect("division", setOptionsR, "division");
        handelingSelectUsers();
        try {
            axiosClient.post("getTicketsTotal").then(({ data }) => {
                setTotalCount(data?.Total);
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    // search 
    const options = [
        { value: "brand", label: "Brand" },
        { value: "id", label: "Ticket Number" },
        { value: "request_type", label: "Ticket Type" },
        { value: "service", label: "Service" },
        { value: "task_type", label: "Task Type" },
        { value: "source_lang", label: "Source" },
        { value: "target_lang", label: "Target" },
        { value: "subject", label: "Subject" },
        { value: "software", label: "Software" },
        { value: "status", label: "Status" },
        { value: "created_by", label: "Requester Name" },
        { value: "requester_function", label: "Requester Function" },
        { value: "date", label: "Date" },
        { value: "region", label: "Region" },
        { value: "division", label: "Division" },
    ];
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }
    const searchTickets = (event) => {
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
    const handleView = (ticket) => {
        setLoading(true);
        setTimeout(() => {
            navigate('/vm/ViewTicket', { state: { ticket } });
            setLoading(false);
        }, 10);
    };
    const handleSort = (key) => {
        if (key == "Ticket Number"){key = "id"}
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const fetchData = useCallback(async (ex) => {
        const payload = {
            per_page: 10,
            page: currentPage,
            queryParams: queryParams,
            sortBy: sortConfig.key,
            sortDirection: sortConfig.direction,
            table: "vm_tickets",
            export: ex,
            view: props.permissions?.view
        };
        try {
            setLoading2(true);
            const { data } = await axiosClient.post("getTickets", payload);
            setTickets(data?.Tickets);
            setPageLinks(data?.Links);
            setFormats(data?.formats);
            setFields(data?.fields);
            setHeaderFields(data?.headerFields);
            if (data.AllTickets) { exportToExcel(data.AllTickets) }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading2(false);

        }
    });
    useEffect(() => {
        fetchData();
    }, [currentPage, queryParams,sortConfig,formatsChanged]);
    useEffect(() => {
        formatData(formats);
    }, [formats]);
    const formatData = (format) => {

        const labelMapping = {
            'name': 'Name',
            'brand': "Brand",
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
            'status': 'Status',
            'created_by': 'Created By',
            'requester_function': 'Requester Function',
            'region': 'Region',
            'division': 'Division',
            'created_at': 'Created At',

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
                    const processedItem = { ...item };
                    for (const key in processedItem) {
                        if (typeof processedItem[key] === 'object' && processedItem[key] !== null) {
                            processedItem[key] = String(processedItem[key]?.name || processedItem[key]?.user_name  || '');
                        } else if (processedItem[key] === null || processedItem[key] === undefined) {
                            processedItem[key] = '';
                        } else if (typeof processedItem[key] === 'number') {
                            processedItem[key] = processedItem[key];
                        } else {
                            processedItem[key] = String(processedItem[key]);
                        }
                        if (key === 'status') {
                            processedItem[key] == 0 ? processedItem[key] = 'Rejected' : "";
                            processedItem[key] == 1 ? processedItem[key] = 'New' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Opened' : "";
                            processedItem[key] == 3 ? processedItem[key] = 'Partly Closed' : "";
                            processedItem[key] == 4 ? processedItem[key] = 'Closed' : "";
                            processedItem[key] == 5 ? processedItem[key] = 'Closed Waiting Requester Acceptance' : "";

                        }
                        if (key === 'request_type') {
                            processedItem[key] == 1 ? processedItem[key] = 'New Resource' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'Price Inquiry' : "";
                            processedItem[key] == 3 ? processedItem[key] = 'General' : "";
                            processedItem[key] == 4 ? processedItem[key] = 'Resources Availability' : "";
                            processedItem[key] == 5 ? processedItem[key] = 'CV Request' : "";

                        }
                        if (key === 'requester_function') {
                            processedItem[key] == 1 ? processedItem[key] = 'SAM' : "";
                            processedItem[key] == 2 ? processedItem[key] = 'PM' : "";                         

                        }
             
                    }
                    return processedItem;
                }
            });
        }
        // else {
        //     const tableRows = document.querySelectorAll("table tbody tr");
        //     tableRows.forEach(row => {
        //         const rowData = [];
        //         const cells = row.querySelectorAll("td");
        //         const dataWithoutLastOne = Array.from(cells).slice(0, -1);
        //         dataWithoutLastOne.forEach(cell => {
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
        worksheet.getCell('A1').value = ' Tickets List';
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
            a.download = 'tickets.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    return (
        <Fragment>
            <Row>
                <Col sm="12" lg="12" xl="12">
                    <Card className="browser-widget m-b-10">
                        <CardBody className="media">
                            <div className="media-img">
                                <Image
                                    attrImage={{ src: countImage, alt: "" }}
                                />
                            </div>
                            <div
                                className="media-body align-self-center"
                                style={{ columnCount: 4 }}
                            >
                                <div>
                                    <P>New Tickets </P>
                                    <H4>
                                        <CountUp
                                            end={totalCount?.new}
                                            duration={5}
                                        />
                                    </H4>
                                </div>
                                <div>
                                    <P>Opened Tickets </P>
                                    <H4>
                                        <CountUp
                                            end={totalCount?.opened}
                                            duration={5}
                                        />
                                    </H4>
                                </div>
                                <div>
                                    <P>Partly Closed Tickets </P>
                                    <H4>
                                        <CountUp
                                            end={totalCount?.part_closed}
                                            duration={5}
                                        />
                                    </H4>
                                </div>
                                <div>
                                    <P>Closed </P>
                                    <H4>
                                        <CountUp
                                            end={totalCount?.closed}
                                            duration={5}
                                        />
                                    </H4>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Col>
                <Card className="m-b-10">
                    <CardHeader
                        className=" py-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: "pointer" }}
                    >
                        <H5>Search Tickets</H5>
                        <i
                            className={`icon-angle-${isOpen ? "down" : "left"}`}
                            style={{ fontSize: "20px" }}
                        ></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody className="p-t-0">
                            <div className="search-panel mb-3">
                                <label className="f-12">
                                    Searching Fields:{" "}
                                </label>
                                <Select
                                    onChange={(e) =>
                                        handleSearchInputsOnChange(e)
                                    }
                                    options={options}
                                    className="js-example-placeholder-multiple col-sm-12"
                                    isMulti
                                />
                            </div>
                            <div className="search-panel">
                                {selectedSearchCol.length > 0 && (
                                    <form onSubmit={searchTickets}>
                                        <Row className="pb-3">
                                            {selectedSearchCol.indexOf("id") >
                                                -1 && (
                                                <Col md="3">
                                                    <FormGroup id="idInput">
                                                        <Label className="col-form-label-sm f-12">
                                                            {"Ticket Number"}
                                                            <Btn
                                                                attrBtn={{
                                                                    datatoggle:
                                                                        "tooltip",
                                                                    title: "Add More Fields",
                                                                    color: "btn px-2 py-0",
                                                                    onClick: (
                                                                        e
                                                                    ) =>
                                                                        addBtn(
                                                                            e,
                                                                            "idInput"
                                                                        ),
                                                                }}
                                                            >
                                                                <i className="fa fa-plus-circle"></i>
                                                            </Btn>
                                                            <Btn
                                                                attrBtn={{
                                                                    datatoggle:
                                                                        "tooltip",
                                                                    title: "Delete Last Row",
                                                                    color: "btn px-2 py-0",
                                                                    onClick: (
                                                                        e
                                                                    ) =>
                                                                        delBtn(
                                                                            e,
                                                                            "idInput"
                                                                        ),
                                                                }}
                                                            >
                                                                <i className="fa fa-minus-circle"></i>
                                                            </Btn>
                                                        </Label>
                                                        <Input
                                                            className="form-control form-control-sm idInput mb-1"
                                                            type="text"
                                                            name="id"
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "request_type"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Ticket Type"}
                                                        </Label>
                                                        <Select
                                                            id="request_type"
                                                            required
                                                            name="request_type"
                                                            options={[
                                                                {
                                                                    value: "1",
                                                                    label: "New Resource",
                                                                },
                                                                {
                                                                    value: "2",
                                                                    label: "Price Inquiry",
                                                                },
                                                                {
                                                                    value: "3",
                                                                    label: "General",
                                                                },
                                                                {
                                                                    value: "4",
                                                                    label: "Resources Availability",
                                                                },
                                                                {
                                                                    value: "5",
                                                                    label: "CV Request",
                                                                },
                                                            ]}
                                                            className="js-example-basic-multiple prefixInput mb-1"
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "service"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Service"}
                                                        </Label>
                                                        <Select
                                                            name="service"
                                                            id="service"
                                                            required
                                                            options={optionsS}
                                                            className="js-example-basic-single "
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "services",
                                                                    "service",
                                                                    setOptionsS,
                                                                    optionsS
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "task_type"
                                            ) > -1 && (
                                                <Col md="4">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Task Type"}
                                                        </Label>
                                                        <Select
                                                            id="task_type"
                                                            required
                                                            name="task_type"
                                                            options={optionsTY}
                                                            className="js-example-basic-single "
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "task_type",
                                                                    "task_type",
                                                                    setOptionsTY,
                                                                    optionsTY
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "source_lang"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Source"}
                                                        </Label>
                                                        <Select
                                                            name="source_lang"
                                                            id="source_lang"
                                                            required
                                                            options={optionsSL}
                                                            className="js-example-basic-single "
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "languages",
                                                                    "source_lang",
                                                                    setOptionsSL,
                                                                    optionsSL
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "target_lang"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Target"}
                                                        </Label>
                                                        <Select
                                                            name="target_lang"
                                                            id="target_lang"
                                                            required
                                                            options={optionsTL}
                                                            className="js-example-basic-single "
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "languages",
                                                                    "target_lang",
                                                                    setOptionsTL,
                                                                    optionsTL
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "subject"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {
                                                                "Main-Subject Matter"
                                                            }
                                                        </Label>
                                                        <Select
                                                            name="subject"
                                                            id="subject"
                                                            required
                                                            options={
                                                                optionsMain
                                                            }
                                                            className="js-example-basic-single"
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "MainSubjectMatter",
                                                                    "subject",
                                                                    setOptionsMain,
                                                                    optionsMain
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "region"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Region"}
                                                        </Label>
                                                        <Select
                                                            name="region"
                                                            id="region"
                                                            required
                                                            options={optionsR}
                                                            className="js-example-basic-single"
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "regions",
                                                                    "region",
                                                                    setOptionsR,
                                                                    optionsR
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "division"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Division"}
                                                        </Label>
                                                        <Select
                                                            name="division"
                                                            id="division"
                                                            required
                                                            options={optionsD}
                                                            className="js-example-basic-single"
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "division",
                                                                    "division",
                                                                    setOptionsD,
                                                                    optionsD
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "software"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Software"}
                                                        </Label>
                                                        <Select
                                                            name="software"
                                                            id="software"
                                                            required
                                                            options={optionsT}
                                                            className="js-example-basic-single "
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "tools",
                                                                    "software",
                                                                    setOptionsT,
                                                                    optionsT
                                                                )
                                                            }
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "status"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Status"}
                                                        </Label>
                                                        <Select
                                                            id="status"
                                                            required
                                                            name="status"
                                                            options={[
                                                                {
                                                                    value: "0",
                                                                    label: "Rejected",
                                                                },
                                                                {
                                                                    value: "1",
                                                                    label: "New",
                                                                },
                                                                {
                                                                    value: "2",
                                                                    label: "Opened",
                                                                },
                                                                {
                                                                    value: "3",
                                                                    label: "Partly Closed",
                                                                },
                                                                {
                                                                    value: "4",
                                                                    label: "Closed",
                                                                },
                                                                {
                                                                    value: "5",
                                                                    label: "Closed Waiting Requester Acceptance",
                                                                },
                                                            ]}
                                                            className="js-example-basic-multiple typeInput mb-1"
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "requester_function"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {
                                                                "Requester Function"
                                                            }
                                                        </Label>
                                                        <Select
                                                            id="requester_function"
                                                            required
                                                            name="requester_function"
                                                            options={[
                                                                {
                                                                    value: "1",
                                                                    label: "SAM",
                                                                },
                                                                {
                                                                    value: "2",
                                                                    label: "PM",
                                                                },
                                                            ]}
                                                            className="js-example-basic-multiple mb-1"
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}{" "}
                                            {selectedSearchCol.indexOf(
                                                "created_by"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Requester Name"}
                                                        </Label>
                                                        <Select
                                                            name="created_by"
                                                            id="created_by"
                                                            required
                                                            options={optionsU}
                                                            className="js-example-basic-single "
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf(
                                                "brand"
                                            ) > -1 && (
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Label
                                                            className="col-form-label-sm f-12"
                                                            htmlFor="name"
                                                        >
                                                            {"Brand"}
                                                        </Label>
                                                        <Select
                                                            id="brand"
                                                            required
                                                            name="brand"
                                                            options={optionsB}
                                                            className="js-example-basic-single "
                                                            isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            )}
                                            {selectedSearchCol.indexOf("date") >
                                                -1 && (
                                                <>
                                                    <Col md="4">
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12">
                                                                {"Date From"}
                                                            </Label>
                                                            <Input
                                                                className="form-control digits"
                                                                type="date"
                                                                defaultValue=""
                                                                name="start_date"
                                                                required
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="4">
                                                        <FormGroup>
                                                            <Label className="col-form-label-sm f-12">
                                                                {"Date To"}
                                                            </Label>
                                                            <Input
                                                                className="form-control digits"
                                                                type="date"
                                                                defaultValue=""
                                                                name="end_date"
                                                                required
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                        <Row className="b-t-primary p-t-20">
                                            <Col>
                                                <div className="d-inline">
                                                    <Btn
                                                        attrBtn={{
                                                            color: "btn btn-primary-gradien",
                                                            className:
                                                                "btn-sm ",
                                                            type: "submit",
                                                        }}
                                                    >
                                                        <i className="fa fa-search me-1"></i>{" "}
                                                        Search
                                                    </Btn>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                )}
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
            <Col sm="12">
                <Card>
                    <CardHeader className="px-3 d-flex justify-content-between align-items-center py-3">
                        <div className="w-100 text-end">
                            <ButtonGroup>
                                <FormatTable
                                    title="Tickets table formatting"
                                    Columns={[
                                        { value: "brand", label: "Brand" },
                                        {
                                            value: "request_type",
                                            label: "Request Type",
                                        },
                                        { value: "service", label: "Service" },
                                        {
                                            value: "task_type",
                                            label: "Task Type",
                                        },
                                        { value: "rate", label: "Rate" },
                                        { value: "count", label: "Count" },
                                        { value: "unit", label: "Unit" },
                                        {
                                            value: "currency",
                                            label: "Currency",
                                        },
                                        {
                                            value: "source_lang",
                                            label: "Source Language",
                                        },
                                        {
                                            value: "target_lang",
                                            label: "Target Language",
                                        },
                                        {
                                            value: "start_date",
                                            label: "Start Date",
                                        },
                                        {
                                            value: "delivery_date",
                                            label: "Delivery Date",
                                        },
                                        {
                                            value: "subject",
                                            label: "Subject Matter",
                                        },
                                        {
                                            value: "software",
                                            label: "Software",
                                        },
                                        { value: "status", label: "Status" },
                                        {
                                            value: "created_by",
                                            label: "Created By",
                                        },
                                        {
                                            value: "requester_function",
                                            label: "Requester Function",
                                        },
                                        {
                                            value: "division",
                                            label: "Division",
                                        },
                                        { value: "region", label: "Region" },
                                        {
                                            value: "created_at",
                                            label: "Created At",
                                        },
                                    ]}
                                    table="vm_tickets"
                                    formats={formats}
                                    FormatsChanged={handleFormatsChanged}
                                />
                                {tickets.length > 0 && (
                                    <Btn
                                        attrBtn={{
                                            color: "btn btn-primary-gradien",
                                            onClick: EX,
                                        }}
                                    >
                                        Export to Excel
                                    </Btn>
                                )}
                            </ButtonGroup>
                        </div>
                    </CardHeader>
                    <CardBody className="pt-0 px-3">
                        <div className="table-responsive">
                            {loading2 ? (
                                <div className="loader-box">
                                    <Spinner
                                        attrSpinner={{ className: "loader-6" }}
                                    />
                                </div>
                            ) : (
                                <Table hover>
                                    <thead>
                                        <tr>
                                            {headerFields.map(
                                                (field, fieldIndex) => (
                                                    <th
                                                        key={fieldIndex}
                                                        onClick={() =>
                                                            handleSort(field)
                                                        }
                                                    >
                                                        {formatString(field)}
                                                        {sortConfig.key ===
                                                            field &&
                                                            (sortConfig.direction ===
                                                            "asc"
                                                                ? "▲"
                                                                : "▼")}
                                                    </th>
                                                )
                                            )}
                                            <th scope="col">View Ticket</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            tickets.map((item, index) => (
                                                <tr key={index}>
                                                    {fields.map(
                                                        (field, fieldIndex) => (
                                                            <td
                                                                key={fieldIndex}
                                                            >
                                                                {field ===
                                                                    "id" ||
                                                                field ===
                                                                    "ticket_id" ? (
                                                                    <a
                                                                        href={`/vm/ViewTicket?data=${encodeURIComponent(
                                                                            encryptData(
                                                                                item
                                                                            )
                                                                        )}`}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e.button ===
                                                                                    1 ||
                                                                                e.ctrlKey ||
                                                                                e.metaKey
                                                                            )
                                                                                return;
                                                                            e.preventDefault();
                                                                            navigate(
                                                                                `/vm/ViewTicket?data=${encodeURIComponent(
                                                                                    encryptData(
                                                                                        item
                                                                                    )
                                                                                )}`
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            textDecoration:
                                                                                "underline",
                                                                            color: "#007bff",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        {typeof item[
                                                                            field
                                                                        ] ===
                                                                            "object" &&
                                                                        item[
                                                                            field
                                                                        ] !==
                                                                            null
                                                                            ? item[
                                                                                  field
                                                                              ]
                                                                                  .name ||
                                                                              item[
                                                                                  field
                                                                              ]
                                                                                  .user_name ||
                                                                              "No Name"
                                                                            : item[
                                                                                  field
                                                                              ]}
                                                                    </a>
                                                                ) : typeof item[
                                                                      field
                                                                  ] ===
                                                                      "object" &&
                                                                  item[
                                                                      field
                                                                  ] !== null ? (
                                                                    item[field]
                                                                        .name ||
                                                                    item[field]
                                                                        .user_name ||
                                                                    "No Name"
                                                                ) : (
                                                                    item[field]
                                                                )}
                                                            </td>
                                                        )
                                                    )}
                                                    <td>
                                                        <a
                                                            href={`/vm/ViewTicket?data=${encodeURIComponent(
                                                                encryptData(
                                                                    item
                                                                )
                                                            )}`}
                                                            onClick={(e) => {
                                                                if (
                                                                    e.button ===
                                                                        1 ||
                                                                    e.ctrlKey ||
                                                                    e.metaKey
                                                                )
                                                                    return;
                                                                e.preventDefault();
                                                                navigate(
                                                                    `/vm/ViewTicket?data=${encodeURIComponent(
                                                                        encryptData(
                                                                            item
                                                                        )
                                                                    )}`
                                                                );
                                                            }}
                                                            style={{
                                                                textDecoration:
                                                                    "none",
                                                                color: "inherit",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <i className="icofont icofont-ui-edit"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    scope="row"
                                                    colSpan={
                                                        fields.length
                                                            ? fields.length + 1
                                                            : 19
                                                    }
                                                    className="text-center bg-light f-14"
                                                >
                                                    No Data Available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </div>

                        {pageLinks && pageLinks.length > 3 && (
                            <div className="mt-5">
                                <Pagination
                                    aria-label="Page navigation example"
                                    className="pagination justify-content-end pagination-primary"
                                >
                                    {pageLinks.map((link, i) => (
                                        <PaginationItem
                                            key={i}
                                            active={link.active}
                                            className={`${
                                                link.url ? "" : "disabled"
                                            }`}
                                            onClick={() =>
                                                handlePageChange(
                                                    link.url
                                                        ? link.url
                                                              .split("page=")
                                                              .pop()
                                                        : 0
                                                )
                                            }
                                        >
                                            <PaginationLink
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            ></PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </Pagination>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default TicketsList;