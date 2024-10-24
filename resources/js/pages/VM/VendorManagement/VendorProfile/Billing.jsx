import React, { Fragment, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, FormGroup, Form } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm, Controller } from 'react-hook-form';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';

const Billing = ({ ID }) => {
    toast.configure();
    const [isOpen, setIsOpen] = useState(true);
    const [isChecked, setIsChecked] = useState({ Legal_Name: '', City_state: '', Street: '', Address: "" });
    const [selectedOptionC, setSelectedOptionC] = useState(null);
    const [optionsC, setOptionsC] = useState([]);
    const { control, register, handleSubmit, unregister, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);
    ;
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
    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            setIsChecked(
                {
                    Legal_Name: document.getElementById('Legal_Name').value,
                    City_state: document.getElementById('City_state').value,
                    Street: document.getElementById('Street').value,
                    Address: document.getElementById('address').value,
                }
            )
        } else {
            setIsChecked({
                Legal_Name: '',
                City_state: "",
                Street: '',
                Address: '',
            })

        }


    };
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [rows, setRows] = useState([]);
    const options = [
        { value: '4', label: '-- Other --' },
    ];
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            type: null,
            inputValue: '',
        };
        setRows([...rows, newRow]);
    };
    const handleSelectChange = (selectedOption, rowId) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                return { ...row, type: selectedOption };
            }
            return row;
        });
        setRows(updatedRows);
    };
    const handleInputChange = (event, rowId) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                return { ...row, inputValue: event.target.value };
            }
            return row;
        });
        setRows(updatedRows);
    };
    const deleteRow = (rowId) => {
        if (window.confirm("Are you sure you want to delete this row?")) {
            setRows((prevRows) => {
                const updatedRows = prevRows.filter(row => row.id !== rowId);
                unregister(`method[${rowId - 1}]`);
                unregister(`account[${rowId - 1}]`);
                return updatedRows;
            });
        }
    };

    const handleInputChangeSelect = (inputValue, tableName, fieldName, setOptions, options) => {
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
            console.log(err)
            // const response = err.response;
            // if (response && response.status === 422) {
            //     setErrorMessage(response.data.errors);
            // } else if (response && response.status === 401) {
            //     setErrorMessage(response.data.message);
            // } else {
            //     setErrorMessage("An unexpected error occurred.");
            // }
        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        handelingSelect("currency", setOptionsC, "Currency");



    }, []);

    const onSubmit = async (data) => {
        if (!ID) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {

            const formData = { ...data };
            const result = rows.map((row, index) => ({
                method: formData.method[index]?.value,
                account: formData.account[index],
            }));
            const newFormData = {
                ...formData,
                'Wallets Payment methods': result,
                vendor_id: ID,
            };
            delete newFormData.method;
            delete newFormData.account;
            try {
                const response = await axiosClient.post("storeBilling", newFormData);
                basictoaster("successToast", "Added successfully !");
                setIsSubmitting(true)

            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    const errors = response.data;
                    Object.keys(errors).forEach(key => {
                        const messages = errors[key];
                        messages.forEach(message => {
                            basictoaster("dangerToast", message);
                        });
                    });
                }
                setIsSubmitting(false)
            }


        }
    }
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "billing_legal_name":
                    basictoaster("dangerToast", "Billing Legal name is required");
                    return;
                case "city":
                    basictoaster("dangerToast", "Billing city or state is required");
                    return;
                case "billing_address":
                    basictoaster("dangerToast", "Billing address is required");
                    return;
                case "street":
                    basictoaster("dangerToast", "Billing street is required");
                    return;
                case "billing_currency":
                    basictoaster("dangerToast", "Billing Currency is required");
                    return;
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

    }
    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Billing Data</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Form>
                            <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                                <Col className="d-flex align-items-center mb-3">
                                    <Label className="col-form-label m-0" style={{ lineHeight: '1.5', paddingRight: '10px' }}>
                                        Use Same Vendo Data :
                                    </Label>
                                    <Input className="radio_animated " id="edo-ani" type="checkbox" onChange={handleCheckboxChange} name="rdo-ani" />
                                </Col>
                                <Row>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Legal Name</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue={isChecked.Legal_Name}
                                                    className="form-control"
                                                    type="text"
                                                    name="billing_legal_name"
                                                    {...register("billing_legal_name", { required: true })}
                                                    placeholder="Legal Name"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Currency</Label>
                                            <Col sm="9">
                                                <Controller
                                                    name="billing_currency"
                                                    control={control}
                                                    isDisabled={isSubmitting}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            value={selectedOptionC}
                                                            options={optionsC}
                                                            onInputChange={(inputValue) =>
                                                                handleInputChangeSelect(inputValue, "currency", "Currency", setOptionsC, optionsC)
                                                            }
                                                            className="js-example-basic-single col-sm-12"
                                                            isSearchable
                                                            noOptionsMessage={() => loading ? (
                                                                <div className="loader-box">
                                                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                                </div>
                                                            ) : 'No options found'}
                                                            onChange={(option) => {
                                                                setSelectedOptionC(option);
                                                                field.onChange(option.value);
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">City / state</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue={isChecked.City_state}
                                                    className="form-control"
                                                    type="text"
                                                    name="city"
                                                    {...register("city", { required: true })}
                                                    placeholder="City / state"
                                                />
                                                {/* <Input className="form-control" defaultValue={isChecked.City_state} type="text" /> */}
                                            </Col> </FormGroup> </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Street</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue={isChecked.Street}
                                                    className="form-control"
                                                    type="text"
                                                    name="Street"
                                                    {...register("street", { required: true })}
                                                    placeholder="Street"
                                                />
                                                {/* <Input className="form-control" defaultValue={isChecked.Street} type="text" /> */}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Billing Address</Label>
                                            <Col sm="9">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={isChecked.Address}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setValue('billing_address', data);
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                                <input
                                                    type="hidden"
                                                    {...register('billing_address', { required: true })}
                                                />

                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                            </div>
                            <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                                <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">Bank details</Label>
                                <Row>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">
                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Bank name</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue=""
                                                    className="form-control"
                                                    type="text"
                                                    name="Bank_name"
                                                    {...register("bank_name", { required: true })}
                                                    placeholder="Bank name"
                                                />
                                            </Col></FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Account holder</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue=""
                                                    className="form-control"
                                                    type="text"
                                                    name="account_holder"
                                                    {...register("account_holder", { required: true })}
                                                    placeholder="Account holder"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">SWIFT / BIC</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue=""
                                                    className="form-control"
                                                    type="text"
                                                    name="swift_bic"
                                                    {...register("swift_bic", {
                                                        required: "required",
                                                        validate: value => {
                                                            const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
                                                            return swiftRegex.test(value) || "SWIFT/BIC is invalid";
                                                        }
                                                    })}
                                                    placeholder="SWIFT / BIC"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">IBAN</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue=""
                                                    className="form-control"
                                                    type="text"
                                                    name="iban"
                                                    {...register("iban", {
                                                        required: "required",
                                                        validate: value => {
                                                            const cleanValue = value.replace(/\s+/g, '');
                                                            const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
                                                            return ibanRegex.test(cleanValue) || "IBAN is invalid";
                                                        }
                                                    })} placeholder="IBAN"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">
                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Payment terms</Label>
                                            <Col sm="9">
                                                <input
                                                    disabled={isSubmitting}
                                                    defaultValue=""
                                                    className="form-control"
                                                    type="text"
                                                    name="payment_terms"
                                                    {...register("payment_terms", { required: true })}
                                                    placeholder="Payment terms"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" className="mb-3">
                                        <FormGroup className="row">

                                            <Label className="col-sm-3 col-form-label" for="validationCustom01">Bank Address</Label>
                                            <Col sm="9">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setValue('bank_address', data);
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                                <input
                                                    type="hidden"
                                                    {...register('bank_address', { required: true })}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="border border-default p-3 mb-3 " style={{ borderStyle: "dashed!important" }}>
                                <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">Wallets Payment methods</Label>
                                <Table hover>

                                    <thead>
                                        <tr>
                                            <th scope="col">{'#'}</th>
                                            <th scope="col">{'Method'}</th>
                                            <th scope="col">Account</th>
                                            <th disabled={isSubmitting} style={{ width: "10%" }} scope="col"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    addRow()
                                                }} >
                                                <Btn attrBtn={{ color: 'btn btn-light' }} >
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
                                                    <Controller
                                                        isDisabled={isSubmitting}
                                                        name={`method[${row.id - 1}]`}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                options={options}
                                                                className="js-example-basic-single col-sm-12"
                                                                onChange={(selectedOption) => {
                                                                    field.onChange(selectedOption);
                                                                    handleSelectChange(selectedOption, row.id);
                                                                }}
                                                                value={field.value}
                                                            />
                                                        )}
                                                    />

                                                </td>
                                                <td>

                                                    <input
                                                        disabled={isSubmitting}

                                                        type="text"
                                                        value={row.inputValue}
                                                        {...register(`account[${row.id - 1}]`, { required: true })}
                                                        onChange={(e) => handleInputChange(e, row.id)}
                                                        className="form-control"
                                                        placeholder="Account"

                                                    />
                                                </td>
                                                <td disabled={isSubmitting} onClick={(event) => {
                                                    event.preventDefault();
                                                    deleteRow(row.id)
                                                }}  >                                                    <Btn attrBtn={{ color: 'btn btn-danger' }}>
                                                        <i className="fa fa-trash"></i>
                                                    </Btn>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Btn disabled={isSubmitting} attrBtn={{ color: 'primary', onClick: handleSubmit(onSubmit, onError) }}>Submit</Btn>
                            </div>
                            {/* <button onClick={() => ref.current.submit()}>Trigger Form Submit</button> */}

                        </Form>
                    </CardBody>
                </Collapse>
            </Card>

        </Fragment>
    );
};

export default Billing;