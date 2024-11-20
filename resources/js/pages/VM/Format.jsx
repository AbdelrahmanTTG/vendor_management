import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import CommonModal from './Model';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import axiosClient from "../AxiosClint";

const Format = (props) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const onSubmit = async (formData) => { 
        const result = formData.format.map(item => item.value).join(',');
        formData.format = result;
        formData.table = props.table;
        try {
            const { data } = await axiosClient.post("AddFormate", formData);
            console.log(data)
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <Fragment>
            <UncontrolledDropdown>
                <DropdownToggle color='light'>
                    {'Format table ▼'}
                </DropdownToggle>
                <DropdownMenu className="p-3">
                    {/* <div className="radio radio-primary mb-2">
                                            <Input id="radio1" type="radio" name="radio1" value="option1" defaultChecked />
                                            <Label for="radio1">
                                                {"Option"}<span className="digits">{" 1"}</span>
                                            </Label>
                                        </div>
                                        <div className="radio radio-primary mb-2">
                                            <Input id="radio3" type="radio" name="radio1" value="option1" disabled />
                                            <Label for="radio3">{"Disabled"}</Label>
                                        </div>
                                        <div className="radio radio-primary mb-2">
                                            <Input id="radio4" type="radio" name="radio1" value="option1" />
                                            <Label for="radio4">{"Checked"}</Label>
                                        </div> */}
                    <DropdownItem divider />
                    <DropdownItem onClick={toggle} className="d-flex justify-content-center align-items-center">
                        <i className="fa fa-plus-square" style={{ fontSize: '20px' }}></i>
                    </DropdownItem>
                </DropdownMenu>

            </UncontrolledDropdown>
            < CommonModal isOpen={modal} title={props.title} toggler={toggle} onSave={handleSubmit(onSubmit)}  >
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
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        id='Columns'
                                        {...field}
                                        value={field.value}
                                        options={props.Columns}
                                        className="js-example-basic-single col-sm-12"
                                        onChange={(option) => {
                                            field.onChange(option);
                                        }}
                                        isMulti
                                    />
                                )}
                            />

                        </Col>
                    </FormGroup>
                </Col>
            </CommonModal>
        </Fragment>
    )
}
export default Format