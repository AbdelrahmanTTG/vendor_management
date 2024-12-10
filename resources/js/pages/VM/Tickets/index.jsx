import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../../pages/AxiosClint";
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../../pages/context/contextAuth';
import { Btn, H4, H5, P, Image, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import CountUp from 'react-countup';
import countImage from '../../../assets/images/dashboard/safari.png';


const TicketsList = () => {
    const { user } = useStateContext();
    const [tickets, setTickets] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [totalCount, setTotalCount] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);
    const [optionsT, setOptionsT] = useState([]);
    const [optionsTL, setOptionsTL] = useState([]);
    const [optionsSL, setOptionsSL] = useState([]);
    const [optionsS, setOptionsS] = useState([]);
    const [optionsU, setOptionsU] = useState([]);
    const [optionsB, setOptionsB] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
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
        handelingSelectUsers();
    }, []);

    // search 
    const options = [
        { value: 'brand', label: 'Brand' },
        { value: 'id', label: 'Ticket Number' },
        { value: 'request_type', label: 'Ticket Type' },
        { value: 'status', label: 'Status' },
        { value: 'service', label: 'Service' },
        { value: 'source_lang', label: 'Source' },
        { value: 'target_lang', label: 'Target' },
        { value: 'software', label: 'Software' },
        { value: 'created_by', label: 'Requester Name' },

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

    useEffect(() => {
        try {
            axiosClient.post("getTicketsTotal").then(({ data }) => {
                setTotalCount(data?.Total);
            });

        } catch (err) {
            console.error(err);
        }

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
            };
            try {
                setLoading(true);
                const { data } = await axiosClient.post("getTickets", payload);
                setTickets(data?.Tickets);
                setPageLinks(data?.Links);
                setLoading(false);
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
            <Row>
                <Col sm="12" lg="12" xl="12">
                    <Card className="browser-widget m-b-10">
                        <CardBody className="media">
                            <div className="media-img">
                                <Image attrImage={{ src: countImage, alt: '' }} />
                            </div>
                            <div className="media-body align-self-center" style={{ 'columnCount': 4 }}>
                                <div>
                                    <P>New Tickets </P>
                                    <H4><CountUp end={totalCount?.new} duration={5} /></H4>
                                </div>
                                <div>
                                    <P>Opened Tickets </P>
                                    <H4><CountUp end={totalCount?.opened} duration={5} /></H4>
                                </div>
                                <div>
                                    <P>Partly Closed Tickets </P>
                                    <H4><CountUp end={totalCount?.part_closed} duration={5} /></H4>
                                </div>
                                <div>
                                    <P>Closed </P>
                                    <H4><CountUp end={totalCount?.closed} duration={5} /></H4>
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
                        style={{ cursor: 'pointer' }}
                    >
                        <H5>Search Tickets</H5>
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
                                    <form onSubmit={searchTickets}>
                                        <Row className="pb-3">
                                            {selectedSearchCol.indexOf("id") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup id='idInput'>
                                                        <Label className="col-form-label-sm f-12">{'Ticket Number'}<Btn attrBtn={{ datatoggle: "tooltip", title: "Add More Fields", color: 'btn px-2 py-0', onClick: (e) => addBtn(e, 'idInput') }}><i className="fa fa-plus-circle"></i></Btn>
                                                            <Btn attrBtn={{ datatoggle: "tooltip", title: "Delete Last Row", color: 'btn px-2 py-0', onClick: (e) => delBtn(e, 'idInput') }}><i className="fa fa-minus-circle"></i></Btn></Label>
                                                        <Input className='form-control form-control-sm idInput mb-1' type='text' name='id' required />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("request_type") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Ticket Type'}</Label>
                                                        <Select id='request_type' required
                                                            name='request_type'
                                                            options={
                                                                [
                                                                    { value: '1', label: 'New Resource' },
                                                                    { value: '2', label: 'Price Inquiry' },
                                                                    { value: '3', label: 'General' },
                                                                    { value: '4', label: 'Resources Availability' },
                                                                    { value: '5', label: 'CV Request' },
                                                                ]} className="js-example-basic-multiple prefixInput mb-1" isMulti
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
                                                                    { value: '0', label: 'Rejected' },
                                                                    { value: '1', label: 'New' },
                                                                    { value: '2', label: 'Opened' },
                                                                    { value: '3', label: 'Partly Closed' },
                                                                    { value: '4', label: 'Closed' },
                                                                    { value: '5', label: 'Closed Waiting Requester Acceptance' },
                                                                ]} className="js-example-basic-multiple typeInput mb-1" isMulti
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("service") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Service'}</Label>
                                                        <Select name='service' id='service' required
                                                            options={optionsS} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "services", "service", setOptionsS, optionsS)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("source_lang") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Source'}</Label>
                                                        <Select name='source_lang' id='source_lang' required
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
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Target'}</Label>
                                                        <Select name='target_lang' id='target_lang' required
                                                            options={optionsTL} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "languages", "target_lang", setOptionsTL, optionsTL)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("software") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Software'}</Label>
                                                        <Select name='software' id='software' required
                                                            options={optionsT} className="js-example-basic-single "
                                                            onInputChange={(inputValue) =>
                                                                handleInputChange(inputValue, "tools", "software", setOptionsT, optionsT)
                                                            }
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }
                                            {
                                                selectedSearchCol.indexOf("created_by") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Requester Name'}</Label>
                                                        <Select name='created_by' id='created_by' required
                                                            options={optionsU} className="js-example-basic-single "
                                                            isMulti />
                                                    </FormGroup>
                                                </Col>
                                            }{
                                                selectedSearchCol.indexOf("brand") > -1 &&
                                                <Col md='3'>
                                                    <FormGroup>
                                                        <Label className="col-form-label-sm f-12" htmlFor='name'>{'Brand'}</Label>
                                                        <Select id='brand' required
                                                            name='brand'
                                                            options={optionsB} className="js-example-basic-single "
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
                                            <th scope="col" >{'Ticket Number'}</th>
                                            <th scope="col" >{'Brand'}</th>
                                            <th scope="col" >{'Request Type'}</th>
                                            <th scope="col">{'Service'}</th>
                                            <th scope="col">{'Task Type	'}</th>
                                            <th scope="col">{'Rate'}</th>
                                            <th scope="col">{'Count'}</th>
                                            <th scope="col">{'Unit'}</th>
                                            <th scope="col">{'Currency'}</th>
                                            <th scope="col">{'Source Language'}</th>
                                            <th scope="col">{'Target Language'}</th>
                                            <th scope="col">{'Start Date'}</th>
                                            <th scope="col">{'Delivery Date'}</th>
                                            <th scope="col">{'Subject Matter'}</th>
                                            <th scope="col">{'Software'}</th>
                                            <th scope="col">{'Status'}</th>
                                            <th scope="col">{'Created By'}</th>
                                            <th scope="col">{'Created At'}</th>
                                            <th scope="col">{'View Ticket'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            <>
                                                {tickets.map((item, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{item.id}</td>
                                                        <td scope="row">{item.brand}</td>
                                                        <td scope="row">{item.request_type}</td>
                                                        <td scope="row">{item.service}</td>
                                                        <td scope="row">{item.task_type}</td>
                                                        <td scope="row">{item.rate}</td>
                                                        <td scope="row">{item.count}</td>
                                                        <td scope="row">{item.unit}</td>
                                                        <td scope="row">{item.currency}</td>
                                                        <td scope="row">{item.source_lang}</td>
                                                        <td scope="row">{item.target_lang}</td>
                                                        <td scope="row">{item.start_date}</td>
                                                        <td scope="row">{item.delivery_date}</td>
                                                        <td scope="row">{item.subject}</td>
                                                        <td scope="row">{item.software}</td>
                                                        <td scope="row">{item.status}</td>
                                                        <td scope="row">{item.created_by}</td>
                                                        <td scope="row">{item.created_at}</td>

                                                        <td>
                                                            <button onClick={() => handleView(item)} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
                                                                <i className="icofont icofont-ui-edit"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={19} className='text-center bg-light f-14' >{'No Data Available'}</td>
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

export default TicketsList;