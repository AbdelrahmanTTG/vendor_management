import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import axiosClient from "../../AxiosClint";
import { Btn, H5, Spinner } from '../../../AbstractElements';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useStateContext } from '../../../pages/context/contextAuth';

const Report = ( props) => {
    const { user } = useStateContext();
    const [tickets, setTickets] = useState([]);
    const [pageLinks, setPageLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [optionsU, setOptionsU] = useState([]);
    const [queryParams, setQueryParams] = useState(null);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    console.log(props.permissions);

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

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
                permissions: props.permissions,
                user: user.id,
            };
            try {
                setLoading(true);
                await axiosClient.post("vmActivity", payload)
                    .then(({ data }) => {
                        if (data.type == 'error') {
                            toast.error(data.message);
                        } else {
                            setTickets(data?.Tickets);
                            setPageLinks(data?.Links);
                        }
                        setLoading(false);
                    });
            } catch (err) {
                console.error(err);
            }
        };
        if (queryParams != null)
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
                                            <th scope="col" >{'Opened By'}</th>
                                            <th scope="col" >{'Closed By'}</th>
                                            <th scope="col">{'Requester Name'}</th>
                                            <th scope="col">{'Number Of Rescource'}</th>
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
                                            <th scope="col">{'Request Time'}</th>
                                            <th scope="col">{'Time Of Opening'}</th>
                                            <th scope="col">{'Time Of CLosing'}</th>
                                            <th scope="col">{'Taken Time'}</th>
                                            <th scope="col">{'New Vendors'}</th>
                                            <th scope="col">{'Existing Vendors'}</th>
                                            <th scope="col">{'Existing Vendors with New Pairs'}</th>
                                            <th scope="col">{'Status'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            <>
                                                {tickets.map((item, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">{item.id}</td>
                                                        <td scope="row">{item.brand}</td>
                                                        <td scope="row">{item.opened_by}</td>
                                                        <td scope="row">{item.closed_by}</td>
                                                        <td scope="row">{item.created_by}</td>
                                                        <td scope="row">{item.number_of_resource}</td>
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
                                                        <td scope="row">{item.created_at}</td>
                                                        <td scope="row">{item.time_of_opening}</td>
                                                        <td scope="row">{item.time_of_closing}</td>
                                                        <td scope="row">{item.TimeTaken}</td>
                                                        <td scope="row">{item.new}</td>
                                                        <td scope="row">{item.existing}</td>
                                                        <td scope="row">{item.existing_pair}</td>
                                                        <td scope="row">{item.status}</td>
                                                    </tr>
                                                ))}

                                            </>
                                        ) : (
                                            <tr >
                                                <td scope="row" colSpan={27} className='text-center bg-light f-14' >{'No Data Available'}</td>
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