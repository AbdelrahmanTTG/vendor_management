import React, { useState, useRef, useEffect } from 'react';
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Button,
    Tooltip,
    Card,
    CardHeader,
    CardBody,
    Label,
    Row,
    Col,
    FormGroup,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from 'react-select';
import {
    Activity,
    Bell,
    CheckCircle,
    FileText,
    UserCheck,
    Clock,
    RefreshCw,
    PauseCircle,
    XCircle,
  
} from "react-feather";
import Swal from "sweetalert2";

import CommonModal from '../../../pages/VM/Model';
import { Btn, Spinner } from '../../../AbstractElements';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosClient from "../../../pages/AxiosClint";
import { useNavigate } from "react-router-dom";

const ToDo = () => {
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
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenIn, setIsOpenIn] = useState(false);
    const [tasks, setTasks] = useState([]);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(5); 
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const toggleIn = () => setIsOpenIn(!isOpenIn);
    const toggle = () => setIsOpen(!isOpen);
    const isEditMode = Boolean(selectedTask);
    const [editorContent, setEditorContent] = useState("");
    const navigate = useNavigate();

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
                setTasks((prev) => [data.task, ...prev]);
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
    useEffect(() => {
        fetchUserTasks();
    }, []);

    const fetchUserTasks = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const { data } = await axiosClient.get("allTask", {
                params: {
                    limit,
                    offset,
                },
            });

            setTasks((prev) => [...prev, ...data.tasks]);
            setOffset((prev) => prev + limit);

            if (offset + limit >= data.total) {
                setHasMore(false);
            }
        } catch (err) {
            const response = err.response;
            basictoaster(
                "dangerToast",
                response?.data?.error || "Failed to fetch tasks"
            );
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusStyle = (status) => {
        switch (status) {
            case "0":
            case 0:
                return { color: "secondary", icon: <Clock size={16} /> }; // New
            case "1":
            case 1:
                return { color: "primary", icon: <RefreshCw size={16} /> }; // In Progress
            case "2":
            case 2:
                return { color: "warning", icon: <PauseCircle size={16} /> }; // Pending
            case "3":
            case 3:
                return { color: "danger", icon: <XCircle size={16} /> }; // Cancelled
            case "4":
            case 4:
                return { color: "success", icon: <CheckCircle size={16} /> }; // Completed
            default:
                return { color: "secondary", icon: <Clock size={16} /> };
        }
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
    const getStatusLabel = (status) => {
        const found = taskStatuses.find((s) => s.value === String(status));
        return found ? found.label : "Unknown";
    };
    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };
    const handleStatusChange = async (taskId, newStatus) => {
        if (loadingStatus) return; 

        setLoadingStatus(true);
        try {
            await axiosClient.post("updateTaskStatus", {
                task_id: taskId,
                status: newStatus,
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            basictoaster("successToast", "Status updated successfully");
        } catch (err) {
            const response = err.response;
            basictoaster(
                "dangerToast",
                response?.data?.error || "Failed to update status"
            );
        } finally {
            setLoadingStatus(false);
        }
    };
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

            setTasks((prev) =>
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

                setTasks((prev) => prev.filter((task) => task.id !== taskId));

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
    
    
    
    
    return (
        <>
            <li style={{ marginTop: "-5px", display: "inline-block" }}>
                <a className="text-dark"  onClick={toggle}>
                    <FileText />
                </a>
            </li>

            <Offcanvas
                isOpen={isOpen}
                toggle={toggle}
                direction="end"
                style={{ width: "50vw" }}
            >
                <OffcanvasHeader toggle={toggle}>My Tasks</OffcanvasHeader>
                <OffcanvasBody
                    onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } =
                            e.currentTarget;
                        if (scrollTop + clientHeight >= scrollHeight - 5) {
                            fetchUserTasks();
                        }
                    }}
                >
                    <Card className="mb-3 border-0">
                        <CardHeader className="d-flex justify-content-between align-items-center border-bottom px-0">
                            <h6 className="mb-0">My Task List</h6>
                            <div className="d-flex gap-2">
                                <Btn
                                    size="sm"
                                    attrBtn={{
                                        color: "btn btn-primary",
                                        onClick: () => {
                                            reset();
                                            setEditorContent("");
                                            setSelectedTask(null);
                                            toggleIn();
                                        },
                                    }}
                                >
                                    Add
                                </Btn>

                                <Btn
                                    size="sm"
                                    attrBtn={{
                                        color: "btn btn-success",
                                        onClick: () => navigate("tasks"),
                                    }}
                                >
                                    View
                                </Btn>
                            </div>
                        </CardHeader>
                        <CardBody className="px-0">
                            <ul className="list-unstyled">
                                {tasks?.map((task) => {
                                    const { color, icon } = getStatusStyle(
                                        task.status
                                    );

                                    return (
                                        <li
                                            key={task.id}
                                            className={`d-flex border border-${color} rounded  p-3`}
                                            style={{
                                                marginBottom: "1rem",
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "60px",
                                                    position: "relative",
                                                }}
                                            >
                                                <div
                                                    className={`bg-${color} text-white rounded d-flex align-items-center justify-content-center`}
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform:
                                                            "translate(-50%, -50%)",
                                                    }}
                                                >
                                                    {icon}
                                                </div>
                                            </div>

                                            <div className="flex-grow-1 ps-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-1">
                                                        #{task.id} -{" "}
                                                        {task.title}
                                                    </h6>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    task
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center gap-1 small">
                                                    <span className="text-muted">
                                                        Created At
                                                    </span>
                                                    <span>:</span>
                                                    <span className="text-primary">
                                                        {task.created_at}
                                                    </span>
                                                </div>
                                                <div className="text-muted small mt-1 d-flex flex-wrap align-items-center gap-2">
                                                    <span>
                                                        Due: {task.due_date}
                                                    </span>
                                                    <span
                                                        className={`ms-2 badge bg-${color}`}
                                                    >
                                                        {getStatusLabel(
                                                            task.status
                                                        )}
                                                    </span>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {taskStatuses
                                                            .filter(
                                                                (s) =>
                                                                    s.value !==
                                                                    String(
                                                                        task.status
                                                                    )
                                                            )
                                                            .map(
                                                                (
                                                                    statusOption
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            statusOption.value
                                                                        }
                                                                        className={`btn btn-sm btn-outline-${statusOption.color} d-flex align-items-center gap-1`}
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                task.id,
                                                                                statusOption.value
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            statusOption.icon
                                                                        }
                                                                        {
                                                                            statusOption.label
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                                {task.description && (
                                                    <div
                                                        className="mt-3"
                                                        style={{
                                                            fontSize: "1rem",
                                                            fontWeight: "500",
                                                            color: "#444",
                                                            lineHeight: "1.6",
                                                        }}
                                                    >
                                                        {stripHtmlTags(
                                                            task.description
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardBody>
                    </Card>
                    {hasMore && (
                        <div className="text-center mt-3">
                            <button
                                className="btn btn-outline-primary"
                                onClick={fetchUserTasks}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </OffcanvasBody>
            </Offcanvas>
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
        </>
    );
};

export default ToDo;
