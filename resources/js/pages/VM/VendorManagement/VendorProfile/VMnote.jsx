import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, ButtonGroup } from 'reactstrap';
import { H5, Btn, Spinner } from '../../../../AbstractElements';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from "../../../../pages/AxiosClint";

const VMnote = (props) => {
    // toast.configure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { register: registerPM, handleSubmit: handleSubmitPM, setValue: setValuePM, formState: { errors: errorsPM } } = useForm();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleCollapse = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (props.lastMessage) {
            setLoading(true);
            if (props.lastMessage.VMNotes === null) { setLoading(false); }
            if (props.lastMessage.VMNotes) {
                try {
                    const { content } = props.lastMessage.VMNotes;
                    props.lastMessage.VMNotes.content = content.replace(/<[^>]*>/g, '');
                    setMessages([props.lastMessage.VMNotes]);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
            
        }

    }, [props.lastMessage]);


    const showToast = (type, message) => {
        toast[type](message, { position: toast.POSITION.TOP_RIGHT });
    };

    const onSubmit = async (data) => {
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to send .");
            return;
        }
        if (!props.email) {
            showToast('error', "Make sure to send your personal information first.");
            document.getElementById("personal-data")?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        try {
            setIsSubmitting(true);
            const user = JSON.parse(localStorage.getItem('USER'));
            const formData = { ...data, sender_id: user.email, receiver_id: props.email };
            const response = await axios.post('/SendMessage', formData);
            response.data.data.content = response.data.data.content.replace(/<[^>]*>/g, '');
            setMessages([response.data.data]);
        } catch (error) {
            console.error('Failed to send message:', error);
            showToast('error', "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false)
        }
    };
    const Submit = (data) => {
        const type = { ...data, status: "0" }
        onSubmit(type)
    };
    const Send = (data) => {
        const type = { ...data, status: "1" }
        onSubmit(type)
    }
    const onError = (errors) => {
        if (errors.content ) {
            showToast('error', "Make sure to write the content of the message.");
        }  

    };
    const onErrorPM = (errors) => {
        if (errors?.PM) {
            showToast('error', "Make sure to write the content of the message.");

        }
    }
  
    const onSubmitPM = async (data) => {
        if (!props.id) {
            showToast('error', "Make sure to send your personal information first.");
            document.getElementById("personal-data")?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        try {
            const formData = { ...data, id: props?.id };
            const response = await axios.post('/MessagePM', formData);
            // showToast("success", "Saved successfully");
            showToast('success', 'Saved successfully');

        } catch (error) {
            console.error('Failed to send message:', error);
            showToast('error', "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false)
        }
    }
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
        timestamp: {
            fontSize: '10px',
            color: 'gray',
            marginTop: '5px',
            display: 'block'
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
        },
        noNotesMessage: {
            color: 'gray',
            textAlign: 'center',
            marginTop: '20px'
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
                                    <ButtonGroup>
                                        <Btn attrBtn={{ color: 'secondary', onClick: handleSubmit(Submit, onError), disabled: isSubmitting }}>
                                            Submit
                                        </Btn>
                                        <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(Send, onError), disabled: isSubmitting }}>
                                            Send
                                        </Btn>
                                    </ButtonGroup>

                                </div>

                                <CKEditor
                                    editor={ClassicEditor}
                                    data={props?.lastMessage?.VMNotes?.status == "0" ? props?.lastMessage?.VMNotes?.content : ""}
                                    onChange={(event, editor) => setValue('content', editor.getData())}
                                />
                                <input hidden disabled {...register('content', { required: true })} />

                                <div className="border border-default p-3 mb-3" style={{ borderStyle: "dashed" }}>
                                    {
                                        loading ? (
                                            <div className="loader-box" >
                                                <Spinner attrSpinner={{ className: 'loader-6' }} />
                                            </div>
                                        ) :
                                            <div style={styles.chatBox}>
                                                <div style={styles.messages}>
                                                    {messages.length > 0 ? (
                                                        messages.map((msg) => (
                                                            <div key={msg.id} style={styles.message}>
                                                                <p style={styles.messageText}>{msg.content}</p>

                                                                <span style={{ position: "absolute", top: 0, right: "0.5vw" }}>
                                                                    {msg.status == "0" ? "✓ Submit  " : "✓✓Sent"}
                                                                </span>


                                                                <span style={styles.timestamp}>
                                                                    {new Date(msg.created_at).toLocaleString()}
                                                                </span>

                                                                <span style={{
                                                                    ...styles.status,
                                                                    ...(msg.is_read === 0 ? styles.statusRead : styles.statusSent)
                                                                }}>

                                                                    {msg.is_read === 1 ? "✓✓ Read" : "✓ Not readable"}
                                                                </span>

                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p style={styles.noNotesMessage}>There are no Notes yet.</p>
                                                    )}

                                                </div>
                                            </div>
                                    }
                                </div>
                            </Col>

                            <Col md="12" className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Label className="form-label">VM/PM</Label>
                                    <Btn attrBtn={{ color: 'primary', onClick: handleSubmitPM(onSubmitPM, onErrorPM), disabled: isSubmitting }}>
                                        Submit
                                    </Btn>
                                </div>
                                <CKEditor
                                    data={props?.lastMessage?.pm}
                                    editor={ClassicEditor}
                                    onChange={(event, editor) => setValuePM('PM', editor.getData())}
                                />
                                <input hidden disabled {...registerPM('PM', { required: true })} />

                            </Col>
                        </Row>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default VMnote;
