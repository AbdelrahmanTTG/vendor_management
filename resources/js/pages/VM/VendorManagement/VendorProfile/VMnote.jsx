import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row } from 'reactstrap';
import { H5, Btn } from '../../../../AbstractElements';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from "../../../../pages/AxiosClint";

const VMnote = ({ lastMessage, email }) => {
    toast.configure();

    const [isOpen, setIsOpen] = useState(true);
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [messages, setMessages] = useState([]);

    const toggleCollapse = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (lastMessage?.VMNotes) {
            const { content } = lastMessage.VMNotes;
            lastMessage.VMNotes.content = content.replace(/<[^>]*>/g, '');
            setMessages([lastMessage.VMNotes]);
        }
    }, [lastMessage]);

    const showToast = (type, message) => {
        toast[type](message, { position: toast.POSITION.TOP_RIGHT });
    };

    const onSubmit = async (data) => {
        if (!email) {
            showToast('error', "Make sure to send your personal information first.");
            document.getElementById("personal-data")?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('USER'));
            const formData = { ...data, sender_id: user.email, receiver_id: email };
            const response = await axios.post('/SendMessage', formData);
            response.data.data.content = response.data.data.content.replace(/<[^>]*>/g, '');
            setMessages([response.data.data]);
        } catch (error) {
            console.error('Failed to send message:', error);
            showToast('error', "Failed to send message. Please try again.");
        }
    };

    const onError = (errors) => {
        if (errors.content) {
            showToast('error', "Make sure to write the content of the message.");
        }
    };
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
    return (
        <Fragment>
            <Card>
                <CardHeader className="pb-3 d-flex justify-content-between align-items-center" onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
                    <H5>VM Notes</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="12" className="border border-default p-3 mb-3" style={{ borderStyle: "dashed" }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Label className="form-label">VM/Vendor</Label>
                                    <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(onSubmit, onError) }}>
                                        <i className="fa fa-send"></i>
                                    </Btn>
                                </div>

                                <CKEditor
                                    editor={ClassicEditor}
                                    config={{
                                        toolbar: [
                                            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                            'blockQuote', 'undo', 'redo'
                                        ],
                                    }}
                                    onChange={(event, editor) => setValue('content', editor.getData())}
                                />
                                <input hidden disabled {...register('content', { required: true })} />

                                <div className="border border-default p-3 mb-3" style={{ borderStyle: "dashed" }}>
                                    <div style={styles.chatBox}>
                                        <div style={styles.messages}>
                                            {messages.map((msg) => (
                                                <div key={msg.id} style={styles.message}>
                                                    <p style={styles.messageText}>{msg.content}</p>
                                                    <span style={{
                                                        ...styles.status,
                                                        ...(msg.is_read === 0 ? styles.statusRead : styles.statusSent)
                                                    }}>
                                                        {msg.is_read === 1 ? "✓✓ Read" : "✓ Sent"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col md="12" className="mb-3">
                                <Label className="form-label">VM/PM</Label>
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
