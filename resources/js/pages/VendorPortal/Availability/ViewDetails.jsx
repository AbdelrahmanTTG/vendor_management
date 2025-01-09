import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { BreadcrumbsPortal, Btn, P, UL, Image, H6, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../context/contextAuth';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import user1 from '../../../assets/images/user/user.png';
import SweetAlert from 'sweetalert2';
import RejectModal from './RejectModal';

const ViewOffer = () => {
    const navigate = useNavigate();
    const baseURL = "/Portal/Vendor/";
    const [redirect, setRedirect] = useState(false);
    const location = useLocation();
    const availabilityId = location.state;
    const [availabilityPage, setAvailabilityPage] = useState({});
    const { user } = useStateContext();
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [loading, setLoading] = useState(true);
    const payload = {
        'user': user.id,
        'id': availabilityId,
    };
    useEffect(() => {
        if (!availabilityId) {
            setRedirect(true);
        } else {
            axiosClient.post(baseURL + "viewAvailabilityCheck", payload)
                .then(({ data }) => {
                    setAvailabilityPage(data?.availabilityPage);
                    setLoading(false);
                });
        }
    }, [user, availabilityId]);

    const add_minutes = function (dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }
    const acceptAvailability = () => {
        SweetAlert.fire({
            title: 'Are you sure ?',
            icon: 'success',
            confirmButtonText: 'Accept',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',

        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.post(baseURL + "acceptAvailability", payload)
                    .then(({ data }) => {
                        switch (data.type) {
                            case 'success':
                                toast.success(data.message);
                                break;
                            case 'error':
                                toast.error(data.message);
                                break;
                        }
                        navigate("/Vendor/Availability", { replace: true });
                    });
            }
        });
    };

    if (redirect) {
        return <Navigate to='/Vendor/Availability' />;
    }
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="Availability Check" parent="Availability Check" title="Details" />
            <Container fluid={true}>
                <Row>
                    {loading ? (
                        <div className="loader-box" >
                            <Spinner attrSpinner={{ className: 'loader-6' }} />
                        </div>
                    ) :
                        <Col sm="12">
                            {availabilityPage ?
                                <Card>
                                    <CardBody className=' b-t-primary email-wrap'>
                                        <div className="email-right-aside">
                                            <Card className="email-body">
                                                <div className="email-profile">
                                                    <div className="email-right-aside">
                                                        <div className="email-body">
                                                            <div className="email-content">
                                                                <div className="email-top">
                                                                    <Row>
                                                                        <Col xl="12">
                                                                            <div className="media"><Image attrImage={{
                                                                                className: 'me-3 rounded-circle'
                                                                                , src: `${user1}`, alt: ''
                                                                            }} />
                                                                                <div className="media-body">
                                                                                    <H6 attrH6={{ className: 'd-block' }}>{availabilityPage.email_from}</H6>
                                                                                    <P>{availabilityPage.email_subject}</P>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                <div className="email-wrapper">
                                                                    <div className="emailread-group">
                                                                        <div className="read-group">
                                                                            <div className="clearfix"></div>
                                                                            <p dangerouslySetInnerHTML={{ __html: availabilityPage.email_body }} ></p>
                                                                        </div>
                                                                        <div className="clearfix"></div>
                                                                    </div>
                                                                    <div className="emailread-group">
                                                                        <H6 attrH6={{ className: 'text-muted me-2' }}><i className="icofont icofont-clip"></i> ATTACHMENTS
                                                                            {availabilityPage.attach_file != null ? (
                                                                                <Link to={"https://aixnexus.com/erp/assets/uploads/vendorAvaliability/" + availabilityPage.attach_file} target="_blank" className='m-l-10'><i class="fa fa-download"></i> Download File</Link>
                                                                            ) : (
                                                                                <span className="text-muted m-l-10 txt-danger f-w-600">{'No File Found'}</span>
                                                                            )}
                                                                        </H6>
                                                                        <div className="clearfix"></div>
                                                                        <H6 attrH6={{ className: 'text-muted mt-3' }}><i class="icofont icofont-clock-time"></i> Due at :
                                                                            <span className="text-muted m-l-10 font-primary f-w-600">{add_minutes(new Date(availabilityPage.created_at), availabilityPage.duration).toLocaleString('en-GB')}</span></H6>
                                                                        <div className="clearfix"></div>
                                                                    </div>
                                                                    {availabilityPage.status == 1 &&
                                                                        <div className="emailread-group">
                                                                            <div className="action-wrapper">
                                                                                <UL attrUL={{ className: 'simple-list actions d-flex flex-row' }}>
                                                                                    <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: () => acceptAvailability() }}><i className="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn>
                                                                                    <Btn attrBtn={{ color: 'danger', className: 'btn btn-danger me-2', onClick: toggle }}><i className="icofont icofont-close-line-circled me-2"></i> {'Reject'}</Btn>
                                                                                </UL>
                                                                            </div>
                                                                            <RejectModal isOpen={modal} title={'Send Rejection'} toggler={toggle} fromInuts={payload} ></RejectModal>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </CardBody>
                                </Card>
                                :
                                <Card>
                                    <CardBody className=' b-t-primary email-wrap'>
                                        <H6>No Data Found</H6>
                                    </CardBody>
                                </Card>
                            }
                        </Col>
                    }
                </Row>
            </Container>
        </Fragment >
    );
};

export default ViewOffer;