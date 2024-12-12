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

const PriceList = (props) => {
    const LazyWrapper = ({ children }) => (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
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
    // const handleClick = (data) => {
    //     if (props.onSubmit === 'onSubmit') {
    //         onSubmit(data);
    //     } else if (props.onSubmit === 'onUpdate') {
    //         Update(data)
    //     }
    // };
    const onSubmit = async (data) => {
        const formDate = Object.entries(data?.tool).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return { tool: value.value };
            }
            return { tool: value };
        });

       const newData = {
            tool: formDate,
           vendor_id : props?.id

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
                                <Label className="form-label" for="validationCustom01">Tools</Label>
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

                                        />
                                    )}
                                />

                            </Col>
                            <Col md="2" className="mb-3 d-flex flex-column justify-content-end align-items-center">
                                <Btn attrBtn={{ onClick: handleSubmit(onSubmit) }}>Save</Btn>
                            </Col>


                        </Row>
                        <Col md="12" className="d-flex justify-content-end mb-3">
                            <LazyWrapper>
                                <Model currency={props.Currency} id={props.id} getData={getData} />
                            </LazyWrapper>
                        </Col>
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
                                    <th cope="col">{'Status'} </th>
                                    <th cope="col">{'Edit'}</th>
                                    <th cope="col">{'Delete'}</th>
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
                                        <td>{item?.Status}</td>
                                        <td><LazyWrapper><ModelEdit data={item} getData={getData} /></LazyWrapper></td>
                                        <td><Btn attrBtn={{ color: 'btn btn-danger-gradien', onClick: () => deleteRow(item?.id) }} className="me-2" ><i className="icofont icofont-ui-delete"></i></Btn></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default PriceList;