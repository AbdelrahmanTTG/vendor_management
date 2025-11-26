import React, { Fragment, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import axiosClient from "../../AxiosClint";
import { useStateContext } from "../../context/contextAuth";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import { Btn, H5, P, Spinner } from "../../../AbstractElements";
import ResponseModal from "./ResponseModal";
import VmResponseModal from "./VmResponseModal";
import { FormGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import SweetAlert from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { set } from "react-hook-form";
import { decryptData } from "../../../crypto";

const ViewTicket = (props) => {
    const [redirect, setRedirect] = useState(false);
    const location = useLocation();
    const [ticketData, setTicketData] = useState([]);
    // const { ticket } = location.state || {};
    const { user } = useStateContext();
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modal2, setModal2] = useState(false);
    const toggle2 = () => setModal2(!modal2);
    const [temp, setTemp] = useState(false);
    const changeData = () => setTemp(!temp);
    const [fileInput, setFileInput] = useState("");
    const [statusInput, setStatusInput] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [optionsV, setOptionsV] = useState([]);
    const [resourceVendors, setResourceVendors] = useState([]);
    const [vmUsers, setVmUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optionsB, setOptionsB] = useState([]);
    const [Brand, setBrand] = useState([]);
    const [sub, setSub] = useState(false);
    const assignPermission = props.permissions?.assign;
    const params = new URLSearchParams(location.search);
    const encryptedData = params.get("data");
    let ticket = {};
    if (encryptedData) {
        try {
            ticket = decryptData(encryptedData);
        } catch (e) {}
    }
    const res = {
        ticket_id: ticket.id,
        user: user.id,
    };

    useEffect(() => {
        if (!ticket || !ticket.id) {
            setRedirect(true);
        } else {
            setBrand([ticket.brand.id]);

            const fetchData = async () => {
                try {
                    setSub(true);
                    const data = await axiosClient.post("getTicketData", res);
                    setTicketData(data.data?.ticket);
                    setResourceVendors(data.data?.resourceVendors);
                    setVmUsers(data.data?.vmUsers);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching Data:", error);
                } finally {
                    setSub(false);
                }
            };
            fetchData();
        }
    }, [ticket?.id, temp]);

    if (redirect) {
        return <Navigate to="/" />;
    }

    const handleDownload = async (filename) => {
        try {
            const response = await axiosClient.post(
                "download",
                { filename },
                { responseType: "blob" }
            );
            const file = new Blob([response.data], {
                type: response.headers["content-type"],
            });
            const link = document.createElement("a");
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers["content-disposition"];
            const fileName = contentDisposition
                ? contentDisposition.split("filename=")[1]
                : filename;
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const response = err.response;
            console.error(response);
            alert(
                "Error downloading the file: " +
                    (response?.data?.message || "Unknown error")
            );
        }
    };

    const handelingSelect = async (
        tablename,
        setOptions,
        fieldName,
        searchTerm = ""
    ) => {
        if (!tablename) return;
        try {
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename,
                    vendor_brands: Brand,
                },
            });
            const formattedOptions = data.map((item) => ({
                value: item?.id,
                label: item?.name || item?.gmt,
            }));

            setOptions(formattedOptions);
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
        }
    };
    const handleInputChange = (
        inputValue,
        tableName,
        fieldName,
        setOptions,
        options
    ) => {
        if (inputValue.length === 0) {
            setOptions([]);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };

    const changeTicketStatus = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const TicketRes = {
            ...Object.fromEntries(formData),
            ticket: ticket.id,
            user: user.id,
            file: fileInput,
            vendor: formData.getAll("vendor"),
            comment: commentInput,
        };

        if (statusInput == "0" && commentInput.trim() == "") {
            toast.error("Please Enter Rejection Reason!");
        } else {
            //  setSub(true);
            axiosClient
                .post("changeTicketStatus", TicketRes, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(({ data }) => {
                    switch (data.type) {
                        case "success":
                            setTemp(!temp);
                            setStatusInput("");
                            setFileInput("");
                            setCommentInput();
                            toast.success(
                                "The Vendor has been successfully selected."
                            );
                            break;
                        case "error":
                            toast.error(data.message);
                            break;
                    }
                    //  setSub(false);
                })
                .catch(() => {
                    toast.error("Something went wrong!");
                    //  setSub(false);
                });
        }
    };

    const AssignTicket = (event) => {
        event.preventDefault();
        setSub(true);

        const formData = new FormData(event.currentTarget);
        const res = {
            ...Object.fromEntries(formData),
            ticket: ticket.id,
            user: user.id,
            assignPermission: assignPermission,
        };
        axiosClient.post("assignTicket", res).then(({ data }) => {
            switch (data.type) {
                case "success":
                    toast.success(data.message);
                    setTemp(!temp);
                    break;
                case "error":
                    toast.error(data.message);
                    break;
            }
        });
        setSub(false);
    };
    const deleteRes = (id) => {
        if (id) {
            SweetAlert.fire({
                title: "Are you sure?",
                text: `Do you want to delete This Resource ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const payload = {
                        id: id,
                        ticket: ticket.id,
                        user: user.id,
                    };
                    axiosClient
                        .delete("deleteTicketResource", { data: payload })
                        .then((response) => {
                            if (response.status == 200) {
                                setTemp(!temp);
                                SweetAlert.fire(
                                    "Deleted!",
                                    `The Resource has been deleted..`,
                                    "success"
                                );
                            } else {
                                SweetAlert.fire(
                                    "Ooops !",
                                    " An error occurred while deleting. :)",
                                    "error"
                                );
                            }
                        });
                } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                    SweetAlert.fire(
                        "Cancelled",
                        "Your item is safe :)",
                        "info"
                    );
                }
            });
        }
    };

    return (
        <Fragment>
            {loading ? (
                <div className="loader-box">
                    <Spinner attrSpinner={{ className: "loader-6" }} />
                </div>
            ) : (
                <>
                    <Card>
                        <CardHeader className=" b-l-primary p-b-0">
                            <H5>Ticket Details</H5>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table-bordered mb-10">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                {"Ticket Number"}
                                            </th>
                                            <th scope="col">
                                                {"Request Type"}
                                            </th>
                                            <th scope="col">{"Brand"}</th>
                                            <th scope="col">
                                                {"Number Of Rescource"}
                                            </th>
                                            <th scope="col">{"Service"}</th>
                                            <th scope="col">{"Task Type	"}</th>
                                            <th scope="col">{"Rate"}</th>
                                            <th scope="col">{"Count"}</th>
                                            <th scope="col">{"Unit"}</th>
                                            <th scope="col">{"Currency"}</th>
                                            <th scope="col">
                                                {"Source Language"}
                                            </th>
                                            <th scope="col">
                                                {"Target Language"}
                                            </th>
                                            <th scope="col">{"Start Date"}</th>
                                            <th scope="col">
                                                {"Delivery Date"}
                                            </th>
                                            <th scope="col">
                                                {"Subject Matter"}
                                            </th>
                                            <th scope="col">{"Software"}</th>
                                            <th scope="col">
                                                {"File Attachment"}
                                            </th>
                                            <th scope="col">{"Status"}</th>
                                            <th scope="col">{"Created By"}</th>
                                            <th scope="col">{"Created At"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{ticketData?.id}</td>
                                            <td>{ticketData?.request_type}</td>
                                            <td>{ticket?.brand?.name}</td>
                                            <td>
                                                {ticketData?.number_of_resource}
                                            </td>
                                            <td>{ticketData?.service}</td>
                                            <td>{ticketData?.task_type}</td>
                                            <td>{ticketData?.rate}</td>
                                            <td>{ticketData?.count}</td>
                                            <td>{ticketData?.unit}</td>
                                            <td>{ticketData?.currency}</td>
                                            <td>{ticketData?.source_lang}</td>
                                            <td>{ticketData?.target_lang}</td>
                                            <td>{ticketData?.start_date}</td>
                                            <td>{ticketData?.delivery_date}</td>
                                            <td>{ticketData?.subject}</td>
                                            <td>{ticketData?.software}</td>
                                            <td>
                                                {ticketData.fileLink != null ? (
                                                    <Link
                                                        to={ticketData.fileLink}
                                                        className="txt-dangers"
                                                    >
                                                        {"View File"}
                                                    </Link>
                                                ) : (
                                                    "No File Found"
                                                )}
                                            </td>
                                            <td>{ticketData.status}</td>
                                            <td>{ticketData.created_by}</td>
                                            <td>{ticketData.created_at}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={2}>
                                                {"Requester Function"}
                                            </th>
                                            <td colSpan={18}>
                                                {" "}
                                                {
                                                    ticketData.requester_function
                                                }{" "}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan={2}>{"Comment"}</th>
                                            <td
                                                colSpan={18}
                                                dangerouslySetInnerHTML={{
                                                    __html: ticketData.comment,
                                                }}
                                            ></td>
                                        </tr>
                                        {ticketData.statusVal == 0 && (
                                            <tr>
                                                <th colSpan={2}>
                                                    {"Rejection Reason"}
                                                </th>
                                                <td
                                                    colSpan={18}
                                                    dangerouslySetInnerHTML={{
                                                        __html: ticketData.rejection_reason,
                                                    }}
                                                ></td>
                                            </tr>
                                        )}
                                        {ticketData.assignedUser != 0 && (
                                            <tr>
                                                <th colSpan={2}>
                                                    {"Assigned To"}
                                                </th>
                                                <td colSpan={18}>
                                                    {ticketData.assignedUser}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                    {/*  Assign Ticket */}
                    {assignPermission == 1 &&
                        statusInput != "0" &&
                        (ticketData.statusVal == 1 ||
                            ticketData.statusVal == 2) && (
                            <>
                                <Card>
                                    <CardHeader className="b-t-primary p-b-0">
                                        <Row>
                                            <Col sm="9">
                                                <H5>
                                                    {" "}
                                                    Assign Ticket To Vm Team{" "}
                                                </H5>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        <form onSubmit={AssignTicket}>
                                            <FormGroup className="row">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Assign Ticket To"}
                                                </Label>
                                                <Col sm="7">
                                                    <Select
                                                        name="vmUser"
                                                        id="vmUser"
                                                        required
                                                        options={vmUsers}
                                                        className="js-example-basic-single"
                                                    />
                                                </Col>
                                                <Col sm="2">
                                                    <Btn
                                                        attrBtn={{
                                                            color: "primary",
                                                            type: "submit",
                                                            disabled: sub,
                                                        }}
                                                    >
                                                        <i className="fa fa-send-o"></i>{" "}
                                                        {sub ? (
                                                            <>
                                                                <Spinner size="sm" />{" "}
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            "Send"
                                                        )}
                                                    </Btn>
                                                </Col>
                                            </FormGroup>
                                        </form>
                                    </CardBody>
                                </Card>
                            </>
                        )}
                    {/*  action */}
                    <Card>
                        <CardHeader className="b-t-primary p-b-0">
                            <Row>
                                <Col sm="9">
                                    <H5> Ticket Action </H5>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <form
                                id="changeStatusForm"
                                onSubmit={changeTicketStatus}
                            >
                                {ticketData.statusVal <= 5 && (
                                    <>
                                        <FormGroup className="row mt-2">
                                            <Label className="col-sm-3 col-form-label">
                                                {"Ticket Status"}
                                            </Label>
                                            <Col sm="9">
                                                <Input
                                                    type="select"
                                                    name="status"
                                                    className="custom-select form-control"
                                                    defaultValue={
                                                        ticketData.statusVal
                                                    }
                                                    onChange={(e) =>
                                                        setStatusInput(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        ticketData.statusVal ==
                                                            5 ||
                                                        ticketData.statusVal ==
                                                            0 ||
                                                        ticketData.statusVal ==
                                                            4
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    {ticketData.statusVal ==
                                                        1 && (
                                                        <>
                                                            <option
                                                                value="1"
                                                                disabled
                                                            >
                                                                {"New"}
                                                            </option>
                                                            <option value="2">
                                                                {"Opened"}
                                                            </option>
                                                            <option value="0">
                                                                {"Reject"}
                                                            </option>
                                                        </>
                                                    )}
                                                    {ticketData.statusVal ==
                                                        2 && (
                                                        <>
                                                            <option value="2">
                                                                {"Opened"}
                                                            </option>
                                                            <option value="3">
                                                                {
                                                                    "Partly Closed"
                                                                }
                                                            </option>
                                                        </>
                                                    )}
                                                    {ticketData.statusVal ==
                                                        3 && (
                                                        <>
                                                            <option value="3">
                                                                {
                                                                    "Partly Closed"
                                                                }
                                                            </option>
                                                            <option value="4">
                                                                {"Closed"}
                                                            </option>
                                                        </>
                                                    )}
                                                    {ticketData.statusVal ==
                                                        5 && (
                                                        <option value="5">
                                                            {
                                                                "Waiting Requester Acceptance"
                                                            }
                                                        </option>
                                                    )}
                                                    {ticketData.statusVal ==
                                                        4 && (
                                                        <option value="4">
                                                            {"Closed"}
                                                        </option>
                                                    )}
                                                    {ticketData.statusVal ==
                                                        0 && (
                                                        <option value="0">
                                                            {"Rejected"}
                                                        </option>
                                                    )}
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                        {statusInput == "0" && (
                                            <FormGroup className="row mt-2">
                                                <Label className="col-sm-3 col-form-label">
                                                    {"Rejection Reason "}
                                                </Label>
                                                <Col sm="9">
                                                    <CKEditor
                                                        name="comment"
                                                        required
                                                        editor={ClassicEditor}
                                                        onChange={(
                                                            e,
                                                            editor
                                                        ) => {
                                                            const data =
                                                                editor.getData();
                                                            setCommentInput(
                                                                data
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        )}
                                        <hr />
                                    </>
                                )}
                                {/*  CV Request */}
                                {statusInput != "0" &&
                                    ticketData.request_type_val == 5 &&
                                    ticketData.statusVal > 1 &&
                                    (ticketData.statusVal == 2 ? (
                                        <FormGroup className="row mt-2">
                                            <Label className="col-sm-3 col-form-label">
                                                {"Attachment"}
                                            </Label>
                                            <Col sm="9">
                                                <Input
                                                    className="form-control"
                                                    type="file"
                                                    onChange={(e) =>
                                                        setFileInput(
                                                            e.target.files[0]
                                                        )
                                                    }
                                                    required={
                                                        ticketData.statusVal ==
                                                        1
                                                            ? false
                                                            : true
                                                    }
                                                />
                                            </Col>
                                        </FormGroup>
                                    ) : (
                                        ticketData["TicketResource"] != null &&
                                        ticketData["TicketResource"].length >
                                            0 &&
                                        ticketData["TicketResource"].map(
                                            (item, i) => (
                                                <Row
                                                    key={i}
                                                    className="row mt-2"
                                                >
                                                    <Col>
                                                        <Label className="col-sm-3 col-form-label">
                                                            {"Attachment"}
                                                        </Label>
                                                        <button
                                                            type="reset"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    "tickets/" +
                                                                        item.file
                                                                )
                                                            }
                                                            className="btn btn-sm btn-trasparent txt-danger p-0 mt-2 "
                                                        >
                                                            {" "}
                                                            <i className="fa fa-download"></i>{" "}
                                                            {"Click Here"}
                                                        </button>
                                                    </Col>
                                                </Row>
                                            )
                                        )
                                    ))}
                                {/*  Resource Availabilty */}
                                {statusInput != "0" &&
                                    ticketData.request_type_val == 4 &&
                                    ticketData.statusVal > 1 &&
                                    (ticketData.statusVal == 2 ? (
                                        <FormGroup className="row mt-2">
                                            <Label className="col-sm-3 col-form-label">
                                                {"Number Of Resources"}
                                            </Label>
                                            <Col sm="9">
                                                <Input
                                                    className="form-control"
                                                    type="number"
                                                    name="number_of_resource"
                                                    defaultValue={
                                                        ticketData[
                                                            "TicketResource"
                                                        ] != null &&
                                                        ticketData[
                                                            "TicketResource"
                                                        ].length > 0
                                                            ? ticketData[
                                                                  "TicketResource"
                                                              ][0][
                                                                  "number_of_resource"
                                                              ]
                                                            : ""
                                                    }
                                                    required={
                                                        ticketData.statusVal ==
                                                        1
                                                            ? false
                                                            : true
                                                    }
                                                />
                                            </Col>
                                        </FormGroup>
                                    ) : (
                                        <FormGroup className="row mt-2">
                                            <Label className="col-sm-3 col-form-label">
                                                {"Number Of Resources"}
                                            </Label>
                                            <Col sm="9">
                                                <Input
                                                    className="form-control"
                                                    defaultValue={
                                                        ticketData[
                                                            "TicketResource"
                                                        ] != null &&
                                                        ticketData[
                                                            "TicketResource"
                                                        ].length > 0
                                                            ? ticketData[
                                                                  "TicketResource"
                                                              ][0][
                                                                  "number_of_resource"
                                                              ]
                                                            : ""
                                                    }
                                                    disabled
                                                />
                                            </Col>
                                        </FormGroup>
                                    ))}
                                {/*  new Resource  */}
                                {statusInput != "0" &&
                                    (ticketData.request_type_val == 1 ||
                                        ticketData.request_type_val == 3) &&
                                    ticketData.statusVal > 1 && (
                                        <>
                                            {ticketData.statusVal == 2 && (
                                                <FormGroup className="row mt-3">
                                                    {/* Vendor */}
                                                    <Col md="12">
                                                        <Label
                                                            className="col-form-label-sm f-12 mb-1"
                                                            htmlFor="vendor"
                                                        >
                                                            Select Vendor
                                                        </Label>
                                                        <Select
                                                            id="vendor"
                                                            name="vendor"
                                                            options={optionsV}
                                                            className="js-example-basic-single"
                                                            isMulti
                                                            required={
                                                                resourceVendors !=
                                                                    null ||
                                                                ticketData.statusVal ==
                                                                    1
                                                                    ? false
                                                                    : true
                                                            }
                                                            onInputChange={(
                                                                inputValue
                                                            ) =>
                                                                handleInputChange(
                                                                    inputValue,
                                                                    "vendors",
                                                                    "vendor",
                                                                    setOptionsV,
                                                                    optionsV
                                                                )
                                                            }
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            )}
                                            {resourceVendors != null &&
                                                resourceVendors.length > 0 && (
                                                    <div className="table-responsive mt-5">
                                                        <Table className="table-bordered mb-10">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">
                                                                        {"Name"}
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Email"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Contact"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Country of Residence"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Mother Tongue"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Profile"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Source Language"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Target Language"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Dialect"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Service"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Task Type"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {"Unit"}
                                                                    </th>
                                                                    <th scope="col">
                                                                        {"Rate"}
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Currency"
                                                                        }
                                                                    </th>
                                                                    <th scope="col">
                                                                        {
                                                                            "Created By"
                                                                        }
                                                                    </th>
                                                                    {ticketData.statusVal !=
                                                                        4 && (
                                                                        <th scope="col">
                                                                            {
                                                                                "Delete"
                                                                            }
                                                                        </th>
                                                                    )}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {resourceVendors.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]
                                                                                        .email
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]
                                                                                        .contact
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "country"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]
                                                                                        .mother_tongue
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]
                                                                                        .profile
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "source_lang"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "target_lang"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]
                                                                                        ?.dialect
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "service"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "task_type"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "unit"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]
                                                                                        ?.rate
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ][
                                                                                        "vendor_sheet"
                                                                                    ]?.[0]?.[
                                                                                        "currency"
                                                                                    ]
                                                                                        ?.name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item[
                                                                                        "vendor"
                                                                                    ]?.[
                                                                                        "created_by"
                                                                                    ]
                                                                                        ?.user_name
                                                                                }
                                                                            </td>
                                                                            {ticketData.statusVal !=
                                                                                4 && (
                                                                                <td>
                                                                                    {" "}
                                                                                    <button
                                                                                        type="reset"
                                                                                        onClick={() =>
                                                                                            deleteRes(
                                                                                                item.id
                                                                                            )
                                                                                        }
                                                                                        className="btn btn-sm btn-trasparent txt-danger p-0 mt-2"
                                                                                    >
                                                                                        {" "}
                                                                                        <i className="icofont icofont-ui-delete"></i>
                                                                                    </button>
                                                                                </td>
                                                                            )}
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                )}
                                        </>
                                    )}
                                {ticketData.statusVal <= 3 &&
                                    ticketData.statusVal != 0 && (
                                        <Row className="mt-2">
                                            <Col className="text-end">
                                                <Btn
                                                    attrBtn={{
                                                        color: "primary",
                                                        type: "submit",
                                                        disabled: sub,
                                                    }}
                                                >
                                                    <i className="fa fa-check-square-o"></i>
                                                    {sub ? (
                                                        <>
                                                            <Spinner size="sm" />{" "}
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        "Save Changes"
                                                    )}
                                                </Btn>
                                            </Col>
                                        </Row>
                                    )}
                            </form>
                        </CardBody>
                    </Card>
                    {/*  response */}
                    <Card>
                        <CardHeader className="b-t-primary p-b-0">
                            <Row>
                                <Col sm="9">
                                    <H5> Ticket Response </H5>
                                </Col>
                                <Col sm="3">
                                    {ticketData.statusVal == 2 &&
                                        statusInput != "0" && (
                                            <>
                                                <ResponseModal
                                                    isOpen={modal}
                                                    title={"Add Response"}
                                                    toggler={toggle}
                                                    fromInuts={res}
                                                    sendDataToParent={toggle}
                                                    changeTicketData={
                                                        changeData
                                                    }
                                                    size="xl"
                                                ></ResponseModal>
                                                <div className="pro-shop text-end">
                                                    <Btn
                                                        attrBtn={{
                                                            color: "primary",
                                                            className:
                                                                "btn btn-primary me-2",
                                                            onClick: toggle,
                                                        }}
                                                    >
                                                        <i className="icofont icofont-ui-messaging me-2"></i>{" "}
                                                        {"Add Response"}
                                                    </Btn>
                                                </div>
                                            </>
                                        )}
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table-bordered mb-10">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Response</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ticketData["Response"] ? (
                                            <>
                                                {ticketData["Response"].map(
                                                    (item, index) => (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {
                                                                    item.created_by
                                                                }
                                                            </td>
                                                            <td scope="row">
                                                                <p
                                                                    className="mb-0"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: item.response,
                                                                    }}
                                                                />
                                                                <div className="clearfix"></div>
                                                                {item.fileLink !=
                                                                    null &&
                                                                    item.fileLink.trim() !=
                                                                        "" && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDownload(
                                                                                    "tickets/" +
                                                                                        item.fileLink
                                                                                )
                                                                            }
                                                                            className="btn btn-sm btn-trasparent txt-danger p-0 mt-2"
                                                                        >
                                                                            Attachment
                                                                            :{" "}
                                                                            <i className="fa fa-download"></i>{" "}
                                                                            {
                                                                                "View File"
                                                                            }
                                                                        </button>
                                                                    )}
                                                            </td>
                                                            <td scope="row">
                                                                {
                                                                    item.created_at
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center"
                                                    >
                                                        NO Data Found
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                    {/*  vm response */}
                    <Card>
                        <CardHeader className="b-t-primary p-b-0">
                            <Row>
                                <Col sm="9">
                                    <H5> VM Team Ticket Comments </H5>
                                </Col>
                                <Col sm="3">
                                    {ticketData.statusVal == 2 &&
                                        statusInput != "0" && (
                                            <>
                                                <VmResponseModal
                                                    isOpen={modal2}
                                                    title={"Add Comment"}
                                                    toggler={toggle2}
                                                    fromInuts={res}
                                                    sendDataToParent={toggle2}
                                                    changeTicketData={
                                                        changeData
                                                    }
                                                    size="xl"
                                                ></VmResponseModal>
                                                <div className="pro-shop text-end">
                                                    <Btn
                                                        attrBtn={{
                                                            color: "primary",
                                                            className:
                                                                "btn btn-primary me-2",
                                                            onClick: toggle2,
                                                        }}
                                                    >
                                                        <i className="icofont icofont-ui-messaging me-2"></i>{" "}
                                                        {"Add Comment"}
                                                    </Btn>
                                                </div>
                                            </>
                                        )}
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table-bordered mb-10">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Response</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ticketData["TeamResponse"] ? (
                                            <>
                                                {ticketData["TeamResponse"].map(
                                                    (item, index) => (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {
                                                                    item.created_by
                                                                }
                                                            </td>
                                                            <td scope="row">
                                                                <p
                                                                    className="mb-0"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: item.response,
                                                                    }}
                                                                />
                                                            </td>
                                                            <td scope="row">
                                                                {
                                                                    item.created_at
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="text-center"
                                                    >
                                                        NO Data Found
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                    {/*  time */}
                    <Card>
                        <CardHeader className="b-t-primary p-b-0">
                            <Row>
                                <Col sm="12">
                                    <H5> Ticket Log </H5>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table-bordered mb-10">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Ticket Status</th>
                                            <th>
                                                Assigned To & Vendor resource
                                            </th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{ticketData.created_by}</td>
                                            <td>New</td>
                                            <td></td>

                                            <td>{ticketData.created_at}</td>
                                        </tr>
                                        {ticketData["Time"] && (
                                            <>
                                                {ticketData["Time"].map(
                                                    (item, index) => (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {
                                                                    item.created_by
                                                                }
                                                            </td>
                                                            <td scope="row">
                                                                {item.status}
                                                            </td>
                                                            <td scope="row">
                                                                {
                                                                    item?.assign_to
                                                                }
                                                            </td>
                                                            <td scope="row">
                                                                {
                                                                    item.created_at
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </>
                                        )}
                                        <tr className="bg-light ">
                                            <th>Time taken</th>
                                            <td colSpan={2}>
                                                {ticketData.TimeTaken}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </>
            )}
        </Fragment>
    );
};

export default ViewTicket;
