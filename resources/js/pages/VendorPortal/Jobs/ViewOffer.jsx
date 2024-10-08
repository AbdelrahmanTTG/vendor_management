import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL, H4 } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../context/contextAuth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewOffer = () => { 
    const navigate = useNavigate();
    const baseURL = window.location.origin +"/Portal/Vendor/";
    const [pageTask, setPageTask] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const { user } = useStateContext();
    const { id, type } = useParams();

    useEffect(() => {
        if (user) {
            const payload = {
                'vendor': user.id,
                'id': id,
                'type': type,
            };

            axios.post(baseURL + "ViewOffer", payload)
                .then(({ data }) => {
                    const [Task] = [(data?.Task)];
                    setPageTask(Task);
                });
        }
    }, [user]);

    const rejectTask = (task) => {        
        if (!window.confirm("Are you sure you want to reject the offer?")) {
            return;
        }
        const vendorRes = {
            'vendor': user.id,
            'id': task.id,
        };
        axios.post(baseURL + "cancelOffer", vendorRes)
            .then(({ data }) => {
                switch (data.type) {
                    case 'success':
                        toast.success(data.message);
                        break;
                    case 'error':
                        toast.error(data.message);
                        break;
                }  
                navigate("/Vendor/Jobs",{ replace: true });             
            });
          

    };

    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle={pageTask.code} parent="My Jobs" title="Offer Details" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className=' b-t-primary'>
                                <div className="pro-group pb-0" style={{ textAlign: 'right' }}>
                                    {pageTask.offer_type == 'task' ? (
                                        <div className="pro-shop ">
                                            <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2' }}><i className="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn>
                                            <Btn onClick={(e) => rejectTask(pageTask)} attrBtn={{ color: 'secondary', className: 'btn btn-danger', onClick: () => rejectTask(pageTask) }}><i className="icofont icofont-close-line-circled me-2"></i>{'Reject'} </Btn>
                                        </div>
                                    ) : (
                                        <div className="pro-shop ">
                                            <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2' }}><i className="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn>
                                        </div>
                                    )
                                    }
                                </div>
                                <Nav tabs className="border-tab">
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                                            {'Details'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                                            {'Instruction'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>


                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <div className="table-responsive">
                                            <Table>
                                                <tbody>
                                                    <tr >
                                                        <th scope="row">{'Code'}</th>
                                                        <td>{pageTask.code}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Subject'}</th>
                                                        <td>{pageTask.subject}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Task Type'}</th>
                                                        <td>{pageTask.task_type?.name}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Rate'}</th>
                                                        <td>{pageTask.rate} {pageTask.currency?.name}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Volume'}</th>
                                                        <td>{pageTask.count} {pageTask.unit?.name}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Source Language'}</th>
                                                        <td>{pageTask.jobPrice?.source_name}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Target Language'}</th>
                                                        <td>{pageTask.jobPrice?.target_name}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Start Date'}</th>
                                                        <td>{pageTask.start_date}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Delivery Date'}</th>
                                                        <td>{pageTask.delivery_date}</td>
                                                    </tr>
                                                    <tr >
                                                        <th scope="row">{'Status'}</th>
                                                        <td><span className='badge badge-info p-2'>{pageTask.statusData}</span></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">{'Task File'}</th>
                                                    <td>
                                                        {pageTask.file != '' ? (
                                                            <Link to={pageTask.fileLink} target="_blank"> <Btn attrBtn={{ color: 'secondary', className: 'btn btn-secondary' }}> {'View Task'}</Btn></Link>
                                                        ) : (
                                                            <P attrPara={{ className: 'txt-danger f-w-600' }}>{'No File Found'}</P>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment >
    );
};

export default ViewOffer;