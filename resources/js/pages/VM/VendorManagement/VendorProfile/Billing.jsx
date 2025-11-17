import React, { Fragment, useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table, FormGroup, Form  } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm, Controller, set } from 'react-hook-form';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2';

const Billing = (props) => {
    // toast.configure();
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState({ billing_legal_name: '', city: '', street: '', billing_address: "" });
    const [selectedOptionC, setSelectedOptionC] = useState(null);
    const [optionsC, setOptionsC] = useState([]);
    const [selectedOptionM, setSelectedOptionM] = useState([]);
    const [optionsM, setOptionsM] = useState([]);
    const { control, register, handleSubmit, unregister, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [initialOptions, setInitialOptions] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rows, setRows] = useState([]);
    const [hasWalletMethods, setHasWalletMethods] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [BillingData_id, setBillingData_id] = useState("");
    const [BankData_id, setBankData_id] = useState("");
    const [dataB, setdataB] = useState();
    const [add, setAdd] = useState(false);
    const [Sub, setSub] = useState(false);



    useEffect(() => {
        // if(props.mode == "edit"){return}
        if (rows.length > 0) {
            setHasWalletMethods(true)
        } else {
            setHasWalletMethods(false)
        }
    }, [rows]);
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
    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;

        const values = isChecked
            ? {
                billing_legal_name: document.getElementById('Legal_Name').value,
                city: document.getElementById('City_state').value,
                street: document.getElementById('Street').value,
                billing_address: document.getElementById('address').value,
            }
            : {
                billing_legal_name: '',
                city: '',
                street: '',
                billing_address: '',
            };

        setIsChecked(values);

        setValue("billing_legal_name", values.billing_legal_name);
        setValue("city", values.city);
        setValue("street", values.street);
        setValue("billing_address", values.billing_address);
    };

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
  
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            default: 0,
            type: null,
            inputValue: '',
        };
        setRows([...rows, newRow]);
    };
    const editRow = (id, selec, input, def) => {
        setRows(prevRows => [
            ...prevRows,
            {
                id: id,
                idUpdate: id,
                default: def,
                type: selec,
                inputValue: input,
            },
        ]);
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
    const [rowIdToDelete, setRowIdToDelete] = useState(null)

    const deleteRow = useCallback((rowId, idUpdate , d) => {
        // console.log(selectedDefaults)
        // delete selectedDefaults[rowId];
        // console.log(d[rowId])
        if (d[rowId] == 1) {
            basictoaster("dangerToast", "Its default values ​​should not be deleted before setting others.");
            return
        }
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
                        delete d[rowId]
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
    const onDelete = async (id) => {
        if (!props.backPermissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deleteWallet", { data: payload });
            


            return data
        } catch (err) {
            basictoaster("dangerToast", "Cannot delete before default wallet is selected .");

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
        if (rowIdToDelete !== null) {
            unregister(`method[${rowIdToDelete}]`);
            unregister(`account[${rowIdToDelete}]`);
            unregister(`defaults[${rowIdToDelete}]`);

            setRows((prevRows) => prevRows.filter(row => row.id !== rowIdToDelete));
            setRowIdToDelete(null);
        }
    }, [rowIdToDelete]);


    const handleClick = (data) => {
        if (props.onSubmit === 'onSubmit' && !isSubmitting) {
            onSubmit(data);
        } else if (props.onSubmit === 'onUpdate' || isSubmitting) {
            Update(data)
        }
    };

    const handleInputChangeSelect = (inputValue, tableName, fieldName, setOptions, options, rowId) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            if (Array.isArray(options)) {
                const existingOption = options.some(option =>
                    option?.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                if (!existingOption) {
                    setLoading2(true);
                    handelingSelect(tableName, setOptions, fieldName, inputValue, rowId);
                }
            }
        }
    };

    const handelingSelect = async (tablename, setOptions, fieldName, searchTerm = '', rowId) => {
        if (!tablename) return
        try {
            setLoading2(true);
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename
                }
            });
            const formattedOptions = data.map(item => ({
                value: item.id,
                label: item.name,
            }));
            if (rowId) {
                setOptions(prev => ({ ...prev, [rowId]: formattedOptions }));
            } else {
                setOptions(formattedOptions);
            }
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
            setLoading2(false);
        }

    };
    useEffect(() => {
        handelingSelect("currency", setOptionsC, "Currency");
    }, []);
    useEffect(() => {
        if (props?.Cru) {
            // console.log(props?.Cru)
        }
    }, [props?.Cru]);
    useEffect(() => {
        if (props.Bill) {
            setIsSubmitting(true)
        }
        if (props.mode === "edit" || props.Bill) {
            setLoading(true);
            // console.log(props?.countryAndNationality)
            if (props.BillingData || props.Bill) {
                if (props.BillingData?.BillingData || props.Bill) {
                    // if (!dataB) { setdataB(props.BillingData.BillingData) }

                    const data = props?.BillingData?.BillingData || props.Bill;

                    if (data?.billingData) {
                        setAdd(false)
                        setBillingData_id(data.billingData.id)
                        setValue("billing_legal_name", data.billingData.billing_legal_name)
                        setValue("city", data.billingData.city)
                        setValue("city", data.billingData.city)
                        const billing_currency = data.billingData.billing_currency ? {
                            value: data.billingData.billing_currency.id,
                            label: data.billingData.billing_currency.name
                        } : null;
                        setSelectedOptionC(billing_currency);
                        // props.Currancy(billing_currency)
                        setValue("billing_currency", billing_currency?.value);
                        setValue("street", data.billingData.street)
                        setValue("billing_address", data.billingData?.billing_address)
                        setValue(
                            "bank_required",
                            data.billingData?.bank_required
                        );
                        setValue("wallet_required", data.billingData?.wallet_required);
                        if (data.billingData?.billing_status !== null && data.billingData?.billing_status !== undefined) {
                            const vendorTypeOption = {
                                value: "",
                                // value: props.permission?.status !== "disable"? data.billingData.status:null,
                                label:
                                    data.billingData.billing_status == 0 ? "Inactive" :
                                        data.billingData.billing_status == 1 ? "Active" :
                                            data.billingData.billing_status == 2 ? "Pending" :
                                                "Unknown"
                            };
                            setValue("billing_status", vendorTypeOption);
                        }

                    }
                    if (data?.bankData) {
                        setBankData_id(data.bankData.id)
                        setValue("bank_name", data.bankData.bank_name)
                        setValue("account_holder", data.bankData.account_holder)
                        setValue("swift_bic", data.bankData.swift_bic)
                        setValue("iban", data.bankData.iban)
                        setValue("payment_terms", data.bankData.payment_terms)
                        setValue("bank_address", data.bankData.bank_address)
                    }
                    if (data?.walletData) {
                        setRows([])
                        data.walletData.forEach(element => {

                            editRow(element.id, { value: element.method.id, label: element.method.name }, element.account)
                            setValue(`method[${element.id}]`, { value: element.method.id, label: element.method.name })
                            setValue(`defaults[${element.id}]`, element.defaults)
                            const x = {
                                [element.id]: element.defaults
                            };
                            

                            setSelectedDefaults(prevSelectedDefaults => ({
                                ...prevSelectedDefaults,
                                ...x
                            }));
                            setSelectedOptionM(prev => ({ ...prev, [element.id]: { value: element.method.id, label: element.method.name } }));
                        });

                    }
                    setLoading(false);
                } else {
                    setAdd(true)
                }

            }

        }

    }, [props.BillingData, setValue, dataB])

    const onSubmit = async (data) => {
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        const containsOne = Object.values(selectedDefaults).includes(1);
        if (!containsOne) {
            basictoaster("dangerToast", " The default wallet must be selected.");
            return;

        } 
        if (!props.id) {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            setSub(true);
            const formData = { ...data };
            const result = rows?.map((row, index) => ({
                defaults: selectedDefaults[row.id],
                method: formData.method[row.id]?.value ? formData.method[row.id]?.value : formData.method[row.id],
                account: formData.account[row.id],
            }));
            const newFormData = {
                ...formData,
                vendor_id: props.id,
            };
            if (result && result.length > 0) {
                newFormData['Wallets Payment methods'] = result;
            }
            delete newFormData.method;
            delete newFormData.account;
            delete newFormData.defaults;
            newFormData.bank_required
                ? (newFormData.bank_required = 1)
                : (newFormData.bank_required = 0);
            newFormData.wallet_required
                ? (newFormData.wallet_required = 1)
                : (newFormData.wallet_required = 0);
            try {
                const response = await axiosClient.post("storeBilling", newFormData);
                // setdataB(response.data)
                basictoaster("successToast", "Added successfully !");
                setIsSubmitting(true)
                props.Currancy(response.data, selectedOptionC)
            } catch (err) {
                const response = err.response;
                if (response && response.data) {
                    const errors = response.data;
                    Object.keys(errors).forEach(key => {
                        const messages = errors[key];
                        if (Array.isArray(messages) && messages.length > 0) {
                            messages.forEach(message => {
                                basictoaster("dangerToast", message);
                            });
                        } else {
                            basictoaster("dangerToast", "Something went wrong. This cannot be added.");
                        }
                    });

                }
                setIsSubmitting(false)
            }finally {
                setSub(false);
            }


        }
    }
    const Update = async (data) => {
        if (!props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        const containsOne = Object.values(selectedDefaults).includes(1);
        if (!containsOne) {
            basictoaster("dangerToast", " The default wallet must be selected.");
            return;

        } 
        // console.log(selectedDefaults)
        const formData = { ...data };
        const result = rows?.map((row, index) => ({
            id: row.idUpdate,
            defaults: selectedDefaults[row.id] == 1 ? 1:0,
            method: formData.method[row.id]?.value ? formData.method[row.id]?.value : formData.method[row.id],
            account: formData.account[row.id],
        }));
        formData.billing_status = formData?.billing_status?.value
        const newFormData = {
            ...formData,
        };
        if (result && result.length > 0) {
            newFormData['Wallets Payment methods'] = result;
        }
        newFormData['BillingData_id'] = BillingData_id;
        newFormData['BankData_id'] = BankData_id;
        newFormData['vendor_id'] = props.id;
        newFormData['VendorSide'] =  props?.VendorSide ? true: false;
        delete newFormData.method;
        delete newFormData.account;
        delete newFormData.defaults;
        newFormData.bank_required ? newFormData.bank_required = 1 : newFormData.bank_required = 0;
        newFormData.wallet_required
            ? (newFormData.wallet_required = 1)
            : (newFormData.wallet_required = 0);

        try {
            const response = await axiosClient.post("UpdateBillingData", newFormData);
            setIsSubmitting(true)
            basictoaster("successToast", "Updated successfully !");
            props.Currancy(response.data, selectedOptionC)
           

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
            setIsSubmitting(false)
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
  
    const [selectedDefaults, setSelectedDefaults] = useState({});

    const handleRadioChange = (event) => {
        const newSelectedDefaults = { ...selectedDefaults };
        Object.keys(newSelectedDefaults).forEach((key) => {
            newSelectedDefaults[key] = 0; 
        });
        newSelectedDefaults[event.target.value] = 1; 
        setSelectedDefaults(newSelectedDefaults) 

        // console.log(newSelectedDefaults);
    };
    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>Billing Data</H5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Form>
                            {loading ? (
                                <div className="loader-box">
                                    <Spinner
                                        attrSpinner={{ className: "loader-6" }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div
                                        className="border border-default p-3 mb-3 "
                                        style={{
                                            borderStyle: "dashed!important",
                                        }}
                                    >
                                        {props.mode !== "edit" && (
                                            <Col className="d-flex align-items-center mb-3">
                                                <Label
                                                    className="col-form-label m-0"
                                                    style={{
                                                        lineHeight: "1.5",
                                                        paddingRight: "10px",
                                                    }}
                                                >
                                                    Use Same Vendor Data :
                                                </Label>
                                                <Input
                                                    className="radio_animated"
                                                    id="edo-ani"
                                                    type="checkbox"
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                    name="rdo-ani"
                                                />
                                            </Col>
                                        )}

                                        <Row>
                                            <Col md="6" className="mb-3">
                                                <FormGroup className="row">
                                                    <Label
                                                        className="col-sm-3 col-form-label"
                                                        for="validationCustom01"
                                                    >
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>{" "}
                                                        Billing Legal Name
                                                    </Label>
                                                    <Col sm="9">
                                                        <input
                                                            defaultValue={
                                                                isChecked.billing_legal_name
                                                            }
                                                            className="form-control"
                                                            type="text"
                                                            name="billing_legal_name"
                                                            {...register(
                                                                "billing_legal_name",
                                                                {
                                                                    required: true,
                                                                }
                                                            )}
                                                            placeholder="Legal Name"
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
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>{" "}
                                                        Billing Currency
                                                    </Label>
                                                    <Col sm="9">
                                                        <Controller
                                                            name="billing_currency"
                                                            control={control}
                                                            rules={{
                                                                required: true,
                                                            }}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Select
                                                                    {...field}
                                                                    value={
                                                                        selectedOptionC
                                                                    }
                                                                    options={
                                                                        optionsC
                                                                    }
                                                                    onInputChange={(
                                                                        inputValue
                                                                    ) =>
                                                                        handleInputChangeSelect(
                                                                            inputValue,
                                                                            "currency",
                                                                            "Currency",
                                                                            setOptionsC,
                                                                            optionsC
                                                                        )
                                                                    }
                                                                    className="js-example-basic-single col-sm-12"
                                                                    isSearchable
                                                                    noOptionsMessage={() =>
                                                                        loading2 ? (
                                                                            <div className="loader-box">
                                                                                <Spinner
                                                                                    attrSpinner={{
                                                                                        className:
                                                                                            "loader-6",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            "No options found"
                                                                        )
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        setSelectedOptionC(
                                                                            option
                                                                        );
                                                                        field.onChange(
                                                                            option.value
                                                                        );
                                                                    }}
                                                                />
                                                            )}
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
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>{" "}
                                                        City / state
                                                    </Label>
                                                    <Col sm="9">
                                                        <input
                                                            defaultValue={
                                                                isChecked.city
                                                            }
                                                            className="form-control"
                                                            type="text"
                                                            name="city"
                                                            {...register(
                                                                "city",
                                                                {
                                                                    required: true,
                                                                }
                                                            )}
                                                            placeholder="City / state"
                                                        />
                                                    </Col>{" "}
                                                </FormGroup>{" "}
                                            </Col>
                                            <Col md="6" className="mb-3">
                                                <FormGroup className="row">
                                                    <Label
                                                        className="col-sm-3 col-form-label"
                                                        for="validationCustom01"
                                                    >
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>{" "}
                                                        Street
                                                    </Label>
                                                    <Col sm="9">
                                                        <input
                                                            defaultValue={
                                                                isChecked.street
                                                            }
                                                            className="form-control"
                                                            type="text"
                                                            name="Street"
                                                            {...register(
                                                                "street",
                                                                {
                                                                    required: true,
                                                                }
                                                            )}
                                                            placeholder="Street"
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
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>{" "}
                                                        Billing Address
                                                    </Label>
                                                    <Col sm="9">
                                                        <CKEditor
                                                            editor={
                                                                ClassicEditor
                                                            }
                                                            data={
                                                                isChecked.billing_address ||
                                                                props
                                                                    .BillingData
                                                                    ?.BillingData
                                                                    ?.billingData
                                                                    ?.billing_address ||
                                                                props.Bill
                                                                    ?.billingData
                                                                    .billing_address ||
                                                                ""
                                                            }
                                                            onChange={(
                                                                event,
                                                                editor
                                                            ) => {
                                                                const data =
                                                                    editor.getData();
                                                                setValue(
                                                                    "billing_address",
                                                                    data
                                                                );
                                                            }}
                                                        />
                                                        <input
                                                            hidden
                                                            {...register(
                                                                "billing_address",
                                                                {
                                                                    required: true,
                                                                }
                                                            )}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            {props.backPermissions.edit == 1 &&
                                                props?.permission
                                                    ?.billing_status !=
                                                    "hide" && (
                                                    <Col
                                                        md="6"
                                                        id="status-wrapper"
                                                    >
                                                        <FormGroup className="row">
                                                            <Label
                                                                className="col-sm-3 col-form-label"
                                                                for="validationCustom01"
                                                            >
                                                                {" "}
                                                                Status{" "}
                                                            </Label>
                                                            <Col sm="9">
                                                                <Controller
                                                                    name="billing_status"
                                                                    control={
                                                                        control
                                                                    }
                                                                    rules={{
                                                                        required: false,
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Select
                                                                            id="status"
                                                                            {...field}
                                                                            value={
                                                                                field.value
                                                                            }
                                                                            options={[
                                                                                {
                                                                                    value: "1",
                                                                                    label: "Active",
                                                                                },
                                                                                {
                                                                                    value: "0",
                                                                                    label: "Inactive",
                                                                                },
                                                                                {
                                                                                    value: "2",
                                                                                    label: "Pending",
                                                                                },
                                                                            ]}
                                                                            className="js-example-basic-single col-sm-12"
                                                                            onChange={(
                                                                                option
                                                                            ) => {
                                                                                field.onChange(
                                                                                    option
                                                                                );
                                                                            }}
                                                                            isDisabled={
                                                                                (props.permission &&
                                                                                    props
                                                                                        .permission
                                                                                        .billing_status ===
                                                                                        "disable") ||
                                                                                add
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                            <Col md="6" className="mb-3">
                                                <FormGroup className="row">
                                                    <Label
                                                        className="col-sm-3 col-form-label"
                                                        for="validationCustom01"
                                                    >
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                        Country
                                                    </Label>
                                                    <Col sm="9">
                                                        <Select
                                                            isDisabled={true}
                                                            value={
                                                                props
                                                                    ?.countryAndNationality
                                                                    ?.country
                                                                    ?.name
                                                                    ? {
                                                                          label: props
                                                                              .countryAndNationality
                                                                              .country
                                                                              .name,
                                                                      }
                                                                    : null
                                                            }
                                                            className="js-example-basic-single col-sm-12"
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
                                                        {" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                                fontSize:
                                                                    "18px",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                        Nationality
                                                    </Label>
                                                    <Col sm="9">
                                                        <Select
                                                            isDisabled={true}
                                                            value={
                                                                props
                                                                    ?.countryAndNationality
                                                                    ?.nationality
                                                                    ?.name
                                                                    ? {
                                                                          label: props
                                                                              .countryAndNationality
                                                                              .nationality
                                                                              .name,
                                                                      }
                                                                    : null
                                                            }
                                                            className="js-example-basic-single col-sm-12"
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            {props.backPermissions.edit == 1 &&
                                                props?.permission
                                                    ?.bank_required !=
                                                    "hide" && (
                                                    <Col
                                                        md="6"
                                                        className="mb-3"
                                                    >
                                                        <FormGroup className="row">
                                                            <Label
                                                                className="col-sm-6 col-form-label"
                                                                for="validationCustom01"
                                                            >
                                                                {" "}
                                                                <span
                                                                    style={{
                                                                        color: "red",
                                                                        fontSize:
                                                                            "18px",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                                Bank required in
                                                                invoice
                                                            </Label>
                                                            <Col sm="6">
                                                                <Controller
                                                                    name="bank_required"
                                                                    control={
                                                                        control
                                                                    }
                                                                    defaultValue={
                                                                        true
                                                                    }
                                                                    rules={{
                                                                        required: false,
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Input
                                                                            type="checkbox"
                                                                            id=""
                                                                            className="checkbox_animated mt-3"
                                                                            checked={
                                                                                field.value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                field.onChange(
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                            {props.backPermissions.edit == 1 &&
                                                props?.permission
                                                    ?.wallet_required !=
                                                    "hide" && (
                                                    <Col
                                                        md="6"
                                                        className="mb-3"
                                                    >
                                                        <FormGroup className="row">
                                                            <Label
                                                                className="col-sm-6 col-form-label"
                                                                for="validationCustom01"
                                                            >
                                                                {" "}
                                                                <span
                                                                    style={{
                                                                        color: "red",
                                                                        fontSize:
                                                                            "18px",
                                                                    }}
                                                                >
                                                                    *
                                                                </span>
                                                                Wallet required
                                                                in invoice
                                                            </Label>
                                                            <Col sm="6">
                                                                <Controller
                                                                    name="wallet_required"
                                                                    control={
                                                                        control
                                                                    }
                                                                    defaultValue={
                                                                        true
                                                                    }
                                                                    rules={{
                                                                        required: false,
                                                                    }}
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Input
                                                                            type="checkbox"
                                                                            id=""
                                                                            className="checkbox_animated mt-3"
                                                                            checked={
                                                                                field.value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                field.onChange(
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                        </Row>
                                    </div>
                                    <div
                                        className="border border-default p-3 mb-3 "
                                        style={{
                                            borderStyle: "dashed!important",
                                        }}
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
                                                            {...register(
                                                                "bank_name",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                }
                                                            )}
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
                                                            {...register(
                                                                "account_holder",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                }
                                                            )}
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
                                                            {...register(
                                                                "swift_bic",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                    validate: (
                                                                        value
                                                                    ) => {
                                                                        if (
                                                                            hasWalletMethods
                                                                        ) {
                                                                            return true;
                                                                        }
                                                                        const swiftRegex =
                                                                            /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
                                                                        return (
                                                                            swiftRegex.test(
                                                                                value
                                                                            ) ||
                                                                            "SWIFT/BIC is invalid"
                                                                        );
                                                                    },
                                                                }
                                                            )}
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
                                                            {...register(
                                                                "iban",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                    validate: (
                                                                        value
                                                                    ) => {
                                                                        if (
                                                                            hasWalletMethods
                                                                        ) {
                                                                            return true;
                                                                        }
                                                                        const cleanValue =
                                                                            value.replace(
                                                                                /\s+/g,
                                                                                ""
                                                                            );
                                                                        const ibanRegex =
                                                                            /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
                                                                        return (
                                                                            ibanRegex.test(
                                                                                cleanValue
                                                                            ) ||
                                                                            "IBAN is invalid"
                                                                        );
                                                                    },
                                                                }
                                                            )}
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
                                                            {...register(
                                                                "payment_terms",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                }
                                                            )}
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
                                                            editor={
                                                                ClassicEditor
                                                            }
                                                            data={
                                                                props
                                                                    .BillingData
                                                                    ?.BillingData
                                                                    ?.bankData
                                                                    ?.bank_address ||
                                                                props.Bill
                                                                    ?.bankData
                                                                    ?.bank_address
                                                            }
                                                            onChange={(
                                                                event,
                                                                editor
                                                            ) => {
                                                                const data =
                                                                    editor.getData();
                                                                setValue(
                                                                    "bank_address",
                                                                    data
                                                                );
                                                            }}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            {...register(
                                                                "bank_address",
                                                                {
                                                                    required:
                                                                        !hasWalletMethods,
                                                                }
                                                            )}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div
                                        className="border border-default p-3 mb-3 "
                                        style={{
                                            borderStyle: "dashed!important",
                                        }}
                                    >
                                        <Label className="col-col-sm-3 col-form-label m-r-10 mb-3 fw-bold">
                                            Wallets Payment methods
                                        </Label>
                                        <Table hover>
                                            <thead>
                                                <tr>
                                                    <th scope="col">{"#"}</th>
                                                    <th scope="col">
                                                        {"Default"}
                                                    </th>
                                                    <th scope="col">
                                                        {"Method"}
                                                    </th>
                                                    <th scope="col">Account</th>
                                                    <th
                                                        style={{ width: "10%" }}
                                                        scope="col"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            addRow();
                                                        }}
                                                    >
                                                        <Btn
                                                            attrBtn={{
                                                                color: "btn btn-light",
                                                            }}
                                                        >
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
                                                                {...register(
                                                                    `defaults[${row.id}]`,
                                                                    {
                                                                        required: false,
                                                                    }
                                                                )}
                                                                name={`defaults[${row.id}]`}
                                                                type="radio"
                                                                value={row.id}
                                                                checked={
                                                                    selectedDefaults[
                                                                        row.id
                                                                    ] == 1
                                                                }
                                                                onChange={
                                                                    handleRadioChange
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <Controller
                                                                name={`method[${row.id}]`}
                                                                control={
                                                                    control
                                                                }
                                                                rules={{
                                                                    required: true,
                                                                }}
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <Select
                                                                        {...field}
                                                                        value={
                                                                            selectedOptionM[
                                                                                row
                                                                                    .id
                                                                            ] ||
                                                                            null
                                                                        }
                                                                        options={
                                                                            optionsM[
                                                                                row
                                                                                    .id
                                                                            ] ||
                                                                            []
                                                                        }
                                                                        onInputChange={(
                                                                            inputValue
                                                                        ) =>
                                                                            handleInputChangeSelect(
                                                                                inputValue,
                                                                                "vendor_payment_methods",
                                                                                `method[${row.id}]`,
                                                                                setOptionsM,
                                                                                optionsM,
                                                                                row.id
                                                                            )
                                                                        }
                                                                        className="js-example-basic-single col-sm-12"
                                                                        isSearchable
                                                                        noOptionsMessage={() =>
                                                                            loading2 ? (
                                                                                <div className="loader-box">
                                                                                    <Spinner
                                                                                        attrSpinner={{
                                                                                            className:
                                                                                                "loader-6",
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                "No options found"
                                                                            )
                                                                        }
                                                                        onChange={(
                                                                            option
                                                                        ) => {
                                                                            setSelectedOptionM(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    [row.id]:
                                                                                        option,
                                                                                })
                                                                            );
                                                                            field.onChange(
                                                                                option.value
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </td>

                                                        <td>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    row.inputValue
                                                                }
                                                                {...register(
                                                                    `account[${row.id}]`,
                                                                    {
                                                                        required: true,
                                                                    }
                                                                )}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        e,
                                                                        row.id
                                                                    )
                                                                }
                                                                className="form-control"
                                                                placeholder="Account"
                                                            />
                                                        </td>

                                                        <td
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                deleteRow(
                                                                    row.id,
                                                                    row.idUpdate,
                                                                    selectedDefaults
                                                                );
                                                            }}
                                                        >
                                                            <Btn
                                                                attrBtn={{
                                                                    color: "btn btn-danger",
                                                                }}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </Btn>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Btn
                                            attrBtn={{
                                                color: "primary",
                                                disabled: Sub,
                                                onClick: handleSubmit(
                                                    handleClick,
                                                    onError
                                                ),
                                            }}
                                        >
                                               {Sub ? (
                                                                                      <>
                                                                                          <Spinner size="sm" />{" "}
                                                                                          Submitting...
                                                                                      </>
                                                                                  ) : (
                                                                                      "Submit"
                                                                                  )}
                                        </Btn>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Billing;