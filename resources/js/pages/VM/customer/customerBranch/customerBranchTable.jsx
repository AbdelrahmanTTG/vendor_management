import React, { Fragment, useContext } from 'react';
import { Col, Card, CardHeader, Table } from 'reactstrap';
import { H5 } from '../../../AbstractElements';

const CustomerBranchTable = () => {
    // const { data } = useContext(TableContext);

    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader>
                        <H5>Customers Branches</H5>
                        {/* <span>{'Use a class'} <code> {'table-hover'} </code> {'to enable a hover state on table rows within a'} <code>{'tbody'}</code>.</span> */}
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'ID'}</th>
                                    <th scope="col">{'Name'}</th>
                                    <th scope="col">{'Source'}</th>
                                    <th scope="col">{'Region'}</th>
                                    <th scope="col">{'Country'}</th>
                                    <th scope="col">{'Type'}</th>
                                    <th scope="col">{'Assigned SAM'}</th>
                                    <th scope="col">{'Assigned PM'}</th>
                                    <th scope="col">{'Status'}</th>
                                    <th scope="col">{'Approved'}</th>
                                    <th scope="col">{'Created By'}</th>
                                    <th scope="col">{'Created At'}</th>
                                    <th scope="col">{'Edit'}</th>
                                    <th scope="col">{'Delete'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {
                                    data.map((item) =>
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.first_name}</td>
                                            <td>{item.last_name}</td>
                                            <td>{item.user_name}</td>
                                            <td>{item.role}</td>
                                            <td>{item.country}</td>
                                        </tr>
                                    )
                                } */}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </Col>
        </Fragment>
    );
};

export default CustomerBranchTable;