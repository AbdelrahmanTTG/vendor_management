import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { BreadcrumbsPortal, Btn, P, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../context/contextAuth';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2';

const ViewOffer = () => {
    const navigate = useNavigate();
    const baseURL = "/Portal/Vendor/";
    const [pageTask, setPageTask] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const { user } = useStateContext();
    const [redirect, setRedirect] = useState(false);
    const location = useLocation();
    const { id, type } = location.state;
    const [loading, setLoading] = useState(true);
    const vendorRes = {
        'vendor': user.id,
        'id': pageTask.id,
    };
    useEffect(() => {
        if (!id || !type) {
            setRedirect(true);
        } else {
            const payload = {
                'vendor': user.id,
                'id': id,
                'type': type,
            };           

            axiosClient.post(baseURL + "viewOffer", payload)
                .then(({ data }) => {
                    const [Task] = [(data?.Task)];
                    setPageTask(Task);
                    setLoading(false);
                });
        }
    }, [user]);

    const rejectOffer = () => {
        SweetAlert.fire({
            title: 'Are you sure you want to reject the offer?',
            icon: 'warning',
            confirmButtonText: 'Yes,Reject',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',

        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.post(baseURL + "cancelOffer", vendorRes)
                    .then(({ data }) => {
                        switch (data.type) {
                            case 'success':
                                toast.success(data.message);
                                break;
                            case 'error':
                                toast.error(data.message);
                                break;
                        }
                        navigate("/Vendor/Jobs", { replace: true });
                    });
            }
        });
    };

    const acceptOffer = () => {
        SweetAlert.fire({
            title: 'Are you sure you want to accept the offer?',
            icon: 'success',
            confirmButtonText: 'Accept',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.post(baseURL + "acceptOffer", vendorRes)
                    .then(({ data }) => {
                        switch (data.type) {
                            case 'success':
                                toast.success(data.message);
                                break;
                            case 'error':
                                toast.error(data.message);
                                break;
                        }
                        navigate("/Vendor/Jobs", { replace: true });
                    });
            }
        });
    };
    const acceptOfferList = () => {
        SweetAlert.fire({
            title: 'Are you sure you want to accept the offer?',
            icon: 'success',
            confirmButtonText: 'Accept',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.post(baseURL + "acceptOfferList", vendorRes)
                    .then(({ data }) => {
                        switch (data.type) {
                            case 'success':
                                toast.success(data.message);
                                break;
                            case 'error':
                                toast.error(data.message);
                                break;
                        }
                        navigate("/Vendor/Jobs", { replace: true });
                    });
            }
        });
    };
    if (redirect) {
        return <Navigate to='/Vendor/' />;
    }
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle={pageTask.code} parent="My Jobs" title="Offer Details" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            {loading ? (
                                <div className="loader-box" >
                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                            ) :
                                <CardBody className=' b-t-primary'>
                                    <div className="pro-group pb-0" style={{ textAlign: 'right' }}>
                                        {pageTask.offer_type == 'task' && (
                                            <div className="pro-shop ">
                                                <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: () => acceptOffer() }}><i className="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn>
                                                <Btn attrBtn={{ color: 'secondary', className: 'btn btn-danger', onClick: () => rejectOffer() }}><i className="icofont icofont-close-line-circled me-2"></i>{'Reject'} </Btn>
                                            </div>
                                        )}
                                        {pageTask.offer_type == 'offer_list' && (
                                            <div className="pro-shop ">
                                                <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: () => acceptOfferList() }}><i className="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn>
                                            </div>
                                        )
                                        }
                                    </div>
                                    <Nav tabs className="border-tab">
                                        <NavItem id="myTab" role="tablist">
                                            <NavLink href="#javascript" className={activeTab === '1' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('1') }}>
                                                {'Details'}
                                            </NavLink>
                                            <div className="material-border"></div>
                                        </NavItem>
                                        <NavItem id="myTab" role="tablist">
                                            <NavLink href="#javascript" className={activeTab === '2' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('2') }}>
                                                {'Files'}
                                            </NavLink>
                                            <div className="material-border"></div>
                                        </NavItem>
                                        <NavItem id="myTab" role="tablist">
                                            <NavLink href="#javascript" className={activeTab === '3' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('3') }}>
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
                                                    <tr>
                                                        <th scope="row">{'Other File'}</th>
                                                        <td>
                                                            {pageTask.job_file != null ? (
                                                                <Link to={pageTask.job_fileLink}> <Btn attrBtn={{ color: 'secondary', className: 'btn btn-secondary' }}> {'View File'}</Btn></Link>
                                                            ) : (
                                                                <P attrPara={{ className: 'txt-danger f-w-600' }}>{'No File Found'}</P>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <p className='mb-0 m-t-20' dangerouslySetInnerHTML={{ __html: pageTask.insrtuctions }} />
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            }
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment >
    );
};

export default ViewOffer;