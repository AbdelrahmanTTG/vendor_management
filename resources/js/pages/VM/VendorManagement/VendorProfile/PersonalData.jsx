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

const PersonalData = forwardRef((props, ref) => {
  toast.configure();
  const submitForm = () => {
    alert('Form submitted from Component A');
    return "id"
  };
  useImperativeHandle(ref, () => ({
    submitForm,
  }));
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
  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { control: controlContact, register: registerContact, handleSubmit: handleSubmitContact, formState: { errors: errorsContact } } = useForm();
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
  const toggle = () => setModal(!modal);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  }
  const handleVendorTypeChange = (selectedOption) => {
    if (selectedOption.value === 'Agency') {
      setNameLabel('Agency Name');
      setContactLabel('Contact person')
    } else {
      setContactLabel('Contact name')
      setNameLabel('Name');
    }
  };
  const handleStatusChange = (selectedOption) => {
    if (selectedOption.value === 'Rejected') {
      setStatus(true)
    } else {
      setStatus(false)

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
  const handelingSelectCountry = async (id) => {
    if (!id) return
    try {
      setLoading(true);
      const { data } = await axiosClient.get("GetCountry", {
        params: {
          id: id
        }
      });
      const formattedOptions = data.map(item => ({
        value: item.id,
        label: item.name,
      }));

      setOptionsC(formattedOptions);
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
    handelingSelect("regions", setOptionsR, "region");
    handelingSelect("countries", setOptionsN, "Nationality");
    handelingSelect("time_zone", setOptionsT, "TimeZone");


  }, []);

  const onSubmit = async (data) => {
    const formData = {
      ...data
    };
    const phoneNumbers = [];
    if (formData.phone_number) {
      phoneNumbers.push(formData.phone_number);
    }
    if (formData.Anothernumber) {
      phoneNumbers.push(formData.Anothernumber);
    }
    formData.phone_number = phoneNumbers.join(", ");
    const contacts = formData.contact || []; 
    const organizedContacts = contacts.map(contact => contact.value).join(", ");   
    formData.contact = organizedContacts;
   
    console.log(formData)
  }
  const onError = (errors) => {
    for (const [key, value] of Object.entries(errors)) {
      switch (key) {
        case "name":
          basictoaster("dangerToast", "Name is required");
          return;
        case "legal_Name":
          basictoaster("dangerToast", "Legal name is required");
          return;
        case "phone_number":
          if (errors.Phone_number.type === "required") {
            basictoaster("dangerToast", "Phone number is required");
          } else if (errors.Phone_number.type === "pattern") {
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
        case "city":
          basictoaster("dangerToast", "City or state is required");
          return;
        case "contact_name":
          basictoaster("dangerToast", "Contact name is required");
          return;
        case "prfx_name":
          basictoaster("dangerToast", "Prefix is required");
          return;
        case "email": 
          if (errors.email.type === "required") {
            basictoaster("dangerToast", "Email is required");
          } else if (errors.email.type === "pattern") {
            basictoaster("dangerToast", "Invalid email address");
          }
          return;
        case "contact":
          basictoaster("dangerToast", "Contact is required");
          return;
        case "address":
          basictoaster("dangerToast", "Address is required");
          return;
        case "reject_reason":
          basictoaster("dangerToast", "Rejection Reason is required");
          return;
        case "Street": 
          basictoaster("dangerToast", "Street is required");
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
    setValue('contact', options);
    toggle()
  }

  return (
    <Fragment>
      <Card>

        <CardHeader
          className="pb-3 d-flex justify-content-between align-items-center"
          onClick={toggleCollapse}
          style={{ cursor: 'pointer', paddingBottom: '25px' }}
        >
          <H5>Personal Information</H5>
          <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
        </CardHeader>
        <Collapse isOpen={isOpen}>
          <CardBody>
            <Form className="needs-validation" noValidate="" autoComplete="off">
              <Row className="g-3 mb-3">
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Vendor Type</Label>
                    <Col sm="9">
                      <Controller
                        name="Vendor_Type"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={{ isDisabled: true, label: '-- Select Type --' }}
                            options={[
                              { value: 'Freelance', label: 'Freelance' },
                              { value: 'Agency', label: 'Agency' },
                              { value: 'Contractor', label: 'Contractor' },
                              { value: 'In House', label: 'In House' },
                            ]}
                            className="js-example-basic-single col-sm-12"
                            onChange={(option) => {
                              handleVendorTypeChange(option);
                              field.onChange(option);
                            }}
                          />
                        )}
                      />

                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Status</Label>
                    <Col sm="9">
                      <Controller
                        name="Status"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={{ isDisabled: true, label: '-- Select Status --' }}
                            options={[
                              { value: 'Active', label: 'Active' },
                              { value: 'Inactive', label: 'Inactive' },
                              { value: 'Rejected', label: 'Rejected' },
                              { value: 'Wait for Approval', label: 'Wait for Approval' },
                            ]} className="js-example-basic-single col-sm-12"
                            onChange={(option) => {
                              handleStatusChange(option);
                              field.onChange(option);
                            }}
                          />
                        )} />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">{nameLabel}</Label>
                    <Col sm="9">
                      <input
                        defaultValue=""
                        className="form-control"
                        id="name"
                        type="text"
                        name="name"
                        {...register("name", { required: true })}
                        placeholder={nameLabel}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">{ContactLabel}</Label>
                    <Col sm="9">
                      <InputGroup>
                        <select className="input-group-text" id="inputGroup" defaultValue="" {...register("prfx_name", { required: true })} >
                          <option value="" disabled>Prefix</option>
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mss">Mss</option>
                          <option value="Mrs">Mrs</option>
                        </select>
                        <input
                          className="form-control"
                          id="contact_name"
                          defaultValue=""
                          type="text"
                          name="contact_name"
                          {...register("contact_name", { required: true })}
                          placeholder={ContactLabel}
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Legal Name</Label>
                    <Col sm="9">
                      <input
                        className="form-control leg"
                        id="Legal_Name"
                        type="text"
                        name="Legal_Name"
                        {...register("legal_Name", { required: true })}
                        placeholder="As Mentioned in ID and Passport"
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Email</Label>
                    <Col sm="9">
                      {/* <Input className="form-control" type="email" placeholder="email" /> */}
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                          }
                        })}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Phone Number</Label>
                    <Col sm="9">

                      <InputGroup>
                        <input
                          className="form-control"
                          id="Phone_number"
                          type="tel"
                          name="Phone_number"
                          placeholder="Phone number"
                          {...register("phone_number", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^\+[1-9]{1}[0-9]{3,14}$/
                            }
                          })}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^+\d]/g, '');
                          }}
                        />
                        <input
                          className="form-control "
                          id="Anothernumber"
                          type="number"
                          name="Another-number"
                          pattern="[789][0-9]{9}"
                          placeholder="Another number"
                          {...register("Anothernumber", { required: false })}
                        />

                        {/* <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" />
                      <Input className="form-control" pattern="[789][0-9]{9}" type="number" placeholder="Another number" /> */}
                      </InputGroup>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Contact</Label>
                    <Col sm="9">

                      <div className="input-group flex-nowrap">
                        <div className="input-group-prepend">
                          <span className="input-group-text " onClick={toggle}>
                            <i className={`icofont ${inputValues.length <= 0 ? 'icofont-plus' : 'icofont-ui-edit'}`} style={{ fontSize: "10px" }}></i>
                          </span>

                        </div>
                        <Controller
                          name="contact"
                          control={control}
                          rules={{ required: true }}
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
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Region</Label>
                    <Col sm="9">
                      <Controller
                        name="region"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={selectedOptionR}
                            options={optionsR}
                            onInputChange={(inputValue) =>
                              handleInputChange(inputValue, "regions", "region", setOptionsR, optionsR)
                            }
                            className="js-example-basic-single col-sm-12"
                            isSearchable
                            noOptionsMessage={() => loading ? (
                              <div className="loader-box">
                                <Spinner attrSpinner={{ className: 'loader-6' }} />
                              </div>
                            ) : 'No options found'}
                            onChange={(option) => {
                              setSelectedOptionR(option);
                              field.onChange(option.value);
                              handelingSelectCountry(option.value)
                            }}
                          />
                        )}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Country of region</Label>
                    <Col sm="9">
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={selectedOptionC}
                            options={optionsC}
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
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Nationality</Label>
                    <Col sm="9">
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
                              <div className="loader-box">
                                <Spinner attrSpinner={{ className: 'loader-6' }} />
                              </div>
                            ) : 'No options found'}
                            onChange={(option) => {
                              setSelectedOptionN(option);
                              field.onChange(option.value);
                            }}
                          />
                        )}
                      />                  </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Rank</Label>
                    <Col sm="9">

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="ratings" style={{ fontSize: "25px" }}>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star rating-color"></i>
                          <i className="fa fa-star"></i>
                        </div>
                      </div>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">
                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Time Zone</Label>
                    <Col sm="9">
                      <Controller
                        name="timezone"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={selectedOptionT}
                            options={optionsT}
                            onInputChange={(inputValue) =>
                              handleInputChange(inputValue, "time_zone", "TimeZone", setOptionsT, optionsT)
                            }
                            className="js-example-basic-single col-sm-12"
                            isSearchable
                            noOptionsMessage={() => loading ? (
                              <div className="loader-box">
                                <Spinner attrSpinner={{ className: 'loader-6' }} />
                              </div>
                            ) : 'No options found'}
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
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Street</Label>
                    <Col sm="9">

                      <input
                        className="form-control"
                        id="Street"
                        type="text"
                        name="Street"
                        {...register("street", { required: true })}
                        placeholder="Street"
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">City / state</Label>
                    <Col sm="9">
                      <input
                        className="form-control"
                        id="City_state"
                        type="text"
                        name="City_state"
                        {...register("city", { required: true })}
                        placeholder="City / state"
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Notes</Label>
                    <Col sm="9">

                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setValue('note', data);
                        }}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Address</Label>
                    <Col sm="9">

                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setValue('address', data);
                        }}

                      />
                      <input
                        type="hidden" id='Address'
                        {...register('address', { required: true })}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                {Status && <Col md="6">
                  <FormGroup className="row">

                    <Label className="col-sm-3 col-form-label" for="validationCustom01">Rejection Reason</Label>
                    <Col sm="9">

                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setValue('reject_reason', data);
                        }}
                      />
                      <input
                        hidden disabled
                        {...register('reject_reason', { required: true })}
                      />
                    </Col>
                  </FormGroup>
                </Col>}
              </Row>
              <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(onSubmit, onError) }}>Submit</Btn>
            </Form>
          </CardBody>
        </Collapse>
      </Card>
      <CommonModal isOpen={modal} title="Add Contact" toggler={toggle} onSave={handleSubmitContact(contact)}>
        <Row className="g-0">

          <Col >
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label" for="validationCustom01">linked In</Label>
              <Col md="9">
                <input
                  className="form-control"
                  id="linkedIn"
                  type="url"
                  name="LinkedIn"
                  placeholder="Linked In"
                  {...registerContact("LinkedIn", {
                    required: true,
                    validate: {
                      isValidURL: value => {
                        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
                        return regex.test(value) || "Please enter a valid URL";
                      }
                    }
                  })}
                />
              </Col>
              <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                {errorsContact.LinkedIn?.type === 'required' && 'LinkedIn link is required'}
                {errorsContact.LinkedIn?.type === 'isValidURL' && 'Please enter a valid URL'}
              </span>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label" for="validationCustom01">ProZ</Label>
              <Col md="9">
                <input
                  className="form-control"
                  id="ProZ"
                  type="url"
                  name="ProZ"
                  placeholder="ProZ"
                  {...registerContact("ProZ", {
                    required: true,
                    validate: {
                      isValidURL: value => {
                        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
                        return regex.test(value) || "Please enter a valid URL";
                      }
                    }
                  })} />

              </Col>
              <span style={{ color: '#dc3545', fontStyle: 'italic' }}>
                {errorsContact.ProZ?.type === 'required' && 'ProZ link is required'}
                {errorsContact.ProZ?.type === 'isValidURL' && 'Please enter a valid URL'}
              </span>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label" for="validationCustom01">other 1</Label>
              <Col md="9">
                <input
                  className="form-control"
                  id="other1"
                  type="url"
                  name="other1"
                  placeholder="other 1"
                  {...registerContact("other1", { required: false, })} />
              </Col>
            </FormGroup>
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label" for="validationCustom01">other 2</Label>
              <Col md="9">
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
            <FormGroup className="row">
              <Label className="col-sm-3 col-form-label" for="validationCustom01">other 3</Label>
              <Col md="9">
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