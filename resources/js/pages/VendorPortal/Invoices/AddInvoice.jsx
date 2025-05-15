import React, { Fragment, useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Label,
    FormGroup,
    Input,
    Table,
    CardFooter,
} from "reactstrap";
import {
    BreadcrumbsPortal,
    H5,
    Btn,
    H6,
    P,
    H4,
    Spinner,
} from "../../../AbstractElements";
import axiosClient from "../../AxiosClint";
import { useStateContext } from "../../../pages/context/contextAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { Database } from "react-feather";
import CommonModal from "../../../pages/VM/Model";
import { useForm, Controller, set } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from 'react-select';

const AddInvoice = () => {
    const baseURL = "/Portal/Vendor/";
    const navigate = useNavigate();
    const { user } = useStateContext();
    const [billingData, setBillingData] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [walletData, setWalletData] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [jobsData, setJobsData] = useState([]);
    const [selectedTaskInput, setSelectedTaskInput] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [brandInput, setSelectedBrandInput] = useState("0");
    const [optionsM, setOptionsM] = useState([]);
    const [loading2, setLoading2] = useState(false);
    const [selectedOptionM, setSelectedOptionM] = useState([]);

    const [fileInput, setFileInput] = useState("");
    const [totalInput, setTotalInput] = useState(0);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [paymentMethodInput, setPaymentMethodInput] = useState("");
    const [walletAccountValue, setWalletAccountValue] = useState("");
    const [walletMethodValue, setWalletMethodValue] = useState(0);
    const [amount, setAmount] = useState(0);
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({})

    const toggle = () => setModal(!modal);
    const toggle2 = () => setModal2(!modal2);

    const {
        control,
        register,
        handleSubmit,
        unregister,
        setValue,
        formState: { errors },
    } = useForm();
    const {
        control: controlForm2,
        register: registerForm2,
        handleSubmit: handleSubmitForm2,
        setValue: setValueForm2,
        formState: { errors: errorsForm2 },
    } = useForm();

    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case "successToast":
                toast.success(status, {
                    position: "top-right",
                });
                break;
            case "dangerToast":
                toast.error(status, {
                    position: "top-right",
                });
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        if (user) {
            setLoading(true);
            const payload = {
                vendor: user.id,
            };
            axiosClient
                .post(baseURL + "getPendingTasksCount", payload)
                .then(({ data }) => {
                    const result = Object.values(data);
                    setPendingTasks(result);
                });
            // get billing data
            axiosClient
                .post("/EditVendor", {
                    id: user.id,
                    BillingData: "Billing Data",
                })
                .then(({ data }) => {
                    setBillingData(data?.BillingData?.billingData);
                    setBankData(data?.BillingData?.bankData);
                    // setWalletData(data?.BillingData?.walletData?.[0]);
                    setWalletData(data?.BillingData?.walletData);
                    setPaymentMethods(
                        data?.BillingData?.vendor_payment_methods
                    );
                    setAmount(data?.BillingData?.amount);
                    setLoading(false);
                
                });
        }
    }, [user]);

    const getWalletAccountData = (method) => {
        const wallet_method_id = method.id;
        setWalletMethodValue(wallet_method_id);

        const found = walletData.find(
            (element) => element.method.id == wallet_method_id
        );
        if (found !== undefined) {
            setWalletAccountValue(found.account);
        } else {
            setWalletAccountValue("");
        }
    };

    const getSelectedJobData = (e) => {
        const task_id = e.target.value;
        axiosClient
            .post(baseURL + "getSelectedJobData", {
                vendor: user.id,
                task_id: task_id,
            })
            .then(({ data }) => {
                let jobs = [];
                if (jobsData.length > 0) jobs = [...jobsData, data.Task];
                // setJobsData(jobsData => [...jobsData, data.Task]);
                else jobs = [data.Task];
                setJobsData(jobs);
                handlePoOnChange(task_id, jobs);
            });
        // remove this from select input
        setCompletedJobs(
            completedJobs.filter((item) => item.id !== parseInt(task_id))
        );
        setSelectedTaskInput("");
    };

    const getCompletedJobs = (e) => {
        setSelectedBrandInput(e.target.value);
        axiosClient
            .post(baseURL + "selectCompletedJobs", {
                vendor: user.id,
                brand: e.target.value,
            })
            .then(({ data }) => {
                const [completedJobs] = [data?.CompletedJobs];
                setCompletedJobs(completedJobs);
                //
                setJobsData([]);
                setSelectedCheckboxes([]);
                setTotalInput(0);
            });
    };

    const handlePoOnChange = (task_id, jobs) => {
        const id = Number(task_id);
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
        const totalPrice = jobs.reduce((sum, job) => {
            if (selectedCheckboxes.includes(job.id))
                return sum + job.total_cost;
            else return sum + 0;
        }, 0);
        setTotalInput(totalPrice);
    };

    const removeJob = (jobId, jobCode) => {
        // remove this from jobs data
        const jobs = jobsData.filter((item) => item.id !== parseInt(jobId));
        handlePoOnChange(jobId, jobs);
        setJobsData(jobs);
        completedJobs.push({ id: jobId, code: jobCode });
    };

    const saveInvoice = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const InvoiceRes = {
            ...Object.fromEntries(formData),
            vendor: user.id,
            jobs: selectedCheckboxes,
            total: totalInput,
            file: fileInput,
        };
        // console.log(selectedCheckboxes);
        if (selectedCheckboxes.length == 0) {
            toast.error("Please Select Jobs.....");
        } else if (fileInput.length == 0) {
            toast.error("Please Upload Invoice File.....");
        } else {
            axiosClient
                .post(baseURL + "saveInvoice", InvoiceRes, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(({ data }) => {
                    switch (data.type) {
                        case "success":
                            toast.success(data.message);
                            navigate("/Vendor/Invoices");
                            break;
                        case "error":
                            toast.error(data.message);
                            break;
                    }
                });
        }
    };
    useEffect(() => {
        if (totalInput > amount) {
            setPaymentMethodInput(0);
        } else {
            setPaymentMethodInput("");
        }
    }, [amount, totalInput]);
    const submit = async (data) => {
        if (!billingData?.id) {
            basictoaster(
                "dangerToast",
                "You do not have billing data. Please go to your profile and add it."
            );
            return;
        }
        const formData = { ...data };
        formData.billing_data_id = billingData.id;

        try {
            const response = await axiosClient.post(
                baseURL + "storeBankData",
                formData
            );
            basictoaster("successToast", "Added successfully !");
            setBankData(response?.data?.data);
            toggle();
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                const errors = response.data;
                Object.keys(errors).forEach((key) => {
                    const messages = errors[key];
                    if (Array.isArray(messages) && messages.length > 0) {
                        messages.forEach((message) => {
                            basictoaster("dangerToast", message);
                        });
                    } else {
                        basictoaster(
                            "dangerToast",
                            "Something went wrong. This cannot be added."
                        );
                    }
                });
            }
        }
    };
    const submitForm2 = async (data) => {
         if (!billingData?.id) {
             basictoaster(
                 "dangerToast",
                 "You do not have billing data. Please go to your profile and add it."
             );
             return;
         }
         const formData = { ...data };
         formData.billing_data_id = billingData.id;
         try {
             const response = await axiosClient.post(
                 baseURL + "storeWalletData",
                 formData
             );
             basictoaster("successToast", "Added successfully !");
             setWalletData(response?.data?.data);
             toggle2();
         } catch (err) {
             const response = err.response;
             if (response && response.data) {
                 const errors = response.data;
                 Object.keys(errors).forEach((key) => {
                     const messages = errors[key];
                     if (Array.isArray(messages) && messages.length > 0) {
                         messages.forEach((message) => {
                             basictoaster("dangerToast", message);
                         });
                     } else {
                         basictoaster(
                             "dangerToast",
                             "Something went wrong. This cannot be added."
                         );
                     }
                 });
             }
         }
    }
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "swift_bic":
                    if (value.type === "required") {
                        basictoaster("dangerToast", "SWIFT/BIC is required");
                    } else {
                        basictoaster("dangerToast", "SWIFT/BIC is invalid");
                    }
                    return;
                case "iban":
                    if (value.type === "required") {
                        basictoaster("dangerToast", "IBAN is required");
                    } else {
                        basictoaster("dangerToast", "IBAN is invalid");
                    }
                    return;
                case "bank_address":
                    basictoaster("dangerToast", "Bank address is required");
                    return;
                case "bank_name":
                    basictoaster("dangerToast", "Bank name is required");
                    return;
                case "account_holder":
                    basictoaster("dangerToast", "Account holder is required");
                    return;
                case "payment_terms":
                    basictoaster("dangerToast", "Payment terms is required");
                    return;
                default:
                    break;
            }
        }
    };
   const handleInputChangeSelect = (
       inputValue,
       tableName,
       fieldName,
       setOptions,
       options,
       rowId
   ) => {
       if (inputValue.length === 0) {
           setOptions(initialOptions[fieldName] || []);
       } else if (inputValue.length >= 1) {
           if (Array.isArray(options)) {
               const existingOption = options.some((option) =>
                   option?.label
                       .toLowerCase()
                       .includes(inputValue.toLowerCase())
               );
               if (!existingOption) {
                   setLoading2(true);
                   handelingSelect(
                       tableName,
                       setOptions,
                       fieldName,
                       inputValue,
                       rowId
                   );
               }
           }
       }
   };

   const handelingSelect = async (
       tablename,
       setOptions,
       fieldName,
       searchTerm = "",
       rowId
   ) => {
       if (!tablename) return;
       try {
           setLoading2(true);
           const { data } = await axiosClient.get("SelectDatat", {
               params: {
                   search: searchTerm,
                   table: tablename,
               },
           });
           const formattedOptions = data.map((item) => ({
               value: item.id,
               label: item.name,
           }));
           if (rowId) {
               setOptions((prev) => ({ ...prev, [rowId]: formattedOptions }));
           } else {
               setOptions(formattedOptions);
           }
           if (!searchTerm) {
               setInitialOptions((prev) => ({
                   ...prev,
                   [fieldName]: formattedOptions,
               }));
           }
       } catch (err) {
           const response = err.response;
           if (response && response.status === 422) {
               setErrorMessage(response.data.errors);
           } else if (response && response.status === 401) {
               setErrorMessage(response.data.message);
           } else {
               setErrorMessage("An unexpected error occurred.");
           }
       } finally {
           setLoading2(false);
       }
   };
    return (
        <Fragment>
            <BreadcrumbsPortal
                mainTitle="Add New Invoice"
                parent="My Invoices"
                title="Add New Invoice"
            />
            <Container fluid={true}>
                <Row>
                    {pendingTasks.map((item, i) => (
                        <Col sm="6" lg="4" xl="3" key={i}>
                            <Card className="o-hidden border-0">
                                <CardBody
                                    className={
                                        i % 2 == 0
                                            ? "bg-primary"
                                            : "bg-secondary"
                                    }
                                >
                                    <div className="media static-top-widget">
                                        <div className="align-self-center text-center">
                                            <Database />
                                        </div>
                                        <div className="media-body">
                                            <span className="m-0">
                                                {"Ready To Invoice In "}
                                                <br />
                                                <b>{item.brand_name}</b>
                                            </span>
                                            <H4
                                                attrH4={{
                                                    className:
                                                        "mb-0 counter px-2",
                                                }}
                                            >
                                                {item.count}
                                            </H4>
                                            <Database className="icon-bg" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                    <form onSubmit={saveInvoice}>
                        <Col sm="12">
                            <Card className="mb-3 pt-0">
                                <CardHeader className=" b-l-primary pb-3">
                                    <H6>1 - Select Jobs To Be Invoiced</H6>
                                </CardHeader>
                                <CardBody className="py-2">
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Select Company "}
                                                </Label>
                                                <Col sm="6">
                                                    <Input
                                                        type="select"
                                                        name="brand"
                                                        className="custom-select form-control"
                                                        defaultValue={
                                                            brandInput
                                                        }
                                                        onChange={(e) =>
                                                            getCompletedJobs(e)
                                                        }
                                                    >
                                                        <option
                                                            value="0"
                                                            disabled
                                                        >
                                                            {"Select Company"}
                                                        </option>
                                                        {pendingTasks.map(
                                                            (item) => (
                                                                <option
                                                                    key={
                                                                        item.brand_id
                                                                    }
                                                                    value={
                                                                        item.brand_id
                                                                    }
                                                                >
                                                                    {
                                                                        item.brand_name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Select Job "}
                                                </Label>
                                                <Col sm="6">
                                                    <Input
                                                        type="select"
                                                        id="task_id"
                                                        className="custom-select form-control"
                                                        onChange={(e) =>
                                                            getSelectedJobData(
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            completedJobs.length >
                                                            0
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        <option value="">
                                                            {"Select Job"}
                                                        </option>
                                                        {completedJobs.map(
                                                            (item) => (
                                                                <option
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.code}
                                                                </option>
                                                            )
                                                        )}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className="mb-3">
                                <CardHeader className=" b-l-primary pb-3">
                                    <H6>List of selected Jobs</H6>
                                    <span>
                                        Select Jobs To Be Added To Invoice
                                    </span>
                                </CardHeader>
                                <CardBody className="py-2">
                                    <Row>
                                        <Col>
                                            <div className="table-responsive">
                                                <Table>
                                                    <thead className="bg-primary">
                                                        <tr>
                                                            <th scope="col">
                                                                {"Code"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Subject"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Task Type"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Rate"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Volume"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Unit"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Total Cost"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Currency"}
                                                            </th>
                                                            <th scope="col">
                                                                {"Cancel"}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {jobsData.map(
                                                            (item, index) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <td>
                                                                        {
                                                                            item.code
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.subject
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.task_type
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.rate
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.count
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.unit
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.total_cost
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.currency
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        <Btn
                                                                            attrBtn={{
                                                                                className:
                                                                                    "btn btn-outline-danger btn-sm",
                                                                                color: "default",
                                                                                onClick:
                                                                                    () =>
                                                                                        removeJob(
                                                                                            item.id,
                                                                                            item.code
                                                                                        ),
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-minus-circle"></i>
                                                                        </Btn>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className="mb-3">
                                <CardHeader className=" b-l-primary pb-3">
                                    <H6>2 - Upload Invoice File </H6>
                                </CardHeader>
                                <CardBody className="py-2">
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Invoice Total"}
                                                </Label>
                                                <Col sm="9">
                                                    <Input
                                                        type="text"
                                                        name="total"
                                                        className="form-control"
                                                        readOnly
                                                        disabled
                                                        value={totalInput}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Upload File"}
                                                </Label>
                                                <Col sm="9">
                                                    <Input
                                                        className="form-control"
                                                        accept="zip, .rar"
                                                        type="file"
                                                        onChange={(e) =>
                                                            setFileInput(
                                                                e.target
                                                                    .files[0]
                                                            )
                                                        }
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className="mb-3">
                                <CardHeader className=" b-l-primary pb-3">
                                    <H6>3 - Invoice Details </H6>
                                </CardHeader>
                                <CardBody className="py-2">
                                    {loading ? (
                                        <div className="loader-box">
                                            <Spinner
                                                attrSpinner={{
                                                    className: "loader-6",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Row>
                                            <Col sm="6">
                                                <H6>Bill To</H6>
                                                <FormGroup className="row">
                                                    <Label className="col-sm-4 col-form-label">
                                                        {"Billing Legal Name"}
                                                    </Label>
                                                    <Col sm="8">
                                                        <Input
                                                            type="text"
                                                            name="billing_legal_name"
                                                            className="form-control"
                                                            readOnly
                                                            disabled
                                                            defaultValue={
                                                                billingData?.billing_legal_name
                                                            }
                                                        />
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="row">
                                                    <Label className="col-sm-4 col-form-label">
                                                        {"Billing Address"}
                                                    </Label>
                                                    <Col sm="8">
                                                        <Input
                                                            type="text"
                                                            name="billing_address"
                                                            className="form-control"
                                                            readOnly
                                                            disabled
                                                            defaultValue={billingData?.billing_address?.replace(
                                                                /<[^>]*>/g,
                                                                ""
                                                            )}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col sm="6">
                                                <H6>Details</H6>
                                                <FormGroup className="row">
                                                    <Label className="col-sm-4 col-form-label">
                                                        {"Invoice Date"}
                                                    </Label>
                                                    <Col sm="8">
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            disabled
                                                            defaultValue={new Date().toLocaleDateString()}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                                {/* <FormGroup className="row">
                                                <Label className="col-sm-4 col-form-label">{'Due Date'}</Label>
                                                <Col sm="8">
                                                    <Input type="text" name="billing_due_date" className="form-control" readOnly disabled defaultValue='' />
                                                </Col>
                                            </FormGroup> */}
                                                <FormGroup className="row">
                                                    <Label className="col-sm-4 col-form-label">
                                                        {"Billing Currency"}
                                                    </Label>
                                                    <Col sm="8">
                                                        <Input
                                                            type="text"
                                                            name="billing_currency"
                                                            className="form-control"
                                                            readOnly
                                                            disabled
                                                            defaultValue={
                                                                billingData
                                                                    ?.billing_currency
                                                                    ?.name
                                                            }
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )}
                                </CardBody>
                            </Card>
                            <Card className="mb-0">
                                <CardHeader className=" b-l-primary pb-3">
                                    <H6>4 - Payment Method </H6>
                                </CardHeader>
                                <CardBody className="py-2">
                                    {loading ? (
                                        <div className="loader-box">
                                            <Spinner
                                                attrSpinner={{
                                                    className: "loader-6",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Row>
                                            {amount > 0 && (
                                                <Col
                                                    sm="12"
                                                    className="text-danger mb-3"
                                                >
                                                    Please note that if your
                                                    outstanding invoice amount
                                                    is below {amount} $, payment will
                                                    be issued via your provided
                                                    e−wallet. For amount
                                                    exceeding {amount} $, payment
                                                    will be processed via bank
                                                    transfer. The applicable
                                                    method is determined by the
                                                    total invoice amount per
                                                    brand within each payment
                                                    cycle.
                                                </Col>
                                            )}
                                            {billingData?.bank_required ==
                                                1 && (
                                                <>
                                                    <h6
                                                        className="me-6"
                                                        style={{
                                                            marginBottom:
                                                                "1.5rem",
                                                            marginTop: "1.5rem",
                                                        }}
                                                    >
                                                        Bank
                                                    </h6>
                                                    <Col
                                                        sm="9"
                                                        className="px-5"
                                                    >
                                                        <>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {
                                                                        "Bank name"
                                                                    }
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="text"
                                                                        name="bank_name"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={
                                                                            bankData?.bank_name
                                                                        }
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {
                                                                        "Account holder"
                                                                    }
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="text"
                                                                        name="bank_account_holder"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={
                                                                            bankData?.account_holder
                                                                        }
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {
                                                                        "SWIFT/BIC"
                                                                    }
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="text"
                                                                        name="bank_swift"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={
                                                                            bankData?.swift_bic
                                                                        }
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {"IBAN"}
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="text"
                                                                        name="bank_IBAN"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={
                                                                            bankData?.iban
                                                                        }
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {
                                                                        "Bank Address"
                                                                    }
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="text"
                                                                        name="bank_address"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={bankData?.bank_address?.replace(
                                                                            /<[^>]*>/g,
                                                                            ""
                                                                        )}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </>
                                                    </Col>
                                                </>
                                            )}
                                            {billingData?.wallet_required ==
                                                1 && (
                                                <>
                                                    <h6
                                                        className="me-6"
                                                        style={{
                                                            marginBottom:
                                                                "1.5rem",
                                                            marginTop: "1.5rem",
                                                        }}
                                                    >
                                                        Wallet
                                                    </h6>
                                                    <Col
                                                        sm="9"
                                                        className="px-5"
                                                    >
                                                        <>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {"Method"}
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        type="select"
                                                                        name="wallet_method"
                                                                        className="custom-select form-control"
                                                                        defaultValue={
                                                                            walletMethodValue
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const selectedId =
                                                                                e
                                                                                    .target
                                                                                    .value;
                                                                            const selectedMethod =
                                                                                walletData?.find(
                                                                                    (
                                                                                        item
                                                                                    ) =>
                                                                                        item.method.id.toString() ===
                                                                                        selectedId
                                                                                )?.method;
                                                                            getWalletAccountData(
                                                                                selectedMethod
                                                                            );
                                                                        }}
                                                                    >
                                                                        <option
                                                                            value="0"
                                                                            disabled
                                                                        >
                                                                            {
                                                                                "Select Method"
                                                                            }
                                                                        </option>
                                                                        {walletData?.map(
                                                                            (
                                                                                item,
                                                                                i
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    value={
                                                                                        item
                                                                                            .method
                                                                                            .id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item
                                                                                            .method
                                                                                            .name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </Input>
                                                                </Col>
                                                            </FormGroup>
                                                            <FormGroup className="row">
                                                                <Label className="col-sm-4 col-form-label">
                                                                    {"Account"}
                                                                </Label>
                                                                <Col sm="8">
                                                                    <Input
                                                                        readOnly
                                                                        type="text"
                                                                        name="wallet_account"
                                                                        className="form-control"
                                                                        value={
                                                                            walletAccountValue
                                                                        }
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                    )}
                                </CardBody>
                            </Card>

                            <Card className="mt-0 text-end">
                                <CardFooter className="py-3">
                                    {billingData?.bank_required == 1 &&
                                        !bankData && (
                                            <Btn
                                                attrBtn={{
                                                    color: "success",
                                                    onClick: toggle,
                                                    className: "me-2",
                                                }}
                                            >
                                                {"Add Bank"}
                                            </Btn>
                                        )}
                                    {billingData?.wallet_required == 1 &&
                                        walletData &&
                                        walletData?.length == 0 && (
                                            <Btn
                                                attrBtn={{
                                                    color: "success",
                                                    onClick: toggle2,
                                                    className: "me-2",
                                                }}
                                            >
                                                {"Add Wallet"}
                                            </Btn>
                                        )}
                                    <Btn
                                        attrBtn={{
                                            color: "primary",
                                            type: "submit",
                                        }}
                                    >
                                        {"Save Changes"}
                                    </Btn>
                                </CardFooter>
                            </Card>
                        </Col>
                    </form>
                </Row>
            </Container>
            <CommonModal
                key="add-bank"
                isOpen={modal}
                title="Add new bank"
                toggler={toggle}
                size="xl"
                marginTop="-1%"
                onSave={handleSubmit(submit, onError)}
            >
                <div
                    className="border border-default p-3 mb-3 "
                    style={{ borderStyle: "dashed!important" }}
                >
                    <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">
                        Bank details
                    </Label>
                    <Row>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    Bank name
                                </Label>
                                <Col sm="9">
                                    <input
                                        defaultValue=""
                                        className="form-control"
                                        type="text"
                                        name="Bank_name"
                                        {...register("bank_name", {
                                            required: true,
                                        })}
                                        placeholder="Bank name"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    Account holder
                                </Label>
                                <Col sm="9">
                                    <input
                                        defaultValue=""
                                        className="form-control"
                                        type="text"
                                        name="account_holder"
                                        {...register("account_holder", {
                                            required: true,
                                        })}
                                        placeholder="Account holder"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    SWIFT / BIC
                                </Label>
                                <Col sm="9">
                                    <input
                                        defaultValue=""
                                        className="form-control"
                                        type="text"
                                        name="swift_bic"
                                        {...register("swift_bic", {
                                            required: true,
                                            validate: (value) => {
                                                const swiftRegex =
                                                    /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
                                                return (
                                                    swiftRegex.test(value) ||
                                                    "SWIFT/BIC is invalid"
                                                );
                                            },
                                        })}
                                        placeholder="SWIFT / BIC"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    IBAN
                                </Label>
                                <Col sm="9">
                                    <input
                                        defaultValue=""
                                        className="form-control"
                                        type="text"
                                        name="iban"
                                        {...register("iban", {
                                            required: true,
                                            validate: (value) => {
                                                const cleanValue =
                                                    value.replace(/\s+/g, "");
                                                const ibanRegex =
                                                    /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
                                                return (
                                                    ibanRegex.test(
                                                        cleanValue
                                                    ) || "IBAN is invalid"
                                                );
                                            },
                                        })}
                                        placeholder="IBAN"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    Payment terms
                                </Label>
                                <Col sm="9">
                                    <input
                                        defaultValue=""
                                        className="form-control"
                                        type="text"
                                        name="payment_terms"
                                        {...register("payment_terms", {
                                            required: true,
                                        })}
                                        placeholder="Payment terms"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mb-3">
                            <FormGroup className="row">
                                <Label
                                    className="col-sm-3 col-form-label"
                                    for="validationCustom01"
                                >
                                    Bank Address
                                </Label>
                                <Col sm="9">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValue("bank_address", data);
                                        }}
                                    />
                                    <input
                                        type="hidden"
                                        {...register("bank_address", {
                                            required: true,
                                        })}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </CommonModal>
            <CommonModal
                key="add-wallet"
                isOpen={modal2}
                title="Add new wallet"
                toggler={toggle2}
                size="md"
                marginTop="-1%"
                onSave={handleSubmitForm2(submitForm2)}
            >
                <div
                    className="border border-default p-3 mb-3 "
                    style={{ borderStyle: "dashed!important" }}
                >
                    <Col sm="12" className="mb-3">
                        <Controller
                            name="method"
                            control={controlForm2}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={selectedOptionM || null}
                                    options={optionsM || []}
                                    onInputChange={(inputValue) =>
                                        handleInputChangeSelect(
                                            inputValue,
                                            "vendor_payment_methods",
                                            `method`,
                                            setOptionsM,
                                            optionsM
                                        )
                                    }
                                    className="js-example-basic-single col-sm-12"
                                    isSearchable
                                    noOptionsMessage={() =>
                                        loading2 ? (
                                            <div className="loader-box">
                                                <Spinner
                                                    attrSpinner={{
                                                        className: "loader-6",
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            "No options found"
                                        )
                                    }
                                    onChange={(option) => {
                                        setSelectedOptionM(option);
                                        field.onChange(option.value);
                                    }}
                                />
                            )}
                        />
                    </Col>
                    <Col sm="12" className="mb-3">
                        <input
                            type="text"
                            {...registerForm2(`account`, { required: true })}
                            className="form-control"
                            placeholder="Account"
                        />
                    </Col>
                </div>
            </CommonModal>
        </Fragment>
    );
};

export default AddInvoice;
