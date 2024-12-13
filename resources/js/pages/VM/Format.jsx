import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import CommonModal from './Model';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import axiosClient from "../AxiosClint";
import SweetAlert from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Format = (props) => {
    const [modal, setModal] = useState(false);
    const [formats, setFormats] = useState(false);
    const [edit, setEdit] = useState();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedOptions = Array.from(selectedOptions);
        const [removed] = reorderedOptions.splice(result.source.index, 1);
        reorderedOptions.splice(result.destination.index, 0, removed);

        setSelectedOptions(reorderedOptions);
    };

    const toggle = () => setModal(!modal);
    const onSubmit = async (formData) => {

        const result = selectedOptions?.map(item => item.value).join(',');
        formData.format = result;
        formData.table = props.table;
        // console.log(result)
        if (edit) {
            formData.id = edit.id
            try {
                const { data } = await axiosClient.post("updateFormat", formData);
                // console.log(data)
                if (data.status) {props.FormatsChanged() }
                setFormats(prevFormats => {
                    const updatedFormats = prevFormats.map(format =>
                        format.id === data?.id ? data : format
                    );
                    if (!updatedFormats.some(format => format.id === data?.id)) {
                        updatedFormats.push(data);
                    }
                    return updatedFormats;
                });
                toggle()
                reset()
            } catch (err) {
                console.error(err);
            }
        } else {
            
        try {
            const { data } = await axiosClient.post("AddFormate", formData);
            setFormats(prevFormats =>
                Array.isArray(prevFormats) && data?.data ? [...prevFormats, data?.data] : prevFormats
            );
            toggle()
            reset()
        } catch (err) {
            console.error(err);
            }
        }

    }
    const editFormat = (item) => {
        if (item) {
            toggle()
            setEdit(item) 
            setValue("name", item.name)
            setValue("format", item.format);
            setSelectedOptions(item.format)
        }
    }
    useEffect(() => {
        if (!modal) {
            setEdit(null)
            reset({ name: '', format: [] });
            setSelectedOptions([])
        }
    }, [modal])
    useEffect(() => {
        setFormats(props.formats)
    }, [props.formats])
    const change = async (dataChange) => {
        try {
            const { data } = await axiosClient.post("changeFormat", dataChange);
            props.FormatsChanged()

        } catch (err) {
            console.error(err);
        }
    }
    const deleteFormat = async (item) => {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete Format ${item.name}  ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(item);
                    if (success) {
                        SweetAlert.fire(
                            'Deleted!',
                            `This Format has been deleted..`,
                            'success'
                        );
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
    }
    const onDelete = async (item) => {
      
        try {
            const payload = {
                id: item.id,
            }
            const { data } = await axiosClient.delete("deleteFormat", { data: payload });
            if (item.status) { props.FormatsChanged() }
            setFormats(prevFormats =>
                Array.isArray(prevFormats) && item ?
                    prevFormats.filter(format => format.id !== item.id) : prevFormats
            );

            return data
        } catch (err) {
            const response = err.response;
            return false
        }
    }
    const customStyles = {
        groupHeading: (provided) => ({
            ...provided,
            textAlign: "center",
            fontSize: "13px",
            fontWeight: "bold",
            color: "black",
            margin: "5px 0",
        }),
    };
    return (
        <Fragment>
            <UncontrolledDropdown>
                <DropdownToggle color="light">
                    {'Format table ▼'}
                </DropdownToggle>
                <DropdownMenu direction="down" className="p-3" >
                    {Array.isArray(formats) && formats.length > 0 ? (
                        <>
                            <div className="radio radio-primary mb-2 d-flex align-items-center">
                                <Input
                                    id="radioDefault"
                                    type="radio"
                                    name="radio1"
                                    value="Default format"
                                    defaultChecked={!formats.some(format => format.status)}
                                    onClick={() => change({ table: props.table })}
                                />
                                <Label for="radioDefault" className="ms-2 flex-grow-1">
                                    <span className="digits">Default</span>
                                </Label>
                            </div>
                            {formats.map((format, formatsIndex) => (
                                <div key={formatsIndex}>
                                    <div className="radio radio-primary mb-2 d-flex align-items-center" >
                                        <Input
                                            id={`radio${formatsIndex}`}
                                            type="radio"
                                            name="radio1"
                                            value={format.name}
                                            defaultChecked={format.status}
                                            onClick={() => change(format)}
                                        />
                                        <Label for={`radio${formatsIndex}`} className="ms-2 flex-grow-1">
                                            <span className="digits">{format.name}</span>
                                        </Label>
                                        <div className="d-flex">
                                            <button
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    padding: 0,
                                                    marginLeft: '20px',
                                                    marginRight: '20px',

                                                }}
                                                onClick={() => editFormat(format)}
                                            >
                                                <i
                                                    className="icofont icofont-ui-edit"
                                                    style={{ fontSize: '18px', color: '#ffc107' }}
                                                ></i>
                                            </button>
                                            <button
                                                style={{
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    padding: 0,
                                                    marginLeft: '20px',
                                                    marginRight: '20px',
                                                }}
                                                onClick={() => deleteFormat(format)}
                                            >
                                                <i
                                                    className="icofont icofont-ui-delete"
                                                    style={{ fontSize: '18px', color: '#dc3545' }}
                                                ></i>
                                            </button>
                                        </div>

                                    </div>
                                    <DropdownItem divider />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="radio radio-primary mb-2 d-flex align-items-center">
                            <Input
                                id="radioDefault"
                                type="radio"
                                name="radio1"
                                value="Default format"
                                defaultChecked={true}
                            />
                            <Label for="radioDefault" className="ms-2 flex-grow-1">
                                <span className="digits">Default</span>
                            </Label>
                        </div>
                    )}
                    {/* <DropdownItem divider /> */}
                    <DropdownItem onClick={toggle} className="d-flex justify-content-center align-items-center">
                        <i className="fa fa-plus-square" style={{ fontSize: '20px' }}></i>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>



            < CommonModal isOpen={modal} title={edit ? `Edit format ( ${edit.name} )`:props.title}  toggler={toggle} onSave={handleSubmit(onSubmit)}  >
                <Col md="12"  >
                    <FormGroup className="row" >

                        <Label className="col-sm-3 col-form-label" for="validationCustom01" > Name Format </Label>
                        < Col sm="9" >
                            <input
                                defaultValue=""
                                className="form-control"
                                type="text"
                                name="name"
                                {...register("name", { required: true })}
                                placeholder="name"
                            />
                        </Col>
                    </FormGroup>
                </Col>
                <Col md="12"  >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" >Columns</Label>
                        < Col sm="9" >
                             
                                    <Controller
                                        name="format"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                styles={customStyles} 
                                                {...field}
                                                options={props.Columns} 
                                                value={selectedOptions} 
                                                isMulti
                                                onChange={(selected) => {
                                                    setSelectedOptions(selected); 
                                                    field.onChange(selected); 
                                                }}
                                                placeholder="Select columns"
                                            />
                                        )}
                                    />
                        </Col>
                      
                    </FormGroup>
                </Col>
                <div
                    className="border border-default p-3 mb-3"
                    style={{
                        borderStyle: "dashed!important",
                        maxHeight: '20vh',  
                        overflowY: 'auto',   
                    }}
                >
                    {selectedOptions.length > 0 && (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="selected-options">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {selectedOptions.map((option, index) => (
                                            <Draggable key={option.value} draggableId={option.value} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            padding: '8px',
                                                            margin: '4px 0',
                                                            background: '#f9f9f9',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        {option.label}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>

            </CommonModal>
        </Fragment>
    )
}
export default Format