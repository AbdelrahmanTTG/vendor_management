import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
    Col,
    Card,
    CardHeader,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import { H5, Spinner } from '../../../AbstractElements';
// import Add from './ModelAdd'
// import AddUser from './ModelAddUser'
// import Edit from './ModelEdit'
import { Previous, Next } from '../../../Constant';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axiosClient from "../../../pages/AxiosClint";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from 'react-select';
import {
    CheckCircle,
    Clock,
    RefreshCw,
    PauseCircle,
    XCircle,
  
} from "react-feather";
import CommonModal from '../../../pages/VM/Model';
import { useForm, Controller } from 'react-hook-form';

const TableAlias = (props) => {
        const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    
    const [dataTable, setdataTable] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [activeItemAlias, setActiveItemAlias] = useState(null);
    const [pageLinks, setPageLinks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1)
    const [queryParams, setQueryParams] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("due_date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [editorContent, setEditorContent] = useState("");
    const [isOpenIn, setIsOpenIn] = useState(false);
        const [selectedTask, setSelectedTask] = useState(null);
        const isEditMode = Boolean(selectedTask);
    
        const toggleIn = () => setIsOpenIn(!isOpenIn);
    
    useEffect(() => {
            setQueryParams(props.queryParams)
    }, [props?.queryParams])
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: "top-right"
                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: "top-right"
                });
                break;
            default:
                break;
        }
    };
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                per_page: 10,
                page: currentPage,
                queryParams: queryParams,
                sort_by: sortBy,
                sort_order: sortOrder,
            };
            try {
                setLoading(true);
                const { data } = await axiosClient.get("getAllTask", {
                    params: payload,
                });
                setdataTable(data?.tasks);
                setTotalPages(data.last_page);
            } catch (err) {
                const response = err.response;
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, queryParams, sortBy, sortOrder]);
    
     const getPaginationItems = () => {
            const items = [];
            const displayedPages = 5;
            const halfDisplayed = Math.floor(displayedPages / 2);
            let startPage = Math.max(1, currentPage - halfDisplayed);
            let endPage = Math.min(totalPages, currentPage + halfDisplayed);
    
            if (endPage - startPage < displayedPages - 1) {
                if (startPage === 1) {
                    endPage = Math.min(startPage + displayedPages - 1, totalPages);
                } else if (endPage === totalPages) {
                    startPage = Math.max(endPage - displayedPages + 1, 1);
                }
            }
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        <PaginationLink>{i}</PaginationLink>
                    </PaginationItem>
                );
            }
            if (startPage > 1) {
                items.unshift(
                    <PaginationItem disabled key="ellipsis-start">
                        <PaginationLink disabled>...</PaginationLink>
                    </PaginationItem>
                );
            }
            if (endPage < totalPages) {
                items.push(
                    <PaginationItem disabled key="ellipsis-end">
                        <PaginationLink disabled>...</PaginationLink>
                    </PaginationItem>
                );
            }
            if (startPage > 1) {
                items.unshift(
                    <PaginationItem onClick={() => handlePageChange(1)} key={1}>
                        <PaginationLink>{1}</PaginationLink>
                    </PaginationItem>
                );
            }
            if (endPage < totalPages) {
                items.push(
                    <PaginationItem onClick={() => handlePageChange(totalPages)} key={totalPages}>
                        <PaginationLink>{totalPages}</PaginationLink>
                    </PaginationItem>
                );
            }
    
            return items;
        };
     const handlePageChange = (newPage) => {
            if (newPage > 0 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
     };
     const stripHtmlTags = (html) => {
         if (!html) return "";
         return html.replace(/<\/?[^>]+(>|$)/g, "");
     };
     const getStatusLabel = (status) => {
         const found = taskStatuses.find((s) => s.value === String(status));
         return found ? found.label : "Unknown";
     };
    const taskStatuses = [
           {
               value: "0",
               label: "New",
               icon: <Clock size={14} />,
               color: "secondary",
           },
           {
               value: "1",
               label: "In Progress",
               icon: <RefreshCw size={14} />,
               color: "primary",
           },
           {
               value: "2",
               label: "Pending",
               icon: <PauseCircle size={14} />,
               color: "warning",
           },
           {
               value: "3",
               label: "Cancelled",
               icon: <XCircle size={14} />,
               color: "danger",
           },
           {
               value: "4",
               label: "Completed",
               icon: <CheckCircle size={14} />,
               color: "success",
           },
       ];
       const openEditModal = (task) => {
           setSelectedTask(task);
           setValue("title", task.title);
           setValue("due_date", task.due_date);
           setValue("status", {
               value: String(task.status),
               label: getStatusLabel(task.status),
           });
           setEditorContent(task.description);
           setValue("description", task.description);
           toggleIn();
       };
       const handleUpdate = async (data) => {
           try {
               await axiosClient.post("updateTask", {
                   id: selectedTask.id,
                   title: data.title,
                   due_date: data.due_date,
                   status: data.status?.value ?? 0,
                   description: data.description,
               });
               basictoaster("successToast", "Task updated successfully");

               setdataTable((prev) =>
                   prev.map((task) =>
                       task.id === selectedTask.id
                           ? {
                                 ...task,
                                 ...data,
                                 status: data.status?.value ?? 0,
                             }
                           : task
                   )
               );

               toggleIn();
           } catch (err) {
               const response = err.response;
               basictoaster(
                   "dangerToast",
                   response?.data?.error || "Failed to update task"
               );
           }
       };
       const handleDelete = async (taskId) => {
           const result = await Swal.fire({
               title: "Are you sure?",
               text: "Do you really want to delete this?",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#d33",
               cancelButtonColor: "#3085d6",
               confirmButtonText: "Yes, delete it!",
               cancelButtonText: "Cancel",
           });

           if (result.isConfirmed) {
               try {
                   await axiosClient.delete(`deleteTask/${taskId}`);

                   setdataTable((prev) =>
                       prev.filter((task) => task.id !== taskId)
                   );

                   Swal.fire("Deleted!", "Task has been deleted.", "success");
               } catch (err) {
                   const response = err.response;
                   Swal.fire(
                       " Ooops!",
                       response?.data?.error || "Failed to delete task",
                       "error"
                   );
               }
           }
       };
      const onSubmit = async (form) => {
            if (form !== "") {
                try {
                    form.status = form?.status?.value ?? "";
                    const formData = {
                        ...form,
                    };
                    const { data } = await axiosClient.post("userTask", formData);
                    setValue("title", "");
                    setValue("due_date", "");
                    reset();
                    toggleIn();
                    setdataTable((prev) => [data.task, ...prev]);
                    basictoaster(
                        "successToast",
                        "Task has been added successfully."
                    );
                } catch (err) {
                    const response = err.response;
                    basictoaster("dangerToast", response.data.message);
                }
            } else {
                errors.showMessages();
            }
        };
    return (
        <Fragment>
            <Col sm="12">
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <H5 className="mb-0">All Todo Tasks</H5>
                        <div className="ml-auto">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                    reset();
                                    setEditorContent("");
                                    setSelectedTask(null);
                                    toggleIn();
                                }}
                            >
                                <i className="fa fa-plus me-1"></i> Add Task
                            </button>
                        </div>
                    </CardHeader>

                    <div className="table-responsive">
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("id")}
                                    >
                                        ID{" "}
                                        {sortBy === "id"
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th
                                        scope="col"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("created_at")}
                                    >
                                        Created At{" "}
                                        {sortBy === "created_at"
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th
                                        scope="col"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("due_date")}
                                    >
                                        Due Date{" "}
                                        {sortBy === "due_date"
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th
                                        scope="col"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("title")}
                                    >
                                        Title{" "}
                                        {sortBy === "title"
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th
                                        scope="col"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            handleSort("description")
                                        }
                                    >
                                        Description{" "}
                                        {sortBy === "description"
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                    <th>{"Status"}</th>

                                    <th scope="col">{"Edit"}</th>
                                    <th scope="col">{"Delete"}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr colSpan={"lode"}>
                                        <td
                                            colSpan="8"
                                            style={{
                                                textAlign: "center",
                                                verticalAlign: "middle",
                                                height: "100px",
                                            }}
                                        >
                                            <div className="loader-box">
                                                <Spinner
                                                    attrSpinner={{
                                                        className: "loader-9",
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : dataTable?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                textAlign: "center",
                                                verticalAlign: "middle",
                                                height: "100px",
                                                fontSize: "16px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    dataTable?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.created_at}</td>
                                            <td>{item.due_date}</td>
                                            <td>{item.title}</td>
                                            <td>
                                                {stripHtmlTags(
                                                    item.description
                                                )}
                                            </td>
                                            <td>
                                                {(() => {
                                                    const statusObj =
                                                        taskStatuses.find(
                                                            (s) =>
                                                                s.value ===
                                                                String(
                                                                    item.status
                                                                )
                                                        );
                                                    if (!statusObj) return null;

                                                    return (
                                                        <span
                                                            className={`badge bg-${statusObj.color} d-inline-flex align-items-center gap-1 px-2 py-1`}
                                                            style={{
                                                                fontSize:
                                                                    "0.85rem",
                                                                borderRadius:
                                                                    "0.375rem",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                }}
                                                            >
                                                                {statusObj.icon}
                                                            </span>
                                                            <span>
                                                                {
                                                                    statusObj.label
                                                                }
                                                            </span>
                                                        </span>
                                                    );
                                                })()}
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            aria-label="Page navigation example"
                            className="pagination-primary mt-3"
                        >
                            <PaginationItem
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                <PaginationLink>{Previous}</PaginationLink>
                            </PaginationItem>
                            {getPaginationItems()}
                            <PaginationItem
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                <PaginationLink>{Next}</PaginationLink>
                            </PaginationItem>
                        </Pagination>
                    )}
                </Card>
            </Col>
            <CommonModal
                style={{ Width: "600px", height: "80vh" }}
                isOpen={isOpenIn}
                toggler={() => {
                    toggleIn();
                    reset();
                    setSelectedTask(null);
                }}
                size="lg"
                marginTop="-10vh"
                title={isEditMode ? "Edit Task" : "Add New Task"}
                onSave={
                    isEditMode
                        ? handleSubmit(handleUpdate)
                        : handleSubmit(onSubmit)
                }
            >
                <Row className="g-3 mb-3">
                    <Col md="12">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-2 col-form-label"
                                for="validationCustom01"
                            >
                                Title<span className="text-danger">*</span>
                            </Label>
                            <Col sm="10">
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    {...register("title", { required: true })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-2 col-form-label"
                                for="validationCustom01"
                            >
                                Due Date <span className="text-danger">*</span>
                            </Label>
                            <Col sm="4">
                                <input
                                    defaultValue=""
                                    className="form-control digits form-control"
                                    type="date"
                                    name="due_date"
                                    id="example-datetime-local-input"
                                    {...register("due_date", {
                                        required: true,
                                    })}
                                />
                            </Col>
                            <Label
                                className="col-sm-2 col-form-label"
                                for="validationCustom01"
                            >
                                Status
                            </Label>
                            <Col sm="4">
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            id="status"
                                            {...field}
                                            value={field.value}
                                            options={[
                                                { value: "0", label: "New" },
                                                {
                                                    value: "1",
                                                    label: "In Progress",
                                                },
                                                {
                                                    value: "2",
                                                    label: "Pending",
                                                },
                                                {
                                                    value: "3",
                                                    label: "Cancelled",
                                                },
                                                {
                                                    value: "3",
                                                    label: "Completed",
                                                },
                                            ]}
                                            className="js-example-basic-single col-sm-12"
                                            onChange={(option) => {
                                                field.onChange(option);
                                            }}
                                        />
                                    )}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup className="row">
                            <Label
                                className="col-sm-2 col-form-label"
                                for="validationCustom01"
                            >
                                Description
                                <span className="text-danger">*</span>
                            </Label>
                            <Col sm="10">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editorContent}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setEditorContent(data);
                                        setValue("description", data);
                                    }}
                                />

                                <input
                                    hidden
                                    disabled
                                    {...register("description", {
                                        required: true,
                                    })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    );
};

export default TableAlias;