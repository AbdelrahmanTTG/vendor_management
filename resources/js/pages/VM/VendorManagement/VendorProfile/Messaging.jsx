import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Input, InputGroup, InputGroupText, Collapse, Table, Label } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const Messaging = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
      setIsOpen(!isOpen);
  }
    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Instant Messaging</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                   <CardBody>
                   <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'Type'}</th>
                                    <th scope="col"></th>
                                    <th scope="col"><Btn attrBtn={{ color: 'btn btn-light' }}><i className="fa fa-plus-circle"></i></Btn></th>
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
                   </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Messaging;