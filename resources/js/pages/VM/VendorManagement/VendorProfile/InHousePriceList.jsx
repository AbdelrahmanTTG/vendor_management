import React, { Fragment, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    Label,
    Row,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import { Btn, H5, Spinner } from "../../../../AbstractElements";
import Select from "react-select";
import { toast } from "react-toastify";
import SweetAlert from "sweetalert2";
import axiosClient from "../../../AxiosClint";
import { useForm, Controller } from "react-hook-form";

const InHousePriceList = (props) => {
    const basictoaster = (toastname, status) => {
        switch (toastname) {
            case "successToast":
                toast.success(status, { position: "top-right" });
                break;
            case "dangerToast":
                toast.error(status, { position: "top-right" });
                break;
            default:
        }
    };

    // Main form
    const {
        control: controlMain,
        register: registerMain,
        handleSubmit: handleSubmitMain,
        setValue: setValueMain,
    } = useForm();

    // Language modal form
    const {
        control: controlLang,
        handleSubmit: handleSubmitLang,
        setValue: setValueLang,
        reset: resetLang,
    } = useForm();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [priceListData, setPriceListData] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [optionsCurrency, setOptionsCurrency] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});

    // Language modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [currentLanguageIndex, setCurrentLanguageIndex] = useState(null);
    const [optionsSourceLang, setOptionsSourceLang] = useState([]);
    const [optionsTargetLang, setOptionsTargetLang] = useState([]);
    const [optionsSourceDialect, setOptionsSourceDialect] = useState([]);
    const [optionsTargetDialect, setOptionsTargetDialect] = useState([]);
    const [submittingLanguage, setSubmittingLanguage] = useState(false);

    const toggleCollapse = () => setIsOpen(!isOpen);
    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (modalOpen) {
            resetLang();
            setCurrentLanguage(null);
            setCurrentLanguageIndex(null);
        }
    };

    const handleInputChange = (
        inputValue,
        tableName,
        fieldName,
        setOptions,
        options,
    ) => {
        if (inputValue.length === 0) {
            setOptions(initialOptions[fieldName] || []);
        } else if (inputValue.length >= 1) {
            const existingOption = options.some((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase()),
            );
            if (!existingOption) {
                handelingSelect(tableName, setOptions, fieldName, inputValue);
            }
        }
    };

    const handelingSelect = async (
        tablename,
        setOptions,
        fieldName,
        searchTerm = "",
    ) => {
        if (!tablename) return;
        try {
            const { data } = await axiosClient.get("SelectDatat", {
                params: {
                    search: searchTerm,
                    table: tablename,
                },
            });
            const formattedOptions = data.map((item) => ({
                value: item.id,
                label: item.name || item.dialect,
            }));

            setOptions(formattedOptions);
            if (!searchTerm) {
                setInitialOptions((prev) => ({
                    ...prev,
                    [fieldName]: formattedOptions,
                }));
            }
        } catch (err) {
            console.error("Error fetching select data:", err);
        }
    };

    useEffect(() => {
        if (props.id) {
            fetchData();
        }
    }, [props.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.post("/in-house/get-data", {
                vendor_id: props.id,
            });

            if (data.priceList) {
                setPriceListData(data.priceList);
                setValueMain("quota_hours", data.priceList.quota_hours);
                setValueMain("salary", data.priceList.salary);

                if (data.priceList.currency_relation) {
                    const currency = {
                        value: data.priceList.currency_relation.id,
                        label: data.priceList.currency_relation.name,
                    };
                    setSelectedCurrency(currency);
                    setValueMain("currency", currency.value);
                }
            }

            if (data.languages) {
                setLanguages(data.languages);
            }
        } catch (err) {
            console.error("Error fetching in house data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Save main data (currency, quota, salary)
    const onSubmitMain = async (formData) => {
        if (!props.backPermissions?.add && !props.backPermissions?.edit) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to perform this action.",
            );
            return;
        }

        setSubmitting(true);

        const payload = {
            vendor_id: props.id,
            currency: formData.currency,
            quota_hours: formData.quota_hours,
            salary: formData.salary,
        };

        try {
            const { data } = await axiosClient.post(
                "/in-house/save-main-data",
                payload,
            );
            basictoaster("successToast", data.message);
            setPriceListData(data.priceList);

            // Update currency display
            if (data.priceList.currency_relation) {
                const currency = {
                    value: data.priceList.currency_relation.id,
                    label: data.priceList.currency_relation.name,
                };
                setSelectedCurrency(currency);
            }
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                if (typeof response.data === "object") {
                    Object.keys(response.data).forEach((key) => {
                        const messages = response.data[key];
                        if (Array.isArray(messages)) {
                            messages.forEach((message) => {
                                basictoaster("dangerToast", message);
                            });
                        }
                    });
                } else {
                    basictoaster("dangerToast", response.data.message);
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Open modal to add language
    const openAddLanguageModal = () => {
        setModalMode("add");
        resetLang();
        toggleModal();
    };

    // Open modal to edit language
    const openEditLanguageModal = (language, index) => {
        setModalMode("edit");
        setCurrentLanguage(language);
        setCurrentLanguageIndex(index);

        // Set form values
        const sourceLang = {
            value: language.source_language,
            label: language.source_language_relation?.name || "",
        };
        const targetLang = {
            value: language.target_language,
            label: language.target_language_relation?.name || "",
        };

        setValueLang("source_language", sourceLang);
        setValueLang("target_language", targetLang);

        if (language.source_dialect) {
            const sourceDialect = {
                value: language.source_dialect,
                label: language.source_dialect_relation?.dialect || "",
            };
            setValueLang("source_dialect", sourceDialect);
        }

        if (language.target_dialect) {
            const targetDialect = {
                value: language.target_dialect,
                label: language.target_dialect_relation?.dialect || "",
            };
            setValueLang("target_dialect", targetDialect);
        }

        toggleModal();
    };

    // Submit language (add or edit)
    const onSubmitLanguage = async (formData) => {
        if (!props.backPermissions?.add && !props.backPermissions?.edit) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to perform this action.",
            );
            return;
        }

        setSubmittingLanguage(true);

        const payload = {
            vendor_id: props.id,
            source_language: formData.source_language.value,
            target_language: formData.target_language.value,
            source_dialect: formData.source_dialect?.value || null,
            target_dialect: formData.target_dialect?.value || null,
        };

        // If editing, add language id
        if (modalMode === "edit" && currentLanguage) {
            payload.id = currentLanguage.id;
        }

        try {
            const endpoint =
                modalMode === "add"
                    ? "/in-house/add-language"
                    : "/in-house/update-language";

            const { data } = await axiosClient.post(endpoint, payload);
            basictoaster("successToast", data.message);

            // Update languages list with new data
            if (modalMode === "add") {
                setLanguages([...languages, data.language]);
            } else {
                const updatedLanguages = [...languages];
                updatedLanguages[currentLanguageIndex] = data.language;
                setLanguages(updatedLanguages);
            }

            toggleModal();
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                if (typeof response.data === "object") {
                    Object.keys(response.data).forEach((key) => {
                        const messages = response.data[key];
                        if (Array.isArray(messages)) {
                            messages.forEach((message) => {
                                basictoaster("dangerToast", message);
                            });
                        }
                    });
                } else {
                    basictoaster("dangerToast", response.data.message);
                }
            }
        } finally {
            setSubmittingLanguage(false);
        }
    };

    // Delete language
    const deleteLanguage = async (language, index) => {
        if (!props.backPermissions?.delete) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to delete.",
            );
            return;
        }

        SweetAlert.fire({
            title: "Are you sure?",
            text: "Do you want to delete this language pair?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosClient.delete("/in-house/delete-language", {
                        data: { id: language.id },
                    });
                    const updatedLanguages = languages.filter(
                        (_, i) => i !== index,
                    );
                    setLanguages(updatedLanguages);
                    basictoaster(
                        "successToast",
                        "Language pair deleted successfully",
                    );
                } catch (err) {
                    const response = err.response;
                    if (response && response.data) {
                        basictoaster(
                            "dangerToast",
                            response.data.message || "Error deleting language",
                        );
                    }
                }
            }
        });
    };

    const onErrorMain = (errors) => {
        if (errors.currency) {
            basictoaster("dangerToast", "Currency is required");
        } else if (errors.quota_hours) {
            basictoaster("dangerToast", "Quota Hours is required");
        } else if (errors.salary) {
            basictoaster("dangerToast", "Salary is required");
        }
    };

    const onErrorLanguage = (errors) => {
        if (errors.source_language) {
            basictoaster("dangerToast", "Source Language is required");
        } else if (errors.target_language) {
            basictoaster("dangerToast", "Target Language is required");
        }
    };

    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>In House Price List</H5>
                    <i
                        className={`icon-angle-${isOpen ? "down" : "left"}`}
                        style={{ fontSize: "24px" }}
                    ></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        {loading ? (
                            <div className="loader-box">
                                <Spinner
                                    attrSpinner={{ className: "loader-6" }}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Main Data Section */}
                                <Row className="g-3 mb-4">
                                    <Col md="12">
                                        <H5 className="mb-3">
                                            Basic Information
                                        </H5>
                                    </Col>
                                    <Col md="4">
                                        <Label className="form-label">
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Currency
                                        </Label>
                                        <Controller
                                            name="currency"
                                            control={controlMain}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    value={selectedCurrency}
                                                    options={optionsCurrency}
                                                    onInputChange={(
                                                        inputValue,
                                                    ) =>
                                                        handleInputChange(
                                                            inputValue,
                                                            "currency",
                                                            "Currency",
                                                            setOptionsCurrency,
                                                            optionsCurrency,
                                                        )
                                                    }
                                                    className="js-example-basic-single"
                                                    isSearchable
                                                    onChange={(option) => {
                                                        setSelectedCurrency(
                                                            option,
                                                        );
                                                        field.onChange(
                                                            option.value,
                                                        );
                                                    }}
                                                    isDisabled={
                                                        !props.backPermissions
                                                            ?.add &&
                                                        !props.backPermissions
                                                            ?.edit
                                                    }
                                                />
                                            )}
                                        />
                                    </Col>
                                    <Col md="4">
                                        <Label className="form-label">
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Quota Hours
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            min="0"
                                            {...registerMain("quota_hours", {
                                                required: true,
                                            })}
                                            placeholder="Quota Hours"
                                            disabled={
                                                !props.backPermissions?.add &&
                                                !props.backPermissions?.edit
                                            }
                                        />
                                    </Col>
                                    <Col md="4">
                                        <Label className="form-label">
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "18px",
                                                }}
                                            >
                                                *
                                            </span>{" "}
                                            Salary
                                        </Label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...registerMain("salary", {
                                                required: true,
                                            })}
                                            placeholder="Salary"
                                            disabled={
                                                !props.backPermissions?.add &&
                                                !props.backPermissions?.edit
                                            }
                                        />
                                    </Col>
                                    {(props.backPermissions?.add ||
                                        props.backPermissions?.edit) && (
                                        <Col md="12">
                                            <div className="d-flex justify-content-end">
                                                <Btn
                                                    attrBtn={{
                                                        color: "primary",
                                                        disabled: submitting,
                                                        onClick:
                                                            handleSubmitMain(
                                                                onSubmitMain,
                                                                onErrorMain,
                                                            ),
                                                    }}
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <Spinner size="sm" />{" "}
                                                            Saving...
                                                        </>
                                                    ) : priceListData ? (
                                                        "Update"
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </Btn>
                                            </div>
                                        </Col>
                                    )}
                                </Row>

                                <hr />

                                {/* Languages Section */}
                                <Row className="g-3 mb-3">
                                    <Col md="12">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <H5>Language Pairs</H5>
                                            {(props.backPermissions?.add ||
                                                props.backPermissions
                                                    ?.edit) && (
                                                <Btn
                                                    attrBtn={{
                                                        color: "btn btn-success",
                                                        onClick:
                                                            openAddLanguageModal,
                                                    }}
                                                >
                                                    <i className="icofont icofont-plus"></i>{" "}
                                                    Add Language
                                                </Btn>
                                            )}
                                        </div>

                                        <div className="table-responsive">
                                            <Table hover bordered>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Source Language</th>
                                                        <th>Source Dialect</th>
                                                        <th>Target Language</th>
                                                        <th>Target Dialect</th>
                                                        {(props.backPermissions
                                                            ?.edit ||
                                                            props
                                                                .backPermissions
                                                                ?.delete) && (
                                                            <th>Actions</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {languages.length > 0 ? (
                                                        languages.map(
                                                            (lang, index) => (
                                                                <tr
                                                                    key={
                                                                        lang.id ||
                                                                        index
                                                                    }
                                                                >
                                                                    <td>
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td>
                                                                        {lang
                                                                            .source_language_relation
                                                                            ?.name ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        {lang
                                                                            .source_dialect_relation
                                                                            ?.dialect ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        {lang
                                                                            .target_language_relation
                                                                            ?.name ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        {lang
                                                                            .target_dialect_relation
                                                                            ?.dialect ||
                                                                            "-"}
                                                                    </td>
                                                                    {(props
                                                                        .backPermissions
                                                                        ?.edit ||
                                                                        props
                                                                            .backPermissions
                                                                            ?.delete) && (
                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                {props
                                                                                    .backPermissions
                                                                                    ?.edit && (
                                                                                    <Btn
                                                                                        attrBtn={{
                                                                                            color: "btn btn-warning btn-sm",
                                                                                            onClick:
                                                                                                () =>
                                                                                                    openEditLanguageModal(
                                                                                                        lang,
                                                                                                        index,
                                                                                                    ),
                                                                                        }}
                                                                                    >
                                                                                        <i className="icofont icofont-ui-edit"></i>
                                                                                    </Btn>
                                                                                )}
                                                                                {props
                                                                                    .backPermissions
                                                                                    ?.delete && (
                                                                                    <Btn
                                                                                        attrBtn={{
                                                                                            color: "btn btn-danger btn-sm",
                                                                                            onClick:
                                                                                                () =>
                                                                                                    deleteLanguage(
                                                                                                        lang,
                                                                                                        index,
                                                                                                    ),
                                                                                        }}
                                                                                    >
                                                                                        <i className="icofont icofont-ui-delete"></i>
                                                                                    </Btn>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            ),
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan="6"
                                                                className="text-center"
                                                            >
                                                                No language
                                                                pairs added yet
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </CardBody>
                </Collapse>
            </Card>

            {/* Language Modal */}
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>
                    {modalMode === "add"
                        ? "Add Language Pair"
                        : "Edit Language Pair"}
                </ModalHeader>
                <ModalBody>
                    <Row className="g-3">
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Source Language
                            </Label>
                            <Controller
                                name="source_language"
                                control={controlLang}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsSourceLang}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "languages",
                                                "SourceLang",
                                                setOptionsSourceLang,
                                                optionsSourceLang,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        placeholder="Select Source Language"
                                    />
                                )}
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">Source Dialect</Label>
                            <Controller
                                name="source_dialect"
                                control={controlLang}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsSourceDialect}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "dialect",
                                                "SourceDialect",
                                                setOptionsSourceDialect,
                                                optionsSourceDialect,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        isClearable
                                        placeholder="Select Source Dialect (Optional)"
                                    />
                                )}
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Target Language
                            </Label>
                            <Controller
                                name="target_language"
                                control={controlLang}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsTargetLang}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "languages",
                                                "TargetLang",
                                                setOptionsTargetLang,
                                                optionsTargetLang,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        placeholder="Select Target Language"
                                    />
                                )}
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">Target Dialect</Label>
                            <Controller
                                name="target_dialect"
                                control={controlLang}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsTargetDialect}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "dialect",
                                                "TargetDialect",
                                                setOptionsTargetDialect,
                                                optionsTargetDialect,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        isClearable
                                        placeholder="Select Target Dialect (Optional)"
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Btn
                        attrBtn={{
                            color: "secondary",
                            onClick: toggleModal,
                        }}
                    >
                        Cancel
                    </Btn>
                    <Btn
                        attrBtn={{
                            color: "primary",
                            disabled: submittingLanguage,
                            onClick: handleSubmitLang(
                                onSubmitLanguage,
                                onErrorLanguage,
                            ),
                        }}
                    >
                        {submittingLanguage ? (
                            <>
                                <Spinner size="sm" /> Saving...
                            </>
                        ) : modalMode === "add" ? (
                            "Add"
                        ) : (
                            "Update"
                        )}
                    </Btn>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default InHousePriceList;
