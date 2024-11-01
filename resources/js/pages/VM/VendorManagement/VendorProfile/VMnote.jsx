import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row } from 'reactstrap';
import { H5, Btn } from '../../../../AbstractElements';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from "../../../../pages/AxiosClint";


const VMnote = (props) => {
    toast.configure();
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            default:
                break;
        }
    };
    const [isOpen, setIsOpen] = useState(true);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How are you?", status: 1 },
    ]);

    const styles = {
   
        messages: {
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9'
        },
        message: {
            backgroundColor: '#e1f3fb',
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '5px',
            position: 'relative'
        },
        messageText: {
            margin: 0
        },
        status: {
            fontSize: '12px',
            color: 'gray',
            position: 'absolute',
            bottom: '4px',
            right: '8px'
        },
        statusRead: {
            color: 'green'
        },
        statusSent: {
            color: 'blue'
        },
        inputContainer: {
            borderTop: '1px solid #ddd',
            padding: '5px',
            display: 'flex',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            border: 'none',
            padding: '8px',
            borderRadius: '4px',
            outline: 'none'
        }
    };
    const onsubmit = async (data) => {
        if (props.email) {
            try {
                const user = JSON.parse(localStorage.getItem('USER'));
                const formData = { ...data };
                formData.sender_id = user.email
                formData.receiver_id = props.email
                const response = await axios.post('/SendMessage', formData);

                console.log(response.data);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        } else {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "content":
                    basictoaster("dangerToast", "Make sure to write the content of the message.");
                    return;
            }
        }
    }
    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>VM Notes</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>

                                <Col md="12" className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Label className="form-label" htmlFor="validationCustom01">VM/Vendor</Label>
                                        <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(onsubmit, onError) }}>
                                            <i className="fa fa-send"></i>
                                        </Btn>
                                    </div>

                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={{
                                            toolbar: [
                                                'heading',
                                                '|',
                                                'bold',
                                                'italic',
                                                'link',
                                                'bulletedList',
                                                'numberedList',
                                                '|',
                                                'blockQuote',
                                                'undo',
                                                'redo'
                                            ],
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValue('content', data);
                                        }}
                                    />
                                    <input
                                        hidden disabled
                                        {...register('content', { required: true })}
                                    />
                                    <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                                        <div style={styles.chatBox}>
                                            <div style={styles.messages}>
                                                {messages.map((msg) => (
                                                    <div key={msg.id} style={styles.message}>
                                                        <p style={styles.messageText}>{msg.text}</p>
                                                        <span style={{
                                                            ...styles.status,
                                                            ...(msg.status === 0 ? styles.statusRead : styles.statusSent)
                                                        }}>
                                                            {msg.status === 1 ? "✓✓ Read" : "✓ Sent"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </div>

                            <Col md="12" className="mb-3">
                                <Label className="form-label" for="validationCustom01">VM/PM</Label>
                                <CKEditor editor={ClassicEditor} />

                            </Col>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default VMnote;