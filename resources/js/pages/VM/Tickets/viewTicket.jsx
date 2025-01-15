import React, { Fragment, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import axiosClient from "../../AxiosClint";
import { useStateContext } from '../../context/contextAuth';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Btn, H5, P } from '../../../AbstractElements';
import ResponseModal from './ResponseModal';
import VmResponseModal from './VmResponseModal';

const ViewTicket = () => {
    const [redirect, setRedirect] = useState(false);
    const location = useLocation();
    const [ticketData, setTicketData] = useState([]);
    const { ticket } = location.state || {};
    const { user } = useStateContext();
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modal2, setModal2] = useState(false);
    const toggle2 = () => setModal2(!modal2);
    const [temp, setTemp] = useState(false);
    const changeData = () => setTemp(!temp);
    const res = {
        ticket_id: ticket.id,
        user: user.id,

    };
    useEffect(() => {
        if (!ticket) {
            setRedirect(true);
        } else {
            const fetchData = async () => {
                try {
                    const data = await axiosClient.post("getTicketData", res);
                    setTicketData(data.data);
                } catch (error) {
                    console.error('Error fetching Data:', error);
                }
            };
            fetchData();
        }
    }, [ticket, temp]);

    if (redirect) {
        return <Navigate to='/' />;
    }
    return (
        <Fragment>
            <Card >
                <CardHeader className=' b-l-primary p-b-0'>
                    <H5>Ticket Details</H5>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive">
                        <Table className='table-bordered mb-10'>
                            <thead>
                                <tr>
                                    <th scope="col" >{'Ticket Number'}</th>
                                    <th scope="col" >{'Request Type'}</th>
                                    <th scope="col" >{'Number Of Rescource'}</th>
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
                                    <th scope="col">{'File Attachment'}</th>
                                    <th scope="col">{'Status'}</th>
                                    <th scope="col">{'Created By'}</th>
                                    <th scope="col">{'Created At'}</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ticketData.id}</td>
                                    <td>{ticketData.request_type}</td>
                                    <td>{ticketData.number_of_resource}</td>
                                    <td>{ticketData.service}</td>
                                    <td>{ticketData.task_type}</td>
                                    <td>{ticketData.rate}</td>
                                    <td>{ticketData.count}</td>
                                    <td>{ticketData.unit}</td>
                                    <td>{ticketData.currency}</td>
                                    <td>{ticketData.source_lang}</td>
                                    <td>{ticketData.target_lang}</td>
                                    <td>{ticketData.start_date}</td>
                                    <td>{ticketData.delivery_date}</td>
                                    <td>{ticketData.subject}</td>
                                    <td>{ticketData.software}</td>
                                    <td>
                                        {ticketData.fileLink != null ? (
                                            <Link to={ticketData.fileLink} className='txt-dangers'>{'View File'}</Link>
                                        ) : (
                                            'No File Found'
                                        )}
                                    </td>
                                    <td>{ticketData.status}</td>
                                    <td>{ticketData.created_by}</td>
                                    <td>{ticketData.created_at}</td>
                                </tr>
                                <tr>
                                    <th>{'Comment'}</th>
                                    <td colSpan={18} dangerouslySetInnerHTML={{ __html: ticketData.comment }} ></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
            {/*  response */}
            <Card >
                <CardHeader className='b-t-primary p-b-0'>
                    <Row>
                        <Col sm="9">
                            <H5>  Ticket Response   </H5>
                        </Col>
                        <Col sm="3">
                            {ticketData.statusVal != 4 && (
                                <>
                                    <ResponseModal isOpen={modal} title={'Add Response'} toggler={toggle} fromInuts={res} sendDataToParent={toggle} changeTicketData={changeData}  ></ResponseModal>
                                    <div className="pro-shop text-end">
                                        <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: toggle }}><i className="icofont icofont-ui-messaging me-2"></i> {'Add Response'}</Btn>
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive">
                        <Table className='table-bordered mb-10'>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Response</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketData['Response'] ? (
                                    <>
                                        {ticketData['Response'].map((item, index) => (
                                            <tr key={index}>
                                                <td scope="row">{item.created_by}</td>
                                                <td scope="row">
                                                <p className='mb-0 m-t-20' dangerouslySetInnerHTML={{ __html: item.response }} /> 
                                                    <br />
                                                    {item.fileLink != null && (
                                                        <Link to={item.fileLink} className='txt-dangers'>{'View File'}</Link>
                                                    )}
                                                </td>
                                                <td scope="row">{item.created_at}</td>
                                            </tr>
                                        ))}
                                    </>
                                ) :
                                    <>
                                        <tr>
                                            <td colSpan="3" className='text-center'>NO Data Found</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
            {/*  action */}
            <Card >
                <CardHeader className='b-t-primary p-b-0'>
                    <Row>
                        <Col sm="9">
                            <H5>  Ticket Action   </H5>
                        </Col>                        
                    </Row>
                </CardHeader>
                <CardBody>
                 
                </CardBody>
            </Card>
            {/*  vm response */}
            <Card >
                <CardHeader className='b-t-primary p-b-0'>
                    <Row>
                        <Col sm="9">
                            <H5>  VM Team Ticket Comments  </H5>
                        </Col>
                        <Col sm="3">
                            {ticketData.statusVal != 4 && (
                                <>
                                    <VmResponseModal isOpen={modal2} title={'Add Comment'} toggler={toggle2} fromInuts={res} sendDataToParent={toggle2} changeTicketData={changeData}></VmResponseModal>
                                    <div className="pro-shop text-end">
                                        <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: toggle2 }}><i className="icofont icofont-ui-messaging me-2"></i> {'Add Comment'}</Btn>
                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive">
                        <Table className='table-bordered mb-10'>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Response</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketData['TeamResponse'] ? (
                                    <>
                                        {ticketData['TeamResponse'].map((item, index) => (
                                            <tr key={index}>
                                                <td scope="row">{item.created_by}</td>
                                                <td scope="row">
                                                    <p className='mb-0 m-t-20' dangerouslySetInnerHTML={{ __html: item.response }} />                                                 
                                                </td>
                                                <td scope="row">{item.created_at}</td>
                                            </tr>
                                        ))}
                                    </>
                                ) :
                                    <>
                                        <tr>
                                            <td colSpan="3" className='text-center'>NO Data Found</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
            {/*  time */}
            <Card >
                <CardHeader className='b-t-primary p-b-0'>
                    <Row>
                        <Col sm="12">
                            <H5>  Ticket Log  </H5>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive">
                        <Table className='table-bordered mb-10'>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Ticket Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>
                                        {ticketData.created_by}
                                    </td>
                                    <td>New</td>
                                    <td>
                                        {ticketData.created_at}
                                    </td>
                                </tr>
                                {ticketData['Time'] && (
                                    <>
                                        {ticketData['Time'].map((item, index) => (
                                            <tr key={index}>
                                                <td scope="row">{item.created_by}</td>
                                                <td scope="row">
                                                    {item.status}
                                                </td>
                                                <td scope="row">{item.created_at}</td>
                                            </tr>
                                        ))}
                                    </>
                                ) }
                                <tr className='bg-light '>
                                    <th>Time taken</th>
                                    <td colSpan={2}>{ticketData.TimeTaken}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </Fragment>
    );
};

export default ViewTicket;