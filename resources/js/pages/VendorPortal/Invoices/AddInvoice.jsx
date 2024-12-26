import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Label, FormGroup, Input, Table, CardFooter } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, H6 } from '../../../AbstractElements';
import axiosClient from '../../AxiosClint';
import { useStateContext } from '../../../pages/context/contextAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const AddInvoice = () => {
    const baseURL = "/Portal/Vendor/";
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [billingData, setBillingData] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [walletData, setWalletData] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [jobsData, setJobsData] = useState([]);
    const [selectedTaskInput, setSelectedTaskInput] = useState([]);

    const [fileInput, setFileInput] = useState("");
    const [totalInput, setTotalInput] = useState(0);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [paymentMethodInput, setPaymentMethodInput] = useState("");

    useEffect(() => {
        if (user) {
            const payload = {
                'vendor': user.id
            };
            axiosClient.post(baseURL + "selectCompletedJobs", payload)
                .then(({ data }) => {
                    const [completedJobs] = [(data?.CompletedJobs)];
                    setCompletedJobs(completedJobs);
                });
            // get billing data 
            axiosClient.post("/EditVendor", {
                params: {
                    id: user.id,
                    BillingData: "Billing Data",
                }
            })
                .then(({ data }) => {
                    setBillingData(data?.billingData);
                    setBankData(data?.bankData);
                    setWalletData(data?.walletData);
                });
        }
    }, [user]);

    const TaskRes = {
        'vendor': user.id,
        'task_id': selectedTaskInput,
    };
    const getSelectedJobData = () => {
        if (selectedTaskInput != '') {
            axiosClient.post(baseURL + "getSelectedJobData", TaskRes)
                .then(({ data }) => {
                    if (jobsData.length > 0)
                        setJobsData(jobsData => [...jobsData, data.Task]);
                    else
                        setJobsData([data.Task]);
                });
            // remove this from select input 
            setCompletedJobs(completedJobs.filter(item => item.id !== parseInt(selectedTaskInput)));
            setSelectedTaskInput('');
        } else {
            alert('Please Select Job From List')
        }
    };

    const handlePoOnChange = (id) => {
        const checkBoxArray = selectedCheckboxes;
        // Find index
        const findIdx = checkBoxArray.indexOf(id);
        // Index > -1 means that the item exists and that the checkbox is checked
        // and in that case we want to remove it from the array and uncheck it
        if (findIdx > -1) {
            checkBoxArray.splice(findIdx, 1);
        } else {
            checkBoxArray.push(id);
        }
        setSelectedCheckboxes(checkBoxArray);
        // cal. total 
        const totalPrice = jobsData.reduce(
            (sum, job) => {
                if (selectedCheckboxes.includes(job.id))
                    return sum + job.total_cost;
                else
                    return sum + 0;
            },
            0
        );
        setTotalInput(totalPrice);
    };



    const saveInvoice = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const InvoiceRes = {
            ...Object.fromEntries(formData),
            'vendor': user.id,
            'jobs': selectedCheckboxes,
            'total': totalInput,
            'file': fileInput,

        };
        if (selectedCheckboxes.length == 0) {
            toast.error("Please Select Jobs.....");
        }
        else if (fileInput.length == 0) {
            toast.error("Please Upload Invoice File.....");
        } else {
            axiosClient.post(baseURL + "saveInvoice", InvoiceRes, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(({ data }) => {
                    switch (data.type) {
                        case 'success':
                            toast.success(data.message);
                            navigate("/Vendor/Invoices");
                            break;
                        case 'error':
                            toast.error(data.message);
                            break;
                    }

                });
        }
    };
    return (
        <Fragment>
            <BreadcrumbsPortal mainTitle="Add New Invoice" parent="My Invoices" title="Add New Invoice" />
            <Container fluid={true}>
                <Row>
                    <form onSubmit={saveInvoice}>
                        <Col sm="12">
                            <Card className='mb-3'>
                                <CardHeader className=' b-l-primary pb-3'>
                                    <H6 >1 - Select Jobs To Be Invoiced</H6>
                                </CardHeader>
                                <CardBody className='py-2'>
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">{'Select Job '}</Label>
                                                <Col sm="6">
                                                    <Input type="select" id='task_id' className="custom-select form-control" onChange={e => setSelectedTaskInput(e.target.value)}>
                                                        <option value=''>{'Select Job'}</option>
                                                        {completedJobs.map((item) => (
                                                            <option key={item.id} value={item.id}>{item.code}</option>
                                                        ))}
                                                    </Input>
                                                </Col>
                                                <Col sm="3">
                                                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default", onClick: () => getSelectedJobData(), }}>
                                                        {'Add Job To Invoice'}
                                                    </Btn>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mb-3'>
                                <CardHeader className=' b-l-primary pb-3'>
                                    <H6>List of selected Jobs</H6>
                                    <span>Select Jobs To Be Added To Invoice</span>
                                </CardHeader>
                                <CardBody className='py-2'>
                                    <Row>
                                        <Col>
                                            <div className="table-responsive">
                                                <Table>
                                                    <thead className="bg-primary">
                                                        <tr>
                                                            <th scope="col">{'#'}</th>
                                                            <th scope="col">{'Code'}</th>
                                                            <th scope="col">{'Subject'}</th>
                                                            <th scope="col">{'Task Type'}</th>
                                                            <th scope="col">{'Rate'}</th>
                                                            <th scope="col">{'Volume'}</th>
                                                            <th scope="col">{'Unit'}</th>
                                                            <th scope="col">{'Total Cost'}</th>
                                                            <th scope="col">{'Currency'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {jobsData.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td><input type='checkbox' key={item.id} id={`custom-checkbox-${index}`} className='checkPo' value={item.id} onChange={() => handlePoOnChange(item.id)} selected={selectedCheckboxes.includes(item.id)} /></td>
                                                                <td>{item.code}</td>
                                                                <td>{item.subject}</td>
                                                                <td>{item.task_type}</td>
                                                                <td>{item.rate}</td>
                                                                <td>{item.count}</td>
                                                                <td>{item.unit}</td>
                                                                <td>{item.total_cost}</td>
                                                                <td>{item.currency}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mb-3'>
                                <CardHeader className=' b-l-primary pb-3'>
                                    <H6 >2 - Upload Invoice File </H6>
                                </CardHeader>
                                <CardBody className='py-2'>
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">{'Invoice Total'}</Label>
                                                <Col sm="9">
                                                    <Input type="text" name="total" className="form-control" readOnly disabled value={totalInput} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">{'Upload File'}</Label>
                                                <Col sm="9">
                                                    <Input className="form-control" accept="zip, .rar" type="file" onChange={e => setFileInput(e.target.files[0])} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mb-3'>
                                <CardHeader className=' b-l-primary pb-3'>
                                    <H6 >3 - Invoice Details </H6>
                                </CardHeader>
                                <CardBody className='py-2'>
                                    <Row>
                                        <Col sm="6">
                                            <H6>Bill To</H6>
                                            <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Billing Legal Name'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" name="billing_legal_name" className="form-control" readOnly disabled defaultValue={billingData?.billing_legal_name} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Billing Address'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" name="billing_address" className="form-control" readOnly disabled defaultValue={billingData?.billing_address} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col sm="6">
                                            <H6>Details</H6>
                                            <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Invoice Date'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" className="form-control" readOnly disabled defaultValue={new Date().toLocaleDateString()} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Due Date'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" name="billing_due_date" className="form-control" readOnly disabled defaultValue={'Due Date [Date after Payment terms]'} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Billing Currency'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" name="billing_currency" className="form-control" readOnly disabled defaultValue={billingData?.billing_currency} />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mb-0'>
                                <CardHeader className=' b-l-primary pb-3'>
                                    <H6 >4 - Payment Method </H6>
                                </CardHeader>
                                <CardBody className='py-2'>
                                    <Row>

                                        <Col sm="12">
                                            <FormGroup className="form-group m-checkbox-inline custom-radio-ml p-l-25">
                                                <div className="radio radio-primary">
                                                    <input id='radioinline1' type="radio" name="payment_method" value="0" required onChange={e => setPaymentMethodInput(e.target.value)} />
                                                    <label className="mb-0" htmlFor="radioinline1">Bank</label>
                                                </div>
                                                <div className="radio radio-primary m-l-20">
                                                    <input id='radioinline2' type="radio" name="payment_method" value="1" required onChange={e => setPaymentMethodInput(e.target.value)} />
                                                    <label className="mb-0" htmlFor="radioinline2">Wallet</label>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col sm='9' className='px-5'>
                                            {paymentMethodInput == "0" && (
                                                <>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'Bank name'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="bank_name" className="form-control" defaultValue={bankData?.bank_name} />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'Account holder'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="bank_account_holder" className="form-control" defaultValue={bankData?.account_holder} />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'SWIFT/BIC'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="bank_swift" className="form-control" defaultValue={bankData?.swift_bic} />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'IBAN'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="bank_IBAN" className="form-control" defaultValue={bankData?.iban} />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'Bank Address'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="bank_address" className="form-control" defaultValue={bankData?.bank_address} />
                                                        </Col>
                                                    </FormGroup>
                                                </>)}

                                            {paymentMethodInput == "1" && (
                                                <>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'Method'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="wallet_method" className="form-control" defaultValue={walletData?.method} />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-4 col-form-label">{'Account'}</Label>
                                                        <Col sm="8">
                                                            <Input type="text" name="wallet_account" className="form-control" defaultValue={walletData?.account} />
                                                        </Col>
                                                    </FormGroup>
                                                </>)}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mt-0 text-end'>
                                <CardFooter className='py-3'> <Btn attrBtn={{ color: 'primary', type: 'submit' }}>{'Save Changes'}</Btn></CardFooter>
                            </Card>
                        </Col>
                    </form>
                </Row>
            </Container>
        </Fragment>
    );
};


export default AddInvoice;
