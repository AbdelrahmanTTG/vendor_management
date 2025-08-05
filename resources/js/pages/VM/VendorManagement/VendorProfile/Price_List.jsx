import React, { Fragment, useState, useEffect, Suspense } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Label, Row, Input, Table } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2';
import axiosClient from "../../../AxiosClint";
const Model = React.lazy(() => import('./models/modelAddPriceList'));
const ModelEdit = React.lazy(() => import('./models/modelEditPriceList'));
import { useForm, Controller } from 'react-hook-form';
import ErrorBoundary from "../../../../ErrorBoundary";

const PriceList = (props) => {
    const LazyWrapper = ({ children }) => (
          <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
            {children}
            </Suspense>
            </ErrorBoundary>
    );
    const [isOpen, setIsOpen] = useState(true);
    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [optionsT, setOptionsT] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialOptions, setInitialOptions] = useState({});
    const [dataPrice, setdataPrice] = useState(null);
    const [tools, setTools] = useState(null);
    const [selectedOptionC, setSelectedOptionC] = useState(null);
    const [optionsC, setOptionsC] = useState([]);
    const [loading2, setLoading2] = useState(false);
    const [rows, setRows] = useState(false);

    
    const getData = (newData) => {
        setdataPrice((prevData) => {
            const validData = Array.isArray(prevData) ? prevData : [];
            const index = validData.findIndex((item) => item.id === newData.id);
            if (index !== -1) {
                return validData.map((item, i) => (i === index ? newData : item));
            } else {
                return [...validData, newData];
            }
        });
        setRows(true)
    };

    const removeDataById = (id) => {
        setdataPrice(prevData => prevData.filter(item => item.id !== id));
    };
    useEffect(() => {
        if (props.priceList?.priceList && props.priceList?.priceList.length > 0) {
            setdataPrice(props.priceList.priceList[0]);
            const transformedArray = props.priceList.priceList[1]?.map(item => ({
                value: item.id,
                label: item.name
            }));
            setValue("tool", transformedArray)
        }

    }, [props.priceList]);

    const deleteRow = (id) => {
        if (id) {
            SweetAlert.fire({
                title: 'Are you sure?',
                text: `Do you want to delete that price list ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const success = await onDelete(id);
                    if (success) {
                        SweetAlert.fire(
                            'Deleted!',
                            `This price list has been deleted..`,
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
    };
    const onDelete = async (id) => {
        if (!props.backPermissions?.delete) {
            basictoaster("dangerToast", " Oops! You are not authorized to delete this section .");
            return;
        }
        try {
            const payload = {
                id: id,
            }
            const { data } = await axiosClient.delete("deletePricelist", { data: payload });
            removeDataById(id)
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
        // console.log(props.Currency)
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
        if (!props.backPermissions?.add) {
            basictoaster("dangerToast", " Oops! You are not authorized to add this section .");
            return;
        }
        const formDate = Object.entries(data?.tool).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return { tool: value.value };
            }
            return { tool: value };
        });

        const newData = {
            tool: formDate,
            vendor_id: props?.id

        }
        try {
            const response = await axiosClient.post("AddVendorstools", newData);
            console.log(response)
            // basictoaster("successToast", "Added successfully !");
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
    useEffect(() => {
        if (props.Currency) {
            setSelectedOptionC({ value: props?.Currency?.id, label: props?.Currency?.name })
        }

    }, [props.Currency]);
    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Vendor Price List</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <Col md="10" className="mb-3">
                                <Label className="form-label" for="validationCustom01">
                                {(props.backPermissions?.add == 1 || props.backPermissions?.edit == 1) &&
                                     <span style={{ color: 'red', fontSize: "18px" }}>*</span>
                                }
                                      Tools</Label>
                                {/* <Input className="form-control" type="text" placeholder="" /> */}
                                <Controller
                                    name="tool"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={optionsT}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "tools", "tool", setOptionsT, optionsT)
                                            }
                                            className="js-example-basic-single col-sm-11"
                                            isMulti
                                            onChange={(selectedOptions) => {
                                                const uniqueOptions = selectedOptions.filter((option, index, self) =>
                                                    index === self.findIndex((o) => o.value === option.value && o.label === option.label)
                                                );
                                                field.onChange(uniqueOptions);
                                            }}
                                            isDisabled={props.backPermissions?.add != 1&&props.backPermissions?.edit != 1}

                                        />
                                    )}
                                />

                            </Col>
                            {(props.backPermissions?.add == 1 || props.backPermissions?.edit == 1) &&
                            <Col md="2" className="mb-3 d-flex flex-column justify-content-end align-items-center">
                                <Btn attrBtn={{ onClick: handleSubmit(onSubmit) }}>Save</Btn>
                            </Col>
                                }


                        </Row>
                        <Col md="6" className="mb-3">
                            <Label className="col-sm-4 col-form-label" for="validationCustom01">
                            {(props.backPermissions?.add == 1 || props.backPermissions?.edit == 1) &&
                                <span style={{ color: 'red', fontSize: "18px" }}>*</span>
                            }
                                 Currency</Label>
                                <Col sm="8">
                                    <Controller
                                        name="currency"
                                        control={control}
                                        rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            value={selectedOptionC}
                                            options={optionsC}
                                            onInputChange={(inputValue) =>
                                                handleInputChange(inputValue, "currency", "Currency", setOptionsC, optionsC)
                                            }
                                            isDisabled={props?.Currency || rows}
                                            className="js-example-basic-single col-sm-12"
                                            isSearchable
                                            noOptionsMessage={() => loading2 ? (
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
                        </Col>
                        <Col md="12" className="d-flex justify-content-end mb-3">
                            {props.backPermissions?.add == 1 && selectedOptionC && (
                                <LazyWrapper>
                                    <Model currency={selectedOptionC} id={props.id} getData={getData} />
                                </LazyWrapper>
                            )}

                        </Col>
                        <div className="table-responsive">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th scope="col">{'#'}</th>
                                    <th cope="col">{"Main-Subject Matter"}</th>
                                    <th cope="col">{'Sub–Subject Matter'}</th>
                                    <th cope="col">{"Service"}</th>
                                    <th cope="col">{'Task Type'}</th>
                                    <th cope="col">{'Source-Target Language'} </th>
                                    <th cope="col">{"Unit"}</th>
                                    <th cope="col">{'Rate'}</th>
                                    <th cope="col">{'Currency'}</th>
                                    <th cope="col">{'brand'} </th>
                                    <th cope="col">{'Status'} </th>
                                    {props.backPermissions?.edit == 1 && (
                                        <th cope="col">{'Edit'}</th>
                                    )}
                                    {props.backPermissions?.delete == 1 && (
                                        <th cope="col">{'Delete'}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {dataPrice && dataPrice.length > 0 ? dataPrice.map((item, index) => (
                                    <tr key={item?.id}>
                                        <td>{index + 1}</td>
                                        <td>{item?.subject?.name}</td>
                                        <td>{item?.sub_subject?.name}</td>
                                        <td>{item?.service?.name}</td>
                                        <td>{item?.task_type?.name}</td>
                                        <td>{item?.source_lang?.name} - {item?.target_lang?.name}</td>
                                        <td>{item?.unit?.name}</td>
                                        <td>{item?.rate}</td>
                                        <td>{item?.currency?.name}</td>
                                        <td>{item?.sheet_brand?.name}</td>
                                        <td>
                                            {item?.Status == 0 ? "Active"
                                                : item?.Status == 1 ? "Not Active"
                                                    : item?.Status == 2 ? "Pending by PM"
                                                        : ""}
                                        </td>
                                        {props.backPermissions?.edit == 1 && (
                                            <td><LazyWrapper><ModelEdit currency={selectedOptionC} data={item} getData={getData} /></LazyWrapper></td>
                                        )}
                                        {props.backPermissions?.delete == 1 && (

                                            <td><Btn attrBtn={{ color: 'btn btn-danger-gradien', onClick: () => deleteRow(item?.id) }} className="me-2" ><i className="icofont icofont-ui-delete"></i></Btn></td>
                                        )}
                                        </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        </div>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default PriceList;