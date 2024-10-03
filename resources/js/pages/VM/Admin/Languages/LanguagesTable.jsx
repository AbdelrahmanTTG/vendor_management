import React, { Fragment, useContext } from 'react';
import { Col, Card, CardHeader, Table } from 'reactstrap';
import { H5, Btn } from '../../../../AbstractElements';
import AddBtn from './ModelAddLanguages'
const CustomerBranchTable = () => {
    // const { data } = useContext(TableContext);

    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5>Languages</H5>
                        <div className="ml-auto">
                            <AddBtn />
                        </div>
                    </CardHeader>
                    <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'ID'}</th>
                                    <th scope="col">{'Language'}</th>
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