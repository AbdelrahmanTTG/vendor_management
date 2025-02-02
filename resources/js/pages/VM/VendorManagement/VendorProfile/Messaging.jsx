import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Col, Input, InputGroup, InputGroupText, Collapse, Table, Label } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosClient from "../../../../pages/AxiosClint";
import { useForm, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2'

const Messaging = (props) => {
    // toast.configure();
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case 'successToast':
                toast.success(status, {
                    position: "top-right"                });
                break;
            case 'dangerToast':
                toast.error(status, {
                    position: "top-right"                });
                break;
            default:
                break;
        }
    };
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const { control, register, handleSubmit, unregister, reset, setValue, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState(null);
    const [optionsN, setOptionsN] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});
    const [selectedOptions, setSelectedOptions] = useState({});
    const [rowIdToDelete, setRowIdToDelete] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [rows, setRows] = useState([]);
    const addRow = () => {
        if (isSubmitting) { return }
        const newRow = {
            id: rows.length + 1,
            type: null,
            inputValue: '',
        };
        setRows([...rows, newRow]);
    };
    const handleInputChange2 = (e, id) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, inputValue: e.target.value } : row
            )
        );
    };
    const deleteRow = useCallback((rowId, idUpdate) => {
        // if (isSubmitting) { return }
        if (idUpdate) {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete that contact ?`,
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
                            `This contact has been deleted..`,
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

    }, []);
    const handleSelectChange = (selectedOption, rowId) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [rowId]: selectedOption,
        }));
    };
    const handleInputChange = (inputValue, tableName, fieldName, setOptions, options) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (!existingOption) {
                setLoading(true);
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };
    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '') => {
        if (!tablename) return
        try {
            setLoading(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name || item.gmt,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions(prev => ({ ...prev, [fieldName]: formattedOptions }));
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
            setLoading(false);
        }

    };
    useEffect(() => {
        if (rowIdToDelete !== null) {
            unregister(`messaging[${rowIdToDelete}]`);
            setRows((prevRows) => prevRows.filter(row => row.id !== rowIdToDelete));
            setRowIdToDelete(null);
        }
    }, [rowIdToDelete]);
    // const handleClick = (data) => {
    //     if (props.onSubmit === 'onSubmit') {
    //         onSubmit(data);
    //     } else if (props.onSubmit === 'onUpdate') {
    //         Update(data)
    //     }
    // };
    // const onSubmit = async (data) => {
    //     if (!props.id) {
    //         basictoaster("dangerToast", "Make sure to send your personal information first.");
    //         const section = document.getElementById("personal-data");
    //         section.scrollIntoView({ behavior: 'smooth' });
    //     } else {
    //         const formData = { ...data };
    //         const result = rows?.map((row, index) => ({
    //             messaging_type_id: formData.messaging[index + 1]?.value,
    //             contact: formData.contact[index + 1],
    //         }));
    //         const newFormData = {
    //             ...formData,
    //             vendor_id: props.id,
    //         };
    //         if (result && result.length > 0) {
    //             newFormData['Instant_Messaging'] = result;
    //         }
    //         delete newFormData.messaging;
    //         delete newFormData.contact;
    //         try {
    //             const response = await axiosClient.post("instantMessaging", newFormData);
    //             basictoaster("successToast", "Added successfully !");
    //             setIsSubmitting(true)
    //         } catch (err) {
    //             const response = err.response;
    //             if (response && response.data) {
    //                 const errors = response.data;
    //                 Object.keys(errors).forEach(key => {
    //                     const messages = errors[key];
    //                     if (messages.length > 0) {
    //                         messages.forEach(message => {
    //                             basictoaster("dangerToast", message);
    //                         });
    //                     }
    //                 });
    //             }
    //             setIsSubmitting(false)
    //         }
    //     }
    // }
    const Update = async (data) => {
        if (props?.mode == "edit" && !props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        if (!props.id) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            const formData = { ...data };
            if (!formData || (typeof formData === 'object' && Object.keys(formData).length === 0) || (Array.isArray(formData) && formData.length === 0)) {
                return;  
            }
            const result = rows?.map((row, index) => ({
                id: row?.idUpdate,
                messaging_type_id: formData.messaging[row.id]?.value,
                contact: formData.contact[row.id],
            }));
            const newFormData = {
                ...formData,
                vendor_id: props.id,
            };
            if (result && result.length > 0) {
                newFormData['Instant_Messaging'] = result;
            }
            delete newFormData.messaging;
            delete newFormData.contact;
            try {
                const response = await axiosClient.post("saveOrUpdateMessages", newFormData);
                basictoaster("successToast", "Updated successfully !");
                setRows([])
                setRows(response?.data?.map((element, index) => {
                    setValue(`contact[${index + 1}]`, element.contact);
                    setValue(`messaging[${index + 1}]`, { value: element.messaging_type?.id, label: element.messaging_type?.name });
                    handleSelectChange({ value: element.messaging_type?.id, label: element.messaging_type?.name }, index + 1)
                    return {
                        id: index + 1,
                        idUpdate: element.id,
                        messaging_type_id: { value: element.messaging_type?.id, label: element.messaging_type?.name },
                        inputValue: element.contact
                    };
                }));
            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    const errors = response.data;
                    Object.keys(errors).forEach(key => {
                        const messages = errors[key];
                        if (messages.length > 0) {
                            messages.forEach(message => {
                                basictoaster("dangerToast", message);
                            });
                        }
                    });
                }
            }
         }
    }
    const onDelete = async (id) => {
        if (!props.backPermissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deleteMessage", { data: payload });
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
    useEffect(() => {
        if (props.mode === "edit") {
            if (props.InstantMessaging) {
                if (props.InstantMessaging.InstantMessaging) {
                    const data = props.InstantMessaging.InstantMessaging;
                   
                    setRows(data.map((element, index) => {
                        setValue(`contact[${index + 1}]`, element.contact);
                        setValue(`messaging[${index + 1}]`, { value: element.messaging_type?.id, label: element.messaging_type?.name });
                        handleSelectChange({ value: element.messaging_type?.id, label: element.messaging_type?.name }, index + 1)
                        return {
                            id: index + 1,
                            idUpdate: element.id,
                            messaging_type_id: { value: element.messaging_type?.id, label: element.messaging_type?.name },
                            inputValue: element.contact
                        };
                    }));
                    
                }
            }
        }
    }, [props.InstantMessaging, setValue]);
    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Instant Messaging</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th scope="col">{'Type'}</th>
                                    <th scope="col">Contact</th>
                                    <th style={{ width: "10%" }} scope="col" onClick={addRow}>
                                        <Btn attrBtn={{ color: 'btn btn-light', disabled: isSubmitting }} >
                                            <i className="fa fa-plus-circle"></i>
                                        </Btn>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>
                                            <Controller
                                                name={`messaging[${row.id}]`}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        isDisabled={isSubmitting}
                                                        value={selectedOptions[row.id] || null}
                                                        options={optionsN}
                                                        onInputChange={(inputValue) =>
                                                            handleInputChange(inputValue, "messaging_types", `messaging_types`, setOptionsN, optionsN)
                                                        }
                                                        isSearchable
                                                        noOptionsMessage={() => loading ? (
                                                            <div className="loader-box">
                                                                <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                            </div>
                                                        ) : 'No options found'}
                                                        onChange={(option) => {
                                                            handleSelectChange(option, row.id);
                                                            field.onChange(option);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </td>
                                        <td>

                                            <input
                                                disabled={isSubmitting}

                                                type="text"
                                                value={row.inputValue}
                                                {...register(`contact[${row.id}]`, { required: true })}
                                                onChange={(e) => handleInputChange2(e, row.id)}
                                                className="form-control"
                                                placeholder="contact"

                                            />


                                        </td>
                                        <td onClick={() => deleteRow(row.id ,row.idUpdate)}>
                                            <Btn attrBtn={{ color: 'btn btn-danger', disabled: isSubmitting }}>
                                                <i className="fa fa-trash"></i>
                                            </Btn>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(Update) }}>Submit</Btn>
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Messaging;