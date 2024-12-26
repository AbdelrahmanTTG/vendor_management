import axiosClient from '../../AxiosClint';
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Table, TabContent, TabPane, Nav, NavItem, NavLink, InputGroup, Input } from 'reactstrap';
import { BreadcrumbsPortal, Btn, LI, P, UL, H6, Image } from '../../../AbstractElements';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { useStateContext } from '../../context/contextAuth';
import { Link, Navigate, useLocation } from 'react-router-dom';
import comment from '../../../assets/images/user/user.png';
import { toast } from 'react-toastify';
import { Edit } from 'react-feather';
import FinishModal from './FinishModal';
import PlanModal from './PlanModal';

const ViewJob = () => {
    const baseURL = "/Portal/Vendor";
    const { user } = useStateContext();
    const [redirect, setRedirect] = useState(false);
    const location = useLocation();
    const id = location.state;
    const [pageTask, setPageTask] = useState([]);
    const [notes, setNotes] = useState([]);
    const [history, setHistory] = useState([]);
    const [vmConfig, setVmConfig] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [activeTab, setActiveTab] = useState('1');
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const toggle = () => setModal(!modal);
    const toggle2 = () => setModal2(!modal2);

    useEffect(() => {
        if (!id) {
            setRedirect(true);
        } else {
            const payload = {
                'vendor': user.id,
                'id': id,
            };
            axiosClient.post(baseURL + "/viewJob", payload)
                .then(({ data }) => {
                    const [Task] = [(data?.Task)];
                    const [Notes] = [(data?.Notes)];
                    const [History] = [(data?.History)];
                    setPageTask(Task);
                    setNotes(Notes);
                    setHistory(History);
                    setVmConfig(data?.vmConfig);
                });
        }
    }, [user]);

    // send message
    const handleMessageChange = (message) => {
        setMessageInput(message);
    };
    const handleMessagePress = (e) => {
        if (e.key === "Enter" || e === "send") {
            if (messageInput.length > 0) {
                axiosClient.post(baseURL + "/sendMessage", { 'vendor': user.id, 'task_id': pageTask.id, 'message': messageInput })
                    .then(({ data }) => {
                        switch (data.msg.type) {
                            case 'success':
                                toast.success(data.msg.message);
                                break;
                            case 'error':
                                toast.error(data.msg.message);
                                break;
                        }
                        setNotes(data.Notes);

                    });
                setMessageInput("");
            }
        }
    };
    // end send message
    const vendorRes = {
        'vendor': user.id,
        'id': pageTask.id,

    };
    if (redirect) {
         return <Navigate to='/Vendor/' />;
    }
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle={pageTask.code} parent="My Jobs" title="Job Details" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className='b-t-primary'>
                                <FinishModal isOpen={modal} title={'Finish and Send File'} toggler={toggle} fromInuts={vendorRes} vmConfig={vmConfig} ></FinishModal>
                                <PlanModal isOpen={modal2} title={'Send Reply'} toggler={toggle2} fromInuts={vendorRes} ></PlanModal>

                                <div className="pro-group pb-0" style={{ textAlign: 'right' }}>
                                    {pageTask.status == 0 && (
                                        <div className="pro-shop">
                                            <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: toggle }}><i className="icofont icofont-check-circled me-2"></i> {'Finished This Job'}</Btn>
                                        </div>
                                    )}
                                    {pageTask.status == 7 && (
                                        <div className="pro-shop ">
                                            <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2', onClick: toggle2 }}><i className="icofont icofont-reply me-2"></i> {'Send Reply'}</Btn>
                                        </div>
                                    )}
                                </div>
                                <Nav tabs className="border-tab">
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '1' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('1')}}>
                                            <i className="icofont icofont-list me-1"></i>{'Details'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '2' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('2')}}>
                                            <i className="icofont icofont-clip me-1"></i>{'Files'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '3' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('3')}}>
                                            <i className="icofont icofont-file-document me-1"></i>{'Instruction'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '4' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('4')}}>
                                            <i className="icofont icofont-ui-messaging me-1"></i>{'Notes'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '5' ? 'active' : ''} onClick={(e) => {e.preventDefault();setActiveTab('5')}}>
                                            <i className="icofont icofont-history me-1"></i>{'Job history'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <Card >
                                            <CardBody>
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
                                            </CardBody>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Card >
                                            <CardBody>
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">{'Task File'}</th>
                                                            <td>
                                                                {pageTask.file != '' ? (
                                                                    <Link to={pageTask.fileLink}> <Btn attrBtn={{ color: 'secondary', className: 'btn btn-secondary' }}> {'View Task'}</Btn></Link>
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
                                            </CardBody>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <Card >
                                            <CardBody>
                                                <p className='mb-0 m-t-20' dangerouslySetInnerHTML={{ __html: pageTask.insrtuctions }} />
                                            </CardBody>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="4">
                                        <Card className="chat-box">
                                            <CardBody className='chat-right-aside'>
                                                <div className='chat'>
                                                    <div className='chat-history chat-msg-box custom-scrollbar h-auto mb-0'>
                                                        <UL className="chatingdata">
                                                            {notes.map((item, i) =>
                                                                <LI attrLI={{ className: "clearfix" }} key={i}>
                                                                    <div className={`message w-100  ${item.from != 1 ? "my-message " : "other-message pull-right"}`}>
                                                                        <Image
                                                                            attrImage={{
                                                                                src: `${comment}`,
                                                                                className: `rounded-circle ${item.from != 1 ? "float-start " : "float-end "} chat-user-img img-30`,
                                                                                alt: "",
                                                                            }}
                                                                        />
                                                                        <div className={`message-data ${item.from != 1 ? "text-end " : ""}`}>
                                                                            <span className='message-data-time'>{new Date(item.created_at).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className='message-data'>
                                                                            {/* {item.from == 1 ?( */}
                                                                            {/*    <H6 attrH6={{ className: 'mt-0 txt-primary' }} >{item.created_by}</H6> ) */}
                                                                            {/*  :''} */}
                                                                            {item.message}
                                                                        </div>
                                                                    </div>
                                                                </LI>
                                                            )}
                                                        </UL>
                                                    </div>
                                                    <div className="chat-message clearfix" style={{ position: 'relative' }}>
                                                        <div className="row">
                                                            <Col xl='12' className='d-flex'>
                                                                <InputGroup className='text-box'>
                                                                    <Input type='text' className='form-control input-txt-bx' placeholder='Type a message......' value={messageInput} onChange={(e) => handleMessageChange(e.target.value)} />
                                                                    <Btn
                                                                        attrBtn={{
                                                                            color: "primary",
                                                                            onClick: () => handleMessagePress("send"),
                                                                        }}
                                                                    >
                                                                        Send
                                                                    </Btn>
                                                                </InputGroup>
                                                            </Col>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="5">
                                        <Card >
                                            <CardBody>
                                                <VerticalTimeline layout={'1-column'}>
                                                    {history.map((item, i) =>
                                                        <VerticalTimelineElement key={i}
                                                            className="vertical-timeline-element--work"
                                                            animate={true}
                                                            date={new Date(item.created_at).toLocaleString()}
                                                            icon={<Edit />}>
                                                            <H6 attrH6={{ className: 'vertical-timeline-element-subtitle f-14' }}>{item.status}</H6>
                                                            <P>
                                                                {item.comment}
                                                            </P>
                                                        </VerticalTimelineElement>
                                                    )}
                                                </VerticalTimeline>
                                            </CardBody>
                                        </Card>
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

export default ViewJob;