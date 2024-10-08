import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table, Media, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, LI, P, UL, H4 } from '../../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../context/contextAuth';
import { Link, useParams } from 'react-router-dom';

const ViewOffer = () => {
    const baseURL = window.location.origin;
    const [pageTask, setPageTask] = useState([]);

    const { user } = useStateContext();
    const { id, type } = useParams();

    const [activeTab, setActiveTab] = useState('1');
    const Discription = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum';

    useEffect(() => {
        if (user) {
            const payload = {
                'vendor': user.id,
                'id': id,
                'type': type,
            };

            axios.post(baseURL + "/Portal/Vendor/ViewOffer", payload)
                .then(({ data }) => {
                    console.log(data);
                    // const [Tasks] = [(data?.Tasks.data)];
                    const [Task] = [(data?.Task)];
                    // const [Links] = [(data?.Tasks.links)];
                    setPageTask(Task);

                });
        }
    }, [user]);

    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle={pageTask.code} parent="My Jobs" title="Job Details" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className=' b-t-primary'>
                                <div className="pro-group pb-0" style={{ textAlign: 'right' }}>
                                    <div className="pro-shop ">
                                        <Link to={`/app/ecommerce/cart`}> <Btn attrBtn={{ color: 'primary', className: 'btn btn-primary me-2' }}><i class="icofont icofont-check-circled me-2"></i> {'Accept'}</Btn></Link>
                                        <Btn attrBtn={{ color: 'secondary', className: 'btn btn-danger', onClick: () => addWishList(singleItem) }}><i class="icofont icofont-close-line-circled me-2"></i>{'Reject'} </Btn>
                                    </div>
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
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
                                            {'Notes'}
                                        </NavLink>
                                        <div className="material-border"></div>
                                    </NavItem>
                                    <NavItem id="myTab" role="tablist">
                                        <NavLink href="#javascript" className={activeTab === '4' ? 'active' : ''} onClick={() => setActiveTab('4')}>
                                            {'Job history'}
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
                                                            <Link to={pageTask.fileLink}> <Btn attrBtn={{ color: 'secondary', className: 'btn btn-secondary' }}> {'View Task'}</Btn></Link>
                                                        ) : (
                                                            <P attrPara={{ className: 'txt-danger f-w-600' }}>{'No File Found'}</P>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <P attrPara={{ className: 'mb-0 m-t-20' }}> {Discription}</P>
                                    </TabPane>
                                    <TabPane tabId="4">
                                        <P attrPara={{ className: 'mb-0 m-t-20' }}>{Discription}</P>
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