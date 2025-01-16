import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, Btn, Spinner } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../context/contextAuth';
import { Link } from 'react-router-dom';

const AllData = () => {
    const baseURL = "/Portal/Vendor";
    const [availabilityList, setAvailabilityList] = useState([]);
    const [uploadslink, setUploadslink] = useState('');
    const { user } = useStateContext();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            let payload;
            if (user.user_type == 'vendor') {
                payload = {
                    'user': user.id,
                };
            } else if (user.userType == 'admin') {
                payload = {
                    'userType': 'admin',
                    'user': 0,
                };
            }
            axiosClient.post(baseURL + "/getAvailabilityList", payload)
                .then(({ data }) => {
                    setAvailabilityList(data?.List);
                    setUploadslink(data?.uploads_link);
                    setLoading(false);
                });
        }
    }, [user]);

    const add_minutes = function (dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
    }
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="Availability Check" parent="Availability Check" title="" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className='b-l-primary'>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div className="loader-box" >
                                            <Spinner attrSpinner={{ className: 'loader-6' }} />
                                        </div>
                                    ) :
                                        <Table>
                                            <thead className="bg-primary">
                                                <tr>
                                                    <th scope="col">{'#'}</th>
                                                    {user.user_type != 'vendor' && (
                                                        <th scope="col">{'Vendor Name'}</th>
                                                    )}
                                                    <th scope="col">{'Created At'}</th>
                                                    <th scope="col">{'End Date'}</th>
                                                    <th scope="col">{'Email From'}</th>
                                                    <th scope="col">{'Email Subject'}</th>
                                                    <th scope="col">{'Attached File'}</th>
                                                    <th scope="col">{'Brand'}</th>
                                                    <th scope="col">{'Actions'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {availabilityList.length > 0 ? (
                                                    <>
                                                        {availabilityList.map((item, i) => (
                                                            <tr key={i}>
                                                                <th scope="row">{item.id} / {item.detid}</th>
                                                                {user.user_type != 'vendor' && (
                                                                    <td>{item.vendor}</td>
                                                                )}
                                                                <td>{new Date(item.created_at).toLocaleString('en-GB')}</td>
                                                                <td>{add_minutes(new Date(item.created_at), item.duration).toLocaleString('en-GB')}</td>
                                                                <td>{item.email_from}</td>
                                                                <td>{item.email_subject}</td>
                                                                <td>
                                                                    {item.attach_file != null ?
                                                                        <Link to={ uploadslink+'/vendorAvaliability/' + item.attach_file} target="_blank"><i className="icofont icofont-clip"></i> View File</Link>
                                                                        : (
                                                                            ''
                                                                        )}</td>
                                                                <td>{item.brand_name}</td>
                                                                <td>
                                                                    <Link to={`ViewDetails/`} state={item.detid}>
                                                                        <Btn button onClick={() => handleView(item)} attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
                                                                            View
                                                                        </Btn>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        }
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td scope="row" colSpan={8} className='text-center bg-light f-14' >{'No Data Available'}</td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </Table>
                                    }
                                </div>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default AllData;