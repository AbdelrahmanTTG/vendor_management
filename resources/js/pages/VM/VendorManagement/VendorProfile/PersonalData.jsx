import React, { Fragment, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardBody, CardHeader, Col, Input, InputGroup, FormGroup, Collapse, Row, Label, Form } from 'reactstrap';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import axiosClient from "../../../../pages/AxiosClint";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CommonModal from '../../Model';
import { toast } from 'react-toastify';

const PersonalData = React.memo((props) => {
  // toast.configure();
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
    }
  };
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { register: registerContact, handleSubmit: handleSubmitContact, setValue: setValueContact, formState: { errors: errorsContact } } = useForm();

  const [inputValues, setInputValues] = useState([]);
  const [nameLabel, setNameLabel] = useState('Name');
  const [ContactLabel, setContactLabel] = useState('Contact name');
  const [isOpen, setIsOpen] = useState(true);
  const [Status, setStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [selectedOptionR, setSelectedOptionR] = useState(null);
  const [optionsR, setOptionsR] = useState([]);

  const [selectedOptionN, setSelectedOptionN] = useState(null);
  const [optionsN, setOptionsN] = useState([]);

  const [selectedOptionC, setSelectedOptionC] = useState(null);
  const [optionsC, setOptionsC] = useState([]);

  const [selectedOptionT, setSelectedOptionT] = useState(null);
  const [optionsT, setOptionsT] = useState([]);

  const [loading, setLoading] = useState(false);

  const [initialOptions, setInitialOptions] = useState({});

  const [modal, setModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [idVendor, setidVendor] = useState(false);

  const toggle = () => setModal(!modal);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  }
  const handleVendorTypeChange = (selectedOption) => {
    if (selectedOption.value == 2) {
      setNameLabel('Agency Name');
      setContactLabel('Contact person')
    } else {
      setContactLabel('Contact name')
      setNameLabel('Name');
    }
  };
  const handleStatusChange = (selectedOption) => {
    if (selectedOption.value == 3) {
      setStatus(true)
    } else {
      setStatus(false)
      setValue('reject_reason', null);

    }
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
        regions: item?.region
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
  const handelingRegions = async (id) => {
    if (!id) return
    try {
      setLoading(true);
      const { data } = await axiosClient.get("GetRegions", {
        params: {
          id: id
        }
      });
      const formattedOptions = data.map(item => ({
        value: item.id,
        label: item.name,
      }));
      setOptionsR(formattedOptions);
      setSelectedOptionR(formattedOptions)
      setValue("region", formattedOptions[0]?.value)

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
  const handelingSelectTimeZone = async (id) => {
    if (!id) return
    try {
      setLoading(true);
      const { data } = await axiosClient.get("GetTimeZone", {
        params: {
          id: id
        }
      });
      const formattedOptions = [{ value: data.id || "", label: data.gmt || "" }]
      setSelectedOptionT(formattedOptions )
      setOptionsT(formattedOptions );
      setValue("timezone", data?.id )
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
  // useEffect(() => {
  //   // handelingSelect("regions", setOptionsR, "region");
  //   // handelingSelect("countries", setOptionsN, "Nationality");
  // }, []);
  const columnMapping = {
    "LinkedIn": "contact_linked_in",
    "ProZ": "contact_ProZ",
    "other1": "contact_other1",
    "other2": "contact_other2",
    "other3": "contact_other3",
  };
  const onSubmit = async (data) => {
    if (!props.backPermissions?.add) {
      basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
      return;
    }
    const formData = { ...data };
    const contacts = formData.contacts || [];

    contacts.forEach(contact => {
      const dbKey = columnMapping[contact.label];
      if (dbKey) {
        formData[dbKey] = contact.value;
      }
    });
    const vendorTypeValue = formData.type.value;
    const vendorstatusValue = formData.status.value;
    formData.type = vendorTypeValue
    formData.status = vendorstatusValue
    delete formData.contacts;
    try {
      const response = await axiosClient.post("PersonalInformation", formData);
      setIsSubmitting(true)
      setidVendor(response.data.vendor.id)
      props.onDataSend(response.data.vendor.data)
      basictoaster("successToast", response.data.message);

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
  const Update = async (formData) => {
    if (!props.backPermissions?.edit) {
      basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
      return;
    }
    const contacts = formData.contacts || [];
    contacts.forEach(({ label, value }) => {
      const dbKey = columnMapping[label];
      if (dbKey) {
        formData[dbKey] = value;
      }
    });
    formData.type = formData.type.value;
    formData.status = formData.status.value;
    delete formData.contacts;
    idVendor ? formData.id = idVendor : false;
    formData.VendorSide = props?.VendorSide ? true: false;
    try {
      const response = await axiosClient.post("updatePersonalInformation", formData);
      basictoaster("successToast", response.data.message);
      props.onDataSend(response.data.vendor.vendor)
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
  };

  const onError = (errors) => {
    for (const [key, value] of Object.entries(errors)) {
      switch (key) {
        case "name":
          basictoaster("dangerToast", "Name is required");
          return;
        case "type":
          basictoaster("dangerToast", "Type is required");
          return;
        case "status":
          basictoaster("dangerToast", "Status is required");
          return;
        case "vendor_source":
          basictoaster("dangerToast", "Vendor Source is required");
          return;
        case "timezone":
          basictoaster("dangerToast", "Time zone is required");
          return;
        case "phone_number":
          if (errors.phone_number?.type === "required") {
            basictoaster("dangerToast", "Phone number is required");
          } else if (errors.phone_number?.type === "pattern") {
            basictoaster("dangerToast", "Invalid phone number format. Must be in international format (+123456789).");
          }
          return;
        case "region":
          basictoaster("dangerToast", "Region is required");
          return;
        case "country":
          basictoaster("dangerToast", "Country is required");
          return;
        case "nationality":
          basictoaster("dangerToast", "Nationality is required");
          return;

        case "email":
          if (errors.email?.type === "required") {
            basictoaster("dangerToast", "Email is required");
          } else if (errors.email?.type === "pattern") {
            basictoaster("dangerToast", "Invalid email address");
          }
          return;
        default:
          break;
      }
    }
  };

  const contact = (form) => {
    const options = Object.keys(form)
      .filter(key => form[key])
      .map(key => ({
        value: form[key],
        label: key
      }));
    setInputValues(options);
    setValue('contacts', options);
    toggle()
  }
  const handleClick = (data) => {
    if (props.onSubmit === 'onSubmit' && !isSubmitting) {
      // setIsSubmitting(true)
      // props.onDataSend(1) 
      // console.log("1")
      onSubmit(data);
    } else if (props.onSubmit === 'onUpdate' || isSubmitting) {
      // console.log("2")

      Update(data)
    }
  };
  // useEffect(() => {
  //   if (typeof props.personal == "object" && ) {
  //     console.log(props.personal)
  //   }

  // }, [props.personal])
  useEffect(() => {
    if (props.permission) {

      Object.keys(props.permission).forEach((field) => {
        // const input = document.querySelector(`[name=${field}]`);
        const inputDiv = document.getElementById(`${field}-wrapper`);;
        // console.log(inputDiv)
        if (inputDiv) {
          switch (props.permission[field]) {
            // case 'show':
            //   inputDiv.style.display = 'block'; 
            //   inputDiv.querySelector('input, select, textarea').disabled = false; 
            //   break;
            case 'hide':
              inputDiv.style.display = 'none';
              break;
            case 'disable':
              inputDiv.style.display = 'block';
              const Input = inputDiv.querySelector('input');
              if (Input) {
                Input.disabled = true;
              }
              break;
            default:
              break;
          }
        }
      });
    }

  }, [props.permission]);
  const [loading2, setLoading2] = useState(false);
  useEffect(() => {
    if (props.personal) {
      setIsSubmitting(true)
    }
    if (props.mode === "edit" || props.personal) {
      setLoading2(true);
      if (props?.vendorPersonalData || props.personal) {
        if (props.vendorPersonalData?.PersonalData || props.personal) {
          const data = props?.vendorPersonalData?.PersonalData || props.personal;
          setidVendor(data?.id)
          if (data.type !== null && data.type !== undefined) {
            const vendorTypeOption = {
              value: data.type,
              label:
                data.type == 0 ? "Freelance" :
                  data.type == 1 ? "In House" :
                    data.type == 2 ? "Agency" :
                      data.type == 3 ? "Contractor" :
                        "Unknown"
            };
            handleVendorTypeChange(vendorTypeOption);
            setValue("type", vendorTypeOption);
          }
          if (data.status !== null && data.status !== undefined) {
            const statusOption = {
              value: data.status,
              label:
                data.status == 0 ? "Active" :
                  data.status == 1 ? "Inactive" :
                    data.status == 2 ? "Wait for Approval" :
                      data.status == 3 ? "Rejected" :
                        "Unknown"
            }; handleStatusChange(statusOption);
            setValue("status", statusOption);
          }
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("prfx_name", data.prfx_name);
          setValue("vendor_source", data.vendor_source);
          setValue("contact_name", data.contact_name);
          setValue("legal_Name", data.legal_Name);
          const country = data.country ? {
            value: data.country.id,
            label: data.country.name
          } : null;
          setSelectedOptionC(country);
          setValue("country", country.value);
          const extractedNumber = data.phone_number?.match(/(\+?\d+)/g)?.join('') || "";
          setValue("phone_number", extractedNumber);
          setValue("Anothernumber", data.Anothernumber);
          const contact =
            [
              { value: data.contact_linked_in, label: "LinkedIn" },
              { value: data.contact_ProZ, label: "ProZ" },
              { value: data.contact_other1, label: "other1" },
              { value: data.contact_other2, label: "other2" },
              { value: data.contact_other3, label: "other3" }
            ]
          const filteredContact = contact.filter(item => item.value !== '' && item.value !== null);
          setInputValues(filteredContact)
          setValue('contacts', filteredContact);
          setValueContact('LinkedIn', data.contact_linked_in)
          setValueContact('ProZ', data.contact_ProZ)
          setValueContact('other1', data.contact_other1)
          setValueContact('other2', data.contact_other2)
          setValueContact('other3', data.contact_other3)
          const region = data.region ? {
            value: data.region.id,
            label: data.region.name
          } : null;
          setSelectedOptionR(region);
          setValue("region", region?.value);
          const nationality = data.nationality ? {
            value: data.nationality.id,
            label: data.nationality.name
          } : null;
          setSelectedOptionN(nationality);
          setValue("nationality", nationality?.value);
          const timezone = data.timezone ? {
            value: data.timezone.id,
            label: data.timezone.gmt
          } : null;
          setSelectedOptionT(timezone);
          setValue("timezone", timezone?.value);

          setValue("street", data.street);
          setValue("city", data.city);
          setValue("address", data.address)
          setValue('reject_reason', data.reject_reason);
          setValue('note', data.note);
          setValue('vendor_source', data.vendor_source);

          setLoading2(false);

        }
      }
    }

  }, [props.vendorPersonalData, setValue]);



  return (
    <Fragment>
      <Card>
        <CardHeader
          className="pb-3 d-flex justify-content-between align-items-center"
          onClick={toggleCollapse}
          style={{ cursor: 'pointer', paddingBottom: '25px' }
          }
        >
          <H5>Personal Information </H5>
          < i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}> </i>
        </CardHeader>
        < Collapse isOpen={isOpen} >
          <CardBody>
            {
              loading2 ? (
                <div className="loader-box" >
                  <Spinner attrSpinner={{ className: 'loader-6' }} />
                </div>
              ) : <Form className="needs-validation" noValidate="" autoComplete="off" >
                <Row className="g-3 mb-3" >
                  <Col md="6" id="type-wrapper" >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Vendor Type </Label>
                      < Col sm="9" >
                        <Controller
                          name="type"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              id='type'
                              {...field}
                              value={field.value || { value: '', label: '-- Select Type --' }}
                              options={
                                [
                                  { value: '0', label: 'Freelance' },
                                  { value: '2', label: 'Agency' },
                                  { value: '3', label: 'Contractor' },
                                  { value: '1', label: 'In House' },
                                ]}
                              className="js-example-basic-single col-sm-12"
                              onChange={(option) => {
                                handleVendorTypeChange(option);
                                field.onChange(option);
                              }}
                              isDisabled={(props.permission && props.permission.type === "disable")}
                            />
                          )}
                        />

                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" id="status-wrapper" style={{ display: props?.permission?.status ? "none" : "block" }} >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Status </Label>
                      < Col sm="9" >
                        <Controller
                          name="status"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              id='status'
                              {...field}
                              value={field.value ?? { value: '', label: '-- Select Status --' }}
                              options={
                                [
                                  { value: '0', label: 'Active' },
                                  { value: '1', label: 'Inactive' },
                                  { value: '2', label: 'Wait for Approval' },
                                  { value: '3', label: 'Rejected' },
                                ]} className="js-example-basic-single col-sm-12"
                              onChange={(option) => {
                                handleStatusChange(option);
                                field.onChange(option);
                              }}
                              isDisabled={(props.permission && props.permission.status === "disable")}
                            />
                          )} />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" id="name-wrapper" >
                    <FormGroup className="row" >

                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> {nameLabel} </Label>
                      < Col sm="9" >
                        <input
                          defaultValue=""
                          className="form-control"
                          // id="name"
                          type="text"
                          name="name"
                          {...register("name", { required: true })}
                          placeholder={nameLabel}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" id="contact-wrapper" >
                    <FormGroup className="row" >
                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > {ContactLabel} </Label>
                      < Col sm="9" >
                        <InputGroup>
                          <select disabled={(props.permission && props.permission.contact === "disable")} className="input-group-text" id="inputGroup" defaultValue="" {...register("prfx_name", { required: false })} >
                            <option value="" disabled > Prefix </option>
                            < option value="Mr" > Mr </option>
                            < option value="Ms" > Ms </option>
                            < option value="Mss" > Mss </option>
                            < option value="Mrs" > Mrs </option>

                          </select>
                          < input
                            className="form-control"

                            defaultValue=""
                            type="text"
                            name="contact_name"
                            {...register("contact_name", { required: false })}
                            placeholder={ContactLabel}
                          />
                        </InputGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Legal Name </Label>
                      < Col sm="9" >
                        <input
                          className="form-control leg"
                          id="Legal_Name"
                          type="text"
                          name="legal_Name"
                          {...register("legal_Name", { required: false })}
                          placeholder="As Mentioned in ID and Passport"

                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Email </Label>
                      < Col sm="9" >
                        < input
                          className="form-control"
                          disabled={props?.permission?.email ? true : false}
                          // id="email"
                          type="email"
                          name="email"
                          placeholder="Email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Invalid email address"
                            }
                          })
                          }
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >

                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Phone Number </Label>
                      < Col sm="9" >

                        <InputGroup>
                          <input
                            className="form-control"
                            // id="Phone_number"
                            type="tel"
                            name="Phone_number"
                            placeholder="Phone number"
                            {...register("phone_number", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^\+[1-9]{1}[0-9]{3,14}$/
                              }
                            })
                            }
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^+\d]/g, '');
                            }}
                          />
                          < input
                            className="form-control "
                            // id="Anothernumber"
                            type="tel"
                            name="Another-number"
                            pattern="[789][0-9]{9}"
                            placeholder="Another number"
                            {...register("Anothernumber", { required: false })}
                          />


                        </InputGroup>
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Contact </Label>
                      < Col sm="9" >

                        <div className="input-group flex-nowrap" >
                          <div className="input-group-prepend" >
                            <span className="input-group-text " onClick={toggle} >
                              <i className={`icofont ${inputValues.length <= 0 ? 'icofont-plus' : 'icofont-ui-edit'}`} style={{ fontSize: "10px" }}> </i>
                            </span>

                          </div>
                          < Controller
                            name="contacts"
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className="js-example-basic-single col-sm-11"
                                isMulti
                                value={inputValues}
                                isDisabled
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </FormGroup>
                    </Col>
                    < Col md="6" >
                      <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Country of residence</Label>
                        < Col sm="9" >
                          <Controller
                            name="country"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                value={selectedOptionC }
                                options={optionsC}
                                className="js-example-basic-single col-sm-12"
                                isSearchable
                                onInputChange={(inputValue) =>
                                  handleInputChange(inputValue, "countries", "Country", setOptionsC, optionsC)
                                }
                                noOptionsMessage={() => loading ? (
                                  <div className="loader-box" >
                                    <Spinner attrSpinner={{ className: 'loader-6' }} />
                                  </div>
                                ) : 'No options found'}
                                onChange={(option) => {
                                  setSelectedOptionC(option);
                                  handelingSelectTimeZone(option?.value)
                                  handelingRegions(option?.regions)
                                  field.onChange(option?.value);
                                }}

                              />
                            )}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Region </Label>
                      < Col sm="9" >
                        <Controller
                          name="region"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={selectedOptionR}
                              options={optionsR}
                              // onInputChange={(inputValue) =>
                              //   handleInputChange(inputValue, "regions", "region", setOptionsR, optionsR)
                              // }
                              className="js-example-basic-single col-sm-12"
                              isSearchable
                              noOptionsMessage={() => loading ? (
                                <div className="loader-box" >
                                  <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                              ) : 'Select Country first'}
                              onChange={(option) => {
                                setSelectedOptionR(option);
                                field.onChange(option.value);
                                // handelingSelectCountry(option.value)
                              }}

                            />
                          )}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                 
                  < Col md="6" >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Nationality </Label>
                      < Col sm="9" >
                        <Controller
                          name="nationality"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={selectedOptionN}
                              options={optionsN}
                              onInputChange={(inputValue) =>
                                handleInputChange(inputValue, "countries", "Nationality", setOptionsN, optionsN)
                              }
                              className="js-example-basic-single col-sm-12"
                              isSearchable
                              noOptionsMessage={() => loading ? (
                                <div className="loader-box" >
                                  <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                              ) : 'No options found'}
                              onChange={(option) => {
                                setSelectedOptionN(option);
                                field.onChange(option.value);
                              }}

                            />
                          )}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >

                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Rank </Label>
                      < Col sm="9" >

                        <div className="d-flex justify-content-between align-items-center" >
                          <div className="ratings" style={{ fontSize: "25px" }}>
                            <i className="fa fa-star rating-color" > </i>
                            < i className="fa fa-star rating-color" > </i>
                            < i className="fa fa-star rating-color" > </i>
                            < i className="fa fa-star rating-color" > </i>
                            < i className="fa fa-star" > </i>
                          </div>
                        </div>
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Time Zone </Label>
                      < Col sm="9" >
                        <Controller
                          name="timezone"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={selectedOptionT || { value: "", label :"" }}
                              options={optionsT}
                           
                              className="js-example-basic-single col-sm-12"
                              isSearchable
                              noOptionsMessage={() => loading ? (
                                <div className="loader-box" >
                                  <Spinner attrSpinner={{ className: 'loader-6' }} />
                                </div>
                              ) : 'Select Country first'}
                              onChange={(option) => {
                                setSelectedOptionT(option);
                                field.onChange(option.value);
                              }}

                            />
                          )}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >

                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Street </Label>
                      < Col sm="9" >

                        <input

                          className="form-control"
                          id="Street"
                          type="text"
                          name="Street"
                          {...register("street", { required: false })}
                          placeholder="Street"
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >

                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > City / state </Label>
                      < Col sm="9" >
                        <input

                          className="form-control"
                          id="City_state"
                          type="text"
                          name="City_state"
                          {...register("city", { required: false })}
                          placeholder="City / state"
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  < Col md="6" >
                    <FormGroup className="row" >
                        <Label className="col-sm-3 col-form-label" for="validationCustom01" ><span style={{ color: 'red', fontSize: "18px" }}>*</span> Vendor Source </Label>
                      < Col sm="9" >
                        <input
                          className="form-control"
                          id="vendor_source"
                          type="text"
                          name="vendor_source"
                          {...register("vendor_source", { required: true })}
                          placeholder="Vendor Source"
                        />


                      </Col>
                    </FormGroup>
                  </Col>


                  < Col md="6" id="address-wrapper" >
                    <FormGroup className="row" >
                      <Label className="col-sm-3 col-form-label" for="validationCustom01" > Address </Label>
                      < Col sm="9" >

                        <CKEditor
                          editor={ClassicEditor}
                          data={props.vendorPersonalData?.PersonalData?.address || props?.personal?.address || ""}

                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setValue('address', data);
                          }}
                          disabled={(props.permission && props.permission.address === "disable")}
                        />
                        < input
                          id='address'
                          hidden disabled
                          {...register('address', { required: false })}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  {props.vendorPersonalData?.PersonalData?.contact || props?.personal?.contact ? (
                    <Col md="6" id="Old_Contact-wrapper">
                      <FormGroup className="row">
                        <Label className="col-sm-3 col-form-label" for="validationCustom01">Old Contact</Label>
                        <Col sm="9">
                          <input
                            className="form-control"
                            defaultValue={props.vendorPersonalData.PersonalData.contact || props?.personal?.contact}
                            // onChange={(e) => console.log(e.target.value)}
                            placeholder="Old Contact Info"
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  ) : (
                    <Col md="6" id="Old_Contact-wrapper" style={{ minHeight: '100px' }}>
                      <div style={{ height: '100%' }} />
                    </Col>
                  )}
                  {
                    Status && (
                      <Col md="12" id="reject_reason-wrapper">
                        <FormGroup className="row">
                          <Label className="col-form-label" style={{ width: '12.5%' }} for="validationCustom01">
                              <span style={{ color: 'red', fontSize: "18px" }}>*</span> Rejection Reason
                          </Label>


                          <Col style={{ width: '87.5%' }}>
                            <CKEditor
                              editor={ClassicEditor}
                              data={props.vendorPersonalData?.PersonalData?.reject_reason || props?.personal?.reject_reason || ""}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setValue('reject_reason', data);
                              }}
                              disabled={(props.permission && props.permission.reject_reason === "disable")}
                            />
                            <input
                              disabled
                              hidden
                              {...register('reject_reason', { required: false })}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    )
                  }



                </Row>
                < div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn
                    attrBtn={{ color: 'primary', onClick: handleSubmit(handleClick, onError), }}
                  >
                    Submit
                  </Btn>
                </div>
              </Form>}

          </CardBody>
        </Collapse>
      </Card>
      < CommonModal isOpen={modal} title="Add Contact" toggler={toggle} onSave={handleSubmitContact(contact)} >
        <Row className="g-0" >

          <Col>
            <FormGroup className="row" >
              <Label className="col-sm-3 col-form-label" for="validationCustom01" > linked In </Label>
              < Col md="9" >
                <input
                  className="form-control"
                  id="linkedIn"
                  type="url"
                  name="LinkedIn"
                  placeholder="Linked In"
                  {...registerContact("LinkedIn", {
                    required: false,
                    // validate: {
                    //   isValidURL: value => {
                    //     const regex = /^(ftp|http|https):\/\/[^ "]+$/;
                    //     return regex.test(value) || "Please enter a valid URL";
                    //   }
                    // }
                  })
                  }
                />
              </Col>
              {/* < span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                {errorsContact.LinkedIn?.type === 'required' && 'LinkedIn link is required'}
                {errorsContact.LinkedIn?.type === 'isValidURL' && 'Please enter a valid URL'}
              </span> */}
            </FormGroup>
            < FormGroup className="row" >
              <Label className="col-sm-3 col-form-label" for="validationCustom01" > ProZ </Label>
              < Col md="9" >
                <input
                  className="form-control"
                  id="ProZ"
                  type="url"
                  name="ProZ"
                  placeholder="ProZ"
                  {...registerContact("ProZ", {
                    required: false,
                    // validate: {
                    //   isValidURL: value => {
                    //     const regex = /^(ftp|http|https):\/\/[^ "]+$/;
                    //     return regex.test(value) || "Please enter a valid URL";
                    //   }
                    // }
                  })
                  } />

              </Col>
              {/* < span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                {errorsContact.ProZ?.type === 'required' && 'ProZ link is required'}
                {errorsContact.ProZ?.type === 'isValidURL' && 'Please enter a valid URL'}
              </span> */}
            </FormGroup>
            < FormGroup className="row" >
              <Label className="col-sm-3 col-form-label" for="validationCustom01" > other 1 </Label>
              < Col md="9" >
                <input
                  className="form-control"
                  id="other1"
                  type="url"
                  name="other1"
                  placeholder="other 1"
                  {...registerContact("other1", { required: false, })} />
              </Col>
            </FormGroup>
            < FormGroup className="row" >
              <Label className="col-sm-3 col-form-label" for="validationCustom01" > other 2 </Label>
              < Col md="9" >
                <input
                  className="form-control"
                  id="other2"
                  type="url"
                  name="other2"
                  placeholder="other 2"
                  {...registerContact("other2", { required: false, })}
                />
              </Col>
            </FormGroup>
            < FormGroup className="row" >
              <Label className="col-sm-3 col-form-label" for="validationCustom01" > other 3 </Label>
              < Col md="9" >
                <input
                  className="form-control"
                  id="other3"
                  type="url"
                  name="other3"
                  placeholder="other3"
                  {...registerContact("other3", { required: false, })} />
              </Col>
            </FormGroup>
          </Col>
        </Row>


      </CommonModal>
    </Fragment>
  );
});

export default PersonalData;