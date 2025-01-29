import React, { Fragment, useState ,useEffect} from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, FormGroup } from 'reactstrap';
import { H5, Spinner ,Btn} from '../../../../AbstractElements';
import Select from 'react-select';
import { useForm, Controller, set } from 'react-hook-form';
import axiosClient from "../../../AxiosClint";
import { toast } from 'react-toastify';
const Education = (props) => {
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
    const [isOpen, setIsOpen] = useState(true);
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [optionsMaj, setoptionsMaj] = useState([]);
    const [optionsLD, setoptionsLD] = useState([]);

    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
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
                label: item.name || item.gmt || item.dialect,
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
    const onSubmit = async (data) => {
        if (props?.mode == "edit" && !props.backPermissions?.edit) {
            basictoaster("dangerToast", " Oops! You are not authorized to edit this section .");
            return;
        }
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        if (props.id) {
            const formDate = Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return [key, value.value];
                    }
                    return [key, value];
                })
            );
            formDate['vendor_id'] = props.id;
            try {
                const response = await axiosClient.post("VendorEducation", formDate);
                basictoaster("successToast", isSubmitting || props?.mode == "edit" ? " Updated successfully !" : "Added successfully !");
                setIsSubmitting(true)
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
        } else {
            basictoaster("dangerToast", "Make sure to send your personal information first.");
            const section = document.getElementById("personal-data");
            section.scrollIntoView({ behavior: 'smooth' });
        }

    };
    const renameKeys = (obj, keysMap) => {
        if (!obj) { return }
        return Object?.keys(obj)?.reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {});
    };
    useEffect(() => {
        if (props.EducationVendor) {
            if (props.EducationVendor.EducationVendor) {
                const data = props.EducationVendor.EducationVendor
                setValue("university_name", data?.university_name)
                setValue("latest_degree", { value: data?.latest_degree, label: data?.latest_degree } )
                setValue("year_of_graduation", data?.year_of_graduation)
                setValue("major", data?.major)

            }
        }
    }, [props.EducationVendor])
    const onError = (errors) => {
        for (const [key, value] of Object.entries(errors)) {
            switch (key) {
                case "university_name":
                    basictoaster("dangerToast", "Institute name is required");
                    return;
                case "latest_degree":
                    basictoaster("dangerToast", "latest degree is required");
                    return;
                case "year_of_graduation":
                    basictoaster("dangerToast", "Year of graduation is required");
                    return;
                case "major":
                    basictoaster("dangerToast", "Major is required");
                    return;
                default:
                    break;
            }
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
                    <H5>Education</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Institute Name</Label>
                                    <Col sm="9">
                                        {/* <Input className="form-control" type="text" placeholder="University name" /> */}
                                        <input
                                            defaultValue=""
                                            className="form-control"
                                            type="text"
                                            name="university_name"
                                            {...register("university_name", { required: true })}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col md="6" className="mb-3">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> last Degree</Label>
                                    <Col sm="9">
                                        <Controller
                                            name="latest_degree"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value}
                                                    options={optionsLD}
                                                    onInputChange={(inputValue) =>
                                                        handleInputChange(inputValue, "University_Degree", "latest_degree", setoptionsLD, optionsLD)
                                                    }
                                                    className="js-example-basic-single col-sm-12"
                                                    isSearchable
                                                    noOptionsMessage={() => loading ? (
                                                        <div className="loader-box" >
                                                            <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                        </div>
                                                    ) : 'No options found'}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                    }}

                                                />
                                            )}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">
                                    <Label className="col-sm-3 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Year of graduation</Label>
                                    <Col sm="9">
                                        <input
                                            defaultValue=""
                                            className="form-control"
                                            type="text"
                                            name="year_of_graduation"
                                            {...register("year_of_graduation", { required: true })}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mb-3">
                                <FormGroup className="row">

                                    <Label className="col-sm-3 col-form-label" for="validationCustom01"><span style={{ color: 'red', fontSize: "18px" }}>*</span> Major</Label>
                                    <Col sm="9">
                                        <Col sm="9">
                                            <input
                                                defaultValue=""
                                                className="form-control"
                                                type="text"
                                                name="major"
                                                {...register("major", { required: true })}
                                            />
                                        </Col>
                                        {/* <Controller
                                            name="major"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={field.value}
                                                    options={optionsMaj}
                                                    onInputChange={(inputValue) =>
                                                        handleInputChange(inputValue, "major", "major", setoptionsMaj, optionsMaj)
                                                    }
                                                    className="js-example-basic-single col-sm-12"
                                                    isSearchable
                                                    noOptionsMessage={() => loading ? (
                                                        <div className="loader-box" >
                                                            <Spinner attrSpinner={{ className: 'loader-6' }} />
                                                        </div>
                                                    ) : 'No options found'}
                                                    onChange={(option) => {
                                                        field.onChange(option);
                                                    }}

                                                />
                                            )}
                                        /> */}
                                        </Col>
                                    </FormGroup>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: "2%" }}>
                            <Btn attrBtn={{ color: 'primary', onClick: handleSubmit(onSubmit, onError)}}>Submit</Btn>
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Education;