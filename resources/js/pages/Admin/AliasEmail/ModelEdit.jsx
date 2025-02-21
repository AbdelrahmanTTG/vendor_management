import React, { Fragment, useState, useEffect } from 'react';
import { Btn, Spinner } from '../../../AbstractElements';
import CommonModal from '../../VM/Model';
import { Col, Label, Row, FormGroup } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../pages/AxiosClint";
import { toast } from 'react-toastify';
const Edit = (props) => {
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
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idDepartment, setUserDepartment] = useState([]);
    const [optionsSub, setOptionsSub] = useState([]);
    const [Users, setUsers] = useState([]);

    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const toggle = () => {
        setModal(!modal);
        setTimeout(() => {
            props.handleEditClick(null);
        }, 500);
    }
    useEffect(() => {
        if (props.data) {
            setModal(props.data)
        }
    }, [props.data])
    useEffect(() => {
        if (props?.alias) {
            const statusLabels = {
                1: "Active",
                0: "Inactive",
            };
            setValue("name", props?.alias?.name)
            setValue("email", props?.alias?.email)
            setValue("status", { value: props?.alias?.status, label: statusLabels[props?.alias?.status] || "Unknown" })

        }
        
    }, [props?.alias])



    const onSubmit = async (form) => {
        // console.log(form)
        if (form !== '') {
            try {
                form.status = form?.status?.value ?? "";
                const formData = {
                    ...form,
                    id: props?.alias?.id
                };
                const { data } = await axiosClient.post("updateAlias", formData);
                // console.log(data)
                props.onUpdateData(data?.alias.id, data?.alias)
                toggle()
                basictoaster("successToast", "Alias has been successfully modified.")

            } catch (err) {
                const response = err.response;
                // if (response && response.data) {
                //     setErrorMessage(response.data.message || "An unexpected error occurred.");
                // } else {
                //     setErrorMessage("An unexpected error occurred.");
                // }
                // console.log(err)
                basictoaster("dangerToast", response.data.message)

            }

        } else {
            errors.showMessages();
        }
    }
    return (
        <Fragment>
            <CommonModal onSave={handleSubmit(onSubmit)} marginTop="-10vh" size="lg" isOpen={modal} title={props.titelModel} toggler={toggle} style={{ Width: "600px", height: "80vh" }} >
                <Row className="g-3 mb-3">
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Name alias</Label>
                            <Col sm="8">
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    {...register("name", { required: false })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Email alias</Label>
                            <Col sm="8">
                                <input
                                    defaultValue=""
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    {...register("email", { required: false })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup className="row">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">Status</Label>
                            <Col sm="8">
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={field.value || props?.alias?.status }
                                            options={[{ value: "1", label: "Active" },{ value: "0", label: "Inactive" }]}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            onChange={(option) => {field.onChange(option);}}
                                        />
                                    )}
                                />

                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </CommonModal>
        </Fragment>
    )
};
export default Edit;