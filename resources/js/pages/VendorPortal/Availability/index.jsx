import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, Btn, H5 } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../context/contextAuth';
import { Link } from 'react-router-dom';

const AllData = () => {
    const baseURL = "/Portal/Vendor";
    const [availabilityList, setAvailabilityList] = useState([]);
    const { user } = useStateContext();

    useEffect(() => {
        if (user) {
            const payload = {
                'user': user.id,
            };
            axiosClient.post(baseURL + "/getAvailabilityList", payload)
                .then(({ data }) => {                   
                    setAvailabilityList(data?.List);
                });
        }
    }, [user]);

    const add_minutes =  function (dt, minutes) {      
        return new Date(dt.getTime() + minutes*60000);      
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
                                    <Table>
                                        <thead className="bg-primary">
                                            <tr>
                                                <th scope="col">{'#'}</th>
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
                                                        <tr key={item.id}>
                                                            <th scope="row">{item.id} / {item.detid}</th>
                                                            <td>{new Date(item.created_at).toLocaleString('en-GB')}</td>
                                                            <td>{add_minutes(new Date(item.created_at), item.duration).toLocaleString('en-GB')}</td>
                                                            <td>{item.email_from}</td>
                                                            <td>{item.email_subject}</td>
                                                            <td>
                                                            {item.attach_file != null ? 
                                                             <Link to={'https://aixnexus.com/erp/assets/uploads/vendorAvaliability/'+item.attach_file} target="_blank"><i className="icofont icofont-clip"></i> View File</Link>
                                                             : (
                                                              ''
                                                            )}</td>
                                                            <td>{item.brand_name}</td>
                                                            <td>
                                                                <Link to={`ViewDetails/`} state= { item.detid }>
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