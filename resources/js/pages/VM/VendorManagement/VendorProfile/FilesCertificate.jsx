import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, Collapse, Label, Row, Col, FormGroup, Input } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import { useForm, Controller } from 'react-hook-form';
import axiosClient from "../../../../pages/AxiosClint";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2';
const FilesCertificate = (props) => {
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
    const toggleCollapse = () => setIsOpen(!isOpen);

    const [cvFileName, setCvFileName] = useState(null);
    const [cvFileNames, setCvFileNames] = useState(false);

    const [ndaFileName, setNdaFileName] = useState(null);
    const [ndaFileNames, setNdaFileNames] = useState(false);

    const { control, register, handleSubmit, formState: { errors } } = useForm();
    const [rows, setRows] = useState([]);
    const [rowIdToDelete, setRowIdToDelete] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event, setFileName) => {
        const file = event.target.files[0];

        setFileName(file ? file : null);
    };
    const addRow = () => {
        const maxId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) : 0;
        const newRow = { id: maxId + 1, File_Title: '', File_Content: '', File: null };
        setRows([...rows, newRow]);
    };

    const handleInputChange = (event, rowId, nameInput) => {
        const updatedRows = rows.map(row => row.id === rowId ? { ...row, [nameInput]: event.target.value } : row);
        setRows(updatedRows);
    };

    const handleRowFileChange = (event, rowId) => {
        const file = event.target.files[0];
        const updatedRows = rows.map(row => row.id === rowId ? { ...row, File: file } : row);
        setRows(updatedRows);
    };

    const deleteRow = (rowId, idUpdate) => {
        if (idUpdate) {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete that payment wallet ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(idUpdate);
                    if (success) {
                        SweetAlert.fire(
                            'Deleted!',
                            `This payment wallet has been deleted..`,
                            'success'
                        );
                        setRowIdToDelete(rowId);
                    } else {
                        SweetAlert.fire(
                            'Ooops !',
                            ' An error occurred while deleting. :)',
                            'error'
                        );
                    }

                } else if (result.dismiss === SweetAlert.DismissReason.cancel) {
                    SweetAlert.fire(
                        'Cancelled',
                        'Your item is safe :)',
                        'info'
                    );
                }
            });
        } else {
            if (window.confirm("Are you sure you want to delete this row?")) {
                setRowIdToDelete(rowId);
            }
        }
    };
    useEffect(() => {
        if (rowIdToDelete !== null) {
            setRows((prevRows) => prevRows.filter(row => row.id !== rowIdToDelete));
            setRowIdToDelete(null);
        }
    }, [rowIdToDelete]);
    const onDelete = async (id) => {
        if (!props.backPermissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("delete", { data: payload });
            return data
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                setErrorMessage(response.data.message || "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            return false
        }
    };
    const onSubmit = async () => {
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        if (!props.id) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            if (!cvFileName || !ndaFileName){return}
            const formData = new FormData();
            formData.append('cv', cvFileName);
            formData.append('nda', ndaFileName);

            formData.append('vendor_id', props.id);

            rows.forEach((row, index) => {
                if (row.File_Title) formData.append(`file_title_${index}`, row.File_Title);
                if (row.File_Content) formData.append(`file_content_${index}`, row.File_Content);
                if (row.File) formData.append(`file_${index}`, row.File);
            });


            rows.forEach((row, index) => {
                if (row.File) formData.append(`file_${index}`, row.File);
            });
            try {
                const response = await axiosClient.post("uploadFiles", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                basictoaster("successToast", "Added successfully !");

                setIsSubmitting(true)
            } catch (err) {
                console.error("Error:", err.response ? err.response.data : err.message);
            }
        }
    };
    useEffect(() => {

        if (props.mode === "edit") {
            // setLoading2(true);
            if (props.VendorFiles) {
                if (props.VendorFiles.VendorFiles) {
                    const data = props.VendorFiles.VendorFiles;
                    setCvFileName(data.vendor.cv);
                    setNdaFileName(data.vendor.nda)
                    data.vendor.cv ? setCvFileNames(true) : setCvFileNames(false)
                    data.vendor.nda ? setNdaFileNames(true) : setNdaFileNames(false)
                    setRows(data.files.map((file, index) => ({
                        id: index + 1,
                        idUpdate: file.id ,
                        File_Title: file.file_title,
                        File_Content: file.file_content,
                        File_URL: file.file_path 
                    })));
                    // setNdaFileName(nda_file);
                }
            }
        }
    }, [props.VendorFiles]);
    const handleDownload = async (filename) => {
        try {
            const response = await axiosClient.post("download", { filename }, { responseType: 'blob' });
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(file);
            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : filename;
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const response = err.response;
            console.error(response);
            alert('Error downloading the file: ' + (response?.data?.message || 'Unknown error'));
        }


    };
    const handleClick = (data) => {
        if (props.onSubmit === 'onSubmit' && !isSubmitting) {
            onSubmit(data);
        } else if (props.onSubmit === 'onUpdate' || isSubmitting) {
            Update(data)
        }
    };
    const Update = async () => {
        if (!props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!cvFileName && !ndaFileName) { return }
        const formData = new FormData();

        formData.append('cv', cvFileName);
        formData.append('nda', ndaFileName);

        formData.append('vendor_id', props.id);

        rows.forEach((row, index) => {
            if (row.idUpdate) formData.append(`file_id_${index}`, row.idUpdate);
            if (row.File_Title) formData.append(`file_title_${index}`, row.File_Title);
            if (row.File_Content) formData.append(`file_content_${index}`, row.File_Content);
            if (row.File) formData.append(`file_${index}`, row.File);
        });


        rows.forEach((row, index) => {
            if (row.File) formData.append(`file_${index}`, row.File);
        });
        try {
            const response = await axiosClient.post("updateFiles", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // setIsSubmitting(true)
            const data = response.data.additional_files
            setRows([])

            setRows(data.map((file, index) => ({
                id: index + 1,
                idUpdate: file.id,
                File_Title: file.file_title,
                File_Content: file.file_content,
                File_URL: file.file_path
            })));
            basictoaster("successToast", "Updated successfully !");

        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
        }
    };
    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Files & Certificate</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="6">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label">CV</Label>


                                    <Col sm="9">
                                        <Controller
                                            name="cv"
                                            control={control}
                                            rules={{ required: "CV is required" }}
                                            accept=".zip"
                                            render={({ field }) => (
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const fileName = file.name.toLowerCase();
                                                            if (!fileName.endsWith(".zip")) {
                                                                alert("The file must be a ZIP file.");
                                                                e.target.value = "";
                                                                return;
                                                            }
                                                        }
                                                        if (file && file.size > 5 * 1024 * 1024) {
                                                            alert("The file size must not exceed 5MB.");
                                                            e.target.value = ""
                                                            return;
                                                        }
                                                        handleFileChange(e, setCvFileName);
                                                        field.onChange(e); // Pass the file to react-hook-form
                                                    }}
                                                />
                                            )}
                                        />
                                        <span className="form-text text-muted py-2 m-1">Note: if exceeds 5MB please zip it.
                                            {cvFileNames ? (     <button
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    marginLeft: '10px' 
                                                }}
                                                color="transparent"
                                                onClick={() => handleDownload(cvFileName)}
                                            >
                                                <i style={{ fontSize: '1.6em', marginTop: '3px' }} className="fa fa-cloud-download"></i>
                                            </button>) : (
                                                <></>
                                            )}
                                        </span>
                              
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label">NDA</Label>
                                    <Col sm="9">
                                        <Controller
                                            name="NDA"
                                            control={control}
                                            rules={{ required: "NDA is required" }}
                                            accept=".zip"
                                            render={({ field }) => (
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const fileName = file.name.toLowerCase();
                                                            if (!fileName.endsWith(".zip")) {
                                                                alert("The file must be a ZIP file.");
                                                                e.target.value = ""; 
                                                                return;
                                                            }
                                                        }
                                                        if (file && file.size > 5 * 1024 * 1024) {
                                                            alert("The file size must not exceed 5MB.");
                                                            e.target.value = ""
                                                            return;
                                                        }
                                                        handleFileChange(e, setNdaFileName);
                                                        field.onChange(e); // Pass the file to react-hook-form
                                                    }}
                                                />
                                            )}
                                        />
                                        {/* <Input type="file" onChange={(e) => handleFileChange(e, setNdaFileName)} /> */}
                                        <span className="form-text text-muted py-2 m-1">Note: if exceeds 5MB please zip it.
                                            {ndaFileNames ? (<button
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    marginLeft: '10px'
                                                }}
                                                color="transparent"
                                                onClick={() => handleDownload(ndaFileName)}
                                            >
                                                <i style={{ fontSize: '1.6em', marginTop: '3px' }} className="fa fa-cloud-download"></i>
                                            </button>) : (
                                                <></>
                                            )}

                                        </span>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>File Title</th>
                                    <th>File Content</th>
                                    <th style={{ width: "30%" }}>File</th>
                                    <th style={{ width: "10%" }} onClick={addRow}>
                                        <Btn attrBtn={{ color: 'btn btn-light'}}>
                                            <i className="fa fa-plus-circle"></i>
                                        </Btn>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={row.File_Title}
                                                onChange={(e) => handleInputChange(e, row.id, "File_Title")}
                                                className="form-control"

                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                style={{ height: '35px' }}
                                                className="form-control"
                                                value={row.File_Content}
                                                onChange={(e) => handleInputChange(e, row.id, "File_Content")}

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    if (file.type !== "application/zip") {
                                                        alert("The file must be a ZIP file.");
                                                        e.target.value = "";
                                                        return;
                                                    }

                                                    if (file.size > 5 * 1024 * 1024) {
                                                        alert("The file size must not exceed 5MB.");
                                                        e.target.value = ""; 
                                                        return;
                                                    }
                                                    
                                                    
                                                    handleRowFileChange(e, row.id)
                                                }}
                                                className="form-control"

                                            />
                                            {row.File_URL ? (
                                                <button style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                }}  onClick={() => handleDownload(row.File_URL)}>
                                                    <span >Click to Download the file </span>
                                                </button>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                        <td style={{ width: "10%" }} onClick={() => deleteRow(row.id , row.idUpdate)}>
                                                    
                                            <button  className="btn btn-danger">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Btn attrBtn={{ color: 'primary', onClick: handleClick }}>Submit</Btn>
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default FilesCertificate;
