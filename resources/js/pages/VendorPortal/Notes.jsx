import axiosClient from '../AxiosClint';
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Table } from 'reactstrap';
import { BreadcrumbsPortal, Btn, LI, P, UL, H6, Image } from '../../AbstractElements';
import { useStateContext } from '../context/contextAuth';
import { toast } from 'react-toastify';

const Notes = () => {
    const baseURL = "/Portal/Admin";
    const { user } = useStateContext();
    const [notes, setNotes] = useState([]);
    const [read, setRead] = useState('0');

    useEffect(() => {
        if (user) {
            const payload = {
                'email': user.email,
            };
            axiosClient.post(baseURL + "/getVmNotes", payload)
                .then(({ data }) => {
                    setNotes(data?.Notes);
                });

        }
    }, [user, read]);


    const readNote = (noteId) => {
        axiosClient.post(baseURL + "/readVmNotes", { 'vendor': user.id, 'message_id': noteId })
            .then(({ data }) => {
                switch (data.type) {
                    case 'success':
                        toast.success(data.message);
                        break;
                    case 'error':
                        toast.error(data.message);
                        break;
                }
                setRead(1);

            });

    };
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="Notes" parent="Notes" title="Read Notes" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card >
                            <CardBody >
                                <div className="table-responsive">
                                    <Table>
                                        <thead></thead>
                                        <tbody>
                                            {notes && notes.length ? (
                                                <>
                                                    {notes.map((item, i) =>
                                                    (
                                                        <tr key={i}>
                                                            <td>
                                                                <P attrPara={{ className: 'task_title_0 f-w-600 font-primary' }} >{"Vendor management"}</P>

                                                            </td>
                                                            <td>
                                                                <p className='task_desc_0' dangerouslySetInnerHTML={{ __html: item.content }} />
                                                            </td>

                                                            <td className='text-end'>
                                                                {item.is_read == 0 ?
                                                                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm p-1 me-3", color: "default", onClick: () => readNote(item.id), }}>
                                                                        {'Mark As Read'}
                                                                    </Btn> :
                                                                    <>
                                                                        <i className="icon-check font-primary" style={{ marginRight: '-8px' }}></i> <i className="icon-check me-2 font-primary"></i>
                                                                    </>
                                                                }
                                                                <span className='f-w-500'>  {new Date(item.updated_at).toLocaleString()}</span>


                                                            </td>
                                                        </tr>
                                                    ))
                                                    }
                                                </>
                                            )
                                                : <tr><td><div className="no-favourite"><span>{'No Data Found'}</span></div></td></tr>
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment >
    );
};

export default Notes;