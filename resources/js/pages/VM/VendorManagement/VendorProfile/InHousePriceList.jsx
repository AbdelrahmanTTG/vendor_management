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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import { Btn, H5, Spinner } from "../../../../AbstractElements";
import Select from "react-select";
import { toast } from "react-toastify";
import SweetAlert from "sweetalert2";
import axiosClient from "../../../AxiosClint";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import classnames from "classnames";

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

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const {
        control: controlPriceList,
        register: registerPriceList,
        handleSubmit: handleSubmitPriceList,
        setValue: setValuePriceList,
        reset: resetPriceList,
        watch: watchPriceList,
    } = useForm({
        defaultValues: {
            languages: [],
        },
    });

    const {
        fields: languageFields,
        append: appendLanguage,
        remove: removeLanguage,
    } = useFieldArray({
        control: controlPriceList,
        name: "languages",
    });

    const {
        control: controlLang,
        handleSubmit: handleSubmitLang,
        setValue: setValueLang,
        reset: resetLang,
    } = useForm();

    const {
        control: controlUnit,
        handleSubmit: handleSubmitUnit,
        setValue: setValueUnit,
        reset: resetUnit,
        register: registerUnit,
    } = useForm();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [priceLists, setPriceLists] = useState([]);
    const [unitConversions, setUnitConversions] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [optionsCurrency, setOptionsCurrency] = useState([]);
    const [initialOptions, setInitialOptions] = useState({});

    const [priceListModalOpen, setPriceListModalOpen] = useState(false);
    const [priceListMode, setPriceListMode] = useState("add");
    const [currentPriceList, setCurrentPriceList] = useState(null);
    const [currentPriceListIndex, setCurrentPriceListIndex] = useState(null);

    const [languageModalOpen, setLanguageModalOpen] = useState(false);
    const [languageMode, setLanguageMode] = useState("add");
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [currentLanguageIndex, setCurrentLanguageIndex] = useState(null);
    const [selectedPriceListForLanguage, setSelectedPriceListForLanguage] =
        useState(null);
    const [optionsSourceLang, setOptionsSourceLang] = useState([]);
    const [optionsTargetLang, setOptionsTargetLang] = useState([]);
    const [optionsSourceDialect, setOptionsSourceDialect] = useState([]);
    const [optionsTargetDialect, setOptionsTargetDialect] = useState([]);
    const [submittingLanguage, setSubmittingLanguage] = useState(false);

    const [unitModalOpen, setUnitModalOpen] = useState(false);
    const [unitMode, setUnitMode] = useState("add");
    const [currentUnit, setCurrentUnit] = useState(null);
    const [currentUnitIndex, setCurrentUnitIndex] = useState(null);
    const [optionsTaskType, setOptionsTaskType] = useState([]);
    const [optionsUnitFrom, setOptionsUnitFrom] = useState([]);
    const [submittingUnit, setSubmittingUnit] = useState(false);

    const [activeTab, setActiveTab] = useState("1");
    const [expandedPriceList, setExpandedPriceList] = useState(null);

    const [tempLanguageLists, setTempLanguageLists] = useState({});

    const toggleCollapse = () => setIsOpen(!isOpen);

    const togglePriceListModal = () => {
        setPriceListModalOpen(!priceListModalOpen);
        if (priceListModalOpen) {
            resetPriceList({ languages: [] });
            setCurrentPriceList(null);
            setCurrentPriceListIndex(null);
            setSelectedCurrency(null);
            setTempLanguageLists({});
        }
    };

    const toggleLanguageModal = () => {
        setLanguageModalOpen(!languageModalOpen);
        if (languageModalOpen) {
            resetLang();
            setCurrentLanguage(null);
            setCurrentLanguageIndex(null);
            setSelectedPriceListForLanguage(null);
        }
    };

    const toggleUnitModal = () => {
        setUnitModalOpen(!unitModalOpen);
        if (unitModalOpen) {
            resetUnit();
            setCurrentUnit(null);
            setCurrentUnitIndex(null);
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

            if (data.priceLists) {
                setPriceLists(data.priceLists);
            }

            if (data.unitConversions) {
                setUnitConversions(data.unitConversions);
            }
        } catch (err) {
            console.error("Error fetching in house data:", err);
        } finally {
            setLoading(false);
        }
    };

    const openAddPriceListModal = () => {
        setPriceListMode("add");
        resetPriceList({ languages: [] });
        setSelectedCurrency(null);
        setTempLanguageLists({});
        togglePriceListModal();
    };

    const openEditPriceListModal = (priceList, index) => {
        setPriceListMode("edit");
        setCurrentPriceList(priceList);
        setCurrentPriceListIndex(index);

        setValuePriceList("quota_hours", priceList.quota_hours);
        setValuePriceList("salary", priceList.salary);
        setValuePriceList("start_date", formatDate(priceList.start_date));
        setValuePriceList("end_date", formatDate(priceList.end_date));
        setValuePriceList("is_active", priceList.is_active);

        if (priceList.currency_relation) {
            const currency = {
                value: priceList.currency_relation.id,
                label: priceList.currency_relation.name,
            };
            setSelectedCurrency(currency);
            setValuePriceList("currency", currency.value);
        }

        togglePriceListModal();
    };

    const onSubmitPriceList = async (formData) => {
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
            start_date: formData.start_date,
            end_date: formData.end_date,
            is_active: formData.is_active || false,
        };

        if (
            priceListMode === "add" &&
            formData.languages &&
            formData.languages.length > 0
        ) {
            payload.languages = formData.languages.map((lang) => ({
                source_language:
                    lang.source_language?.value || lang.source_language,
                target_language:
                    lang.target_language?.value || lang.target_language,
                source_dialect:
                    lang.source_dialect?.value || lang.source_dialect || null,
                target_dialect:
                    lang.target_dialect?.value || lang.target_dialect || null,
            }));
        }

        if (priceListMode === "edit" && currentPriceList) {
            payload.id = currentPriceList.id;
        }

        try {
            const endpoint =
                priceListMode === "add"
                    ? "/in-house/save-price-list"
                    : "/in-house/update-price-list";

            const { data } = await axiosClient.post(endpoint, payload);
            basictoaster("successToast", data.message);

            if (priceListMode === "add") {
                setPriceLists([data.priceList, ...priceLists]);
            } else {
                const updatedPriceLists = [...priceLists];
                updatedPriceLists[currentPriceListIndex] = data.priceList;
                setPriceLists(updatedPriceLists);
            }

            togglePriceListModal();
        } catch (err) {
            const response = err.response;

            if (!response) {
                basictoaster("dangerToast", "Network error");
                return;
            }

            const { status, data } = response;

            if (status === 422 && typeof data === "object") {
                Object.values(data).forEach((messages) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) =>
                            basictoaster("dangerToast", msg),
                        );
                    }
                });
                return;
            }

            if (data?.message) {
                basictoaster("dangerToast", data.message);
                return;
            }

            if (data?.error) {
                basictoaster("dangerToast", data.error);
                return;
            }

            basictoaster("dangerToast", "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const deletePriceList = async (priceList, index) => {
        if (!props.backPermissions?.delete) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to delete.",
            );
            return;
        }

        SweetAlert.fire({
            title: "Are you sure?",
            text: "Do you want to delete this price list?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosClient.delete("/in-house/delete-price-list", {
                        data: { id: priceList.id },
                    });
                    const updatedPriceLists = priceLists.filter(
                        (_, i) => i !== index,
                    );
                    setPriceLists(updatedPriceLists);
                    basictoaster(
                        "successToast",
                        "Price list deleted successfully",
                    );
                } catch (err) {
                    const response = err.response;
                    if (response && response.data) {
                        basictoaster(
                            "dangerToast",
                            response.data.message ||
                                "Error deleting price list",
                        );
                    }
                }
            }
        });
    };

    const togglePriceListStatus = async (priceList, index) => {
        if (!props.backPermissions?.edit) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to perform this action.",
            );
            return;
        }

        try {
            const { data } = await axiosClient.post(
                "/in-house/toggle-price-list-status",
                { id: priceList.id },
            );
            basictoaster("successToast", data.message);

            const updatedPriceLists = [...priceLists];
            updatedPriceLists[index] = {
                ...updatedPriceLists[index],
                ...data.priceList,
                currency_relation: updatedPriceLists[index].currency_relation,
                languages: updatedPriceLists[index].languages,
            };
            setPriceLists(updatedPriceLists);
        } catch (err) {
            const response = err.response;
            if (response && response.data) {
                basictoaster(
                    "dangerToast",
                    response.data.message || "Error updating status",
                );
            }
        }
    };

    const openAddLanguageModal = (priceList) => {
        setLanguageMode("add");
        setSelectedPriceListForLanguage(priceList);
        resetLang();
        toggleLanguageModal();
    };

    const openEditLanguageModal = (priceList, language, langIndex) => {
        setLanguageMode("edit");
        setSelectedPriceListForLanguage(priceList);
        setCurrentLanguage(language);
        setCurrentLanguageIndex(langIndex);

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

        toggleLanguageModal();
    };

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
            price_list_id: selectedPriceListForLanguage.id,
            source_language: formData.source_language.value,
            target_language: formData.target_language.value,
            source_dialect: formData.source_dialect?.value || null,
            target_dialect: formData.target_dialect?.value || null,
        };

        if (languageMode === "edit" && currentLanguage) {
            payload.id = currentLanguage.id;
        }

        try {
            const endpoint =
                languageMode === "add"
                    ? "/in-house/add-language"
                    : "/in-house/update-language";

            const { data } = await axiosClient.post(endpoint, payload);
            basictoaster("successToast", data.message);

            const updatedPriceLists = [...priceLists];
            const priceListIndex = updatedPriceLists.findIndex(
                (pl) => pl.id === selectedPriceListForLanguage.id,
            );

            if (languageMode === "add") {
                if (!updatedPriceLists[priceListIndex].languages) {
                    updatedPriceLists[priceListIndex].languages = [];
                }
                updatedPriceLists[priceListIndex].languages.push(data.language);
            } else {
                updatedPriceLists[priceListIndex].languages[
                    currentLanguageIndex
                ] = data.language;
            }

            setPriceLists(updatedPriceLists);
            toggleLanguageModal();
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

    const deleteLanguage = async (priceList, language, langIndex) => {
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

                    const updatedPriceLists = [...priceLists];
                    const priceListIndex = updatedPriceLists.findIndex(
                        (pl) => pl.id === priceList.id,
                    );
                    updatedPriceLists[priceListIndex].languages =
                        updatedPriceLists[priceListIndex].languages.filter(
                            (_, i) => i !== langIndex,
                        );

                    setPriceLists(updatedPriceLists);
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

    const openAddUnitModal = () => {
        setUnitMode("add");
        resetUnit();
        toggleUnitModal();
    };

    const openEditUnitModal = (unit, index) => {
        setUnitMode("edit");
        setCurrentUnit(unit);
        setCurrentUnitIndex(index);

        setValueUnit("value_from", unit.value_from);
        setValueUnit("value_to", unit.value_to);

        if (unit.task_type) {
            const taskType = {
                value: unit.task_type.id,
                label: unit.task_type.name,
            };
            setValueUnit("task_type_id", taskType);
        }

        if (unit.unit_from_relation) {
            const unitFrom = {
                value: unit.unit_from_relation.id,
                label: unit.unit_from_relation.name,
            };
            setValueUnit("unit_from", unitFrom);
        }

        toggleUnitModal();
    };

    const onSubmitUnit = async (formData) => {
        if (!props.backPermissions?.add && !props.backPermissions?.edit) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to perform this action.",
            );
            return;
        }

        setSubmittingUnit(true);

        const payload = {
            vendor_id: props.id,
            task_type_id: formData.task_type_id.value,
            unit_from: formData.unit_from.value,
            unit_to: 1,
            value_from: formData.value_from,
            value_to: formData.value_to,
        };

        if (unitMode === "edit" && currentUnit) {
            payload.id = currentUnit.id;
        }

        try {
            const endpoint =
                unitMode === "add"
                    ? "/in-house/save-unit-conversion"
                    : "/in-house/update-unit-conversion";

            const { data } = await axiosClient.post(endpoint, payload);
            basictoaster("successToast", data.message);

            if (unitMode === "add") {
                setUnitConversions([...unitConversions, data.conversion]);
            } else {
                const updatedUnits = [...unitConversions];
                updatedUnits[currentUnitIndex] = data.conversion;
                setUnitConversions(updatedUnits);
            }

            toggleUnitModal();
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
            setSubmittingUnit(false);
        }
    };

    const deleteUnit = async (unit, index) => {
        if (!props.backPermissions?.delete) {
            basictoaster(
                "dangerToast",
                "Oops! You are not authorized to delete.",
            );
            return;
        }

        SweetAlert.fire({
            title: "Are you sure?",
            text: "Do you want to delete this unit conversion?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosClient.delete(
                        "/in-house/delete-unit-conversion",
                        {
                            data: { id: unit.id },
                        },
                    );
                    const updatedUnits = unitConversions.filter(
                        (_, i) => i !== index,
                    );
                    setUnitConversions(updatedUnits);
                    basictoaster(
                        "successToast",
                        "Unit conversion deleted successfully",
                    );
                } catch (err) {
                    const response = err.response;
                    if (response && response.data) {
                        basictoaster(
                            "dangerToast",
                            response.data.message ||
                                "Error deleting unit conversion",
                        );
                    }
                }
            }
        });
    };

    const onErrorPriceList = (errors) => {
        if (errors.currency) {
            basictoaster("dangerToast", "Currency is required");
        } else if (errors.quota_hours) {
            basictoaster("dangerToast", "Quota Hours is required");
        } else if (errors.salary) {
            basictoaster("dangerToast", "Salary is required");
        } else if (errors.start_date) {
            basictoaster("dangerToast", "Start Date is required");
        } else if (errors.end_date) {
            basictoaster("dangerToast", "End Date is required");
        }
    };

    const onErrorLanguage = (errors) => {
        if (errors.source_language) {
            basictoaster("dangerToast", "Source Language is required");
        } else if (errors.target_language) {
            basictoaster("dangerToast", "Target Language is required");
        }
    };

    const onErrorUnit = (errors) => {
        if (errors.task_type_id) {
            basictoaster("dangerToast", "Task Type is required");
        } else if (errors.unit_from) {
            basictoaster("dangerToast", "Unit From is required");
        } else if (errors.value_from) {
            basictoaster("dangerToast", "Value From is required");
        } else if (errors.value_to) {
            basictoaster("dangerToast", "Value To is required");
        }
    };

    const toggleExpandPriceList = (priceListId) => {
        setExpandedPriceList(
            expandedPriceList === priceListId ? null : priceListId,
        );
    };

    return (
        <Fragment>
            <Card>
                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: "pointer", paddingBottom: "25px" }}
                >
                    <H5>In House Price List & Unit Conversions to Hours</H5>
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
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === "1",
                                            })}
                                            onClick={() => setActiveTab("1")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Price Lists
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: activeTab === "2",
                                            })}
                                            onClick={() => setActiveTab("2")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Unit Conversions
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <Row className="g-3 mt-3">
                                            <Col md="12">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <H5>Price Lists</H5>
                                                    {(props.backPermissions
                                                        ?.add ||
                                                        props.backPermissions
                                                            ?.edit) && (
                                                        <Btn
                                                            attrBtn={{
                                                                color: "btn btn-success",
                                                                onClick:
                                                                    openAddPriceListModal,
                                                            }}
                                                        >
                                                            <i className="icofont icofont-plus"></i>{" "}
                                                            Add Price List
                                                        </Btn>
                                                    )}
                                                </div>

                                                <div className="table-responsive">
                                                    <Table hover bordered>
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    style={{
                                                                        width: "50px",
                                                                    }}
                                                                >
                                                                    #
                                                                </th>
                                                                <th>
                                                                    Currency
                                                                </th>
                                                                <th>
                                                                    Quota Hours
                                                                </th>
                                                                <th>Salary</th>
                                                                <th>
                                                                    Start Date
                                                                </th>
                                                                <th>
                                                                    End Date
                                                                </th>
                                                                <th>Status</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {priceLists.length >
                                                            0 ? (
                                                                priceLists.map(
                                                                    (
                                                                        priceList,
                                                                        plIndex,
                                                                    ) => (
                                                                        <Fragment
                                                                            key={
                                                                                priceList.id
                                                                            }
                                                                        >
                                                                            <tr>
                                                                                <td>
                                                                                    {plIndex +
                                                                                        1}
                                                                                </td>
                                                                                <td>
                                                                                    {priceList
                                                                                        .currency_relation
                                                                                        ?.name ||
                                                                                        "-"}
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        priceList.quota_hours
                                                                                    }

                                                                                    h
                                                                                </td>
                                                                                <td>
                                                                                   
                                                                                    {
                                                                                        priceList.salary
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {formatDisplayDate(
                                                                                        priceList.start_date,
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {formatDisplayDate(
                                                                                        priceList.end_date,
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {priceList.is_active ? (
                                                                                        <span className="badge bg-success">
                                                                                            Active
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="badge bg-secondary">
                                                                                            Inactive
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    <div className="d-flex gap-2">
                                                                                        <Btn
                                                                                            attrBtn={{
                                                                                                color:
                                                                                                    expandedPriceList ===
                                                                                                    priceList.id
                                                                                                        ? "btn btn-info btn-sm"
                                                                                                        : "btn btn-outline-info btn-sm",
                                                                                                onClick:
                                                                                                    () =>
                                                                                                        toggleExpandPriceList(
                                                                                                            priceList.id,
                                                                                                        ),
                                                                                            }}
                                                                                        >
                                                                                            <i
                                                                                                className={`icofont icofont-${expandedPriceList === priceList.id ? "eye-blocked" : "eye-alt"}`}
                                                                                            ></i>
                                                                                        </Btn>
                                                                                        {props
                                                                                            .backPermissions
                                                                                            ?.edit && (
                                                                                            <>
                                                                                                <Btn
                                                                                                    attrBtn={{
                                                                                                        color: priceList.is_active
                                                                                                            ? "btn btn-secondary btn-sm"
                                                                                                            : "btn btn-success btn-sm",
                                                                                                        onClick:
                                                                                                            () =>
                                                                                                                togglePriceListStatus(
                                                                                                                    priceList,
                                                                                                                    plIndex,
                                                                                                                ),
                                                                                                    }}
                                                                                                >
                                                                                                    {priceList.is_active
                                                                                                        ? "Deactivate"
                                                                                                        : "Activate"}
                                                                                                </Btn>
                                                                                                <Btn
                                                                                                    attrBtn={{
                                                                                                        color: "btn btn-warning btn-sm",
                                                                                                        onClick:
                                                                                                            () =>
                                                                                                                openEditPriceListModal(
                                                                                                                    priceList,
                                                                                                                    plIndex,
                                                                                                                ),
                                                                                                    }}
                                                                                                >
                                                                                                    <i className="icofont icofont-ui-edit"></i>
                                                                                                </Btn>
                                                                                            </>
                                                                                        )}
                                                                                        {props
                                                                                            .backPermissions
                                                                                            ?.delete && (
                                                                                            <Btn
                                                                                                attrBtn={{
                                                                                                    color: "btn btn-danger btn-sm",
                                                                                                    onClick:
                                                                                                        () =>
                                                                                                            deletePriceList(
                                                                                                                priceList,
                                                                                                                plIndex,
                                                                                                            ),
                                                                                                }}
                                                                                            >
                                                                                                <i className="icofont icofont-ui-delete"></i>
                                                                                            </Btn>
                                                                                        )}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            {expandedPriceList ===
                                                                                priceList.id && (
                                                                                <tr>
                                                                                    <td
                                                                                        colSpan="8"
                                                                                        style={{
                                                                                            padding:
                                                                                                "0",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                padding:
                                                                                                    "15px",
                                                                                                backgroundColor:
                                                                                                    "#f8f9fa",
                                                                                            }}
                                                                                        >
                                                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                                <h6 className="mb-0">
                                                                                                    Languages
                                                                                                </h6>
                                                                                                {(props
                                                                                                    .backPermissions
                                                                                                    ?.add ||
                                                                                                    props
                                                                                                        .backPermissions
                                                                                                        ?.edit) && (
                                                                                                    <Btn
                                                                                                        attrBtn={{
                                                                                                            color: "btn btn-primary btn-sm",
                                                                                                            onClick:
                                                                                                                () =>
                                                                                                                    openAddLanguageModal(
                                                                                                                        priceList,
                                                                                                                    ),
                                                                                                        }}
                                                                                                    >
                                                                                                        <i className="icofont icofont-plus"></i>{" "}
                                                                                                        Add
                                                                                                        Language
                                                                                                    </Btn>
                                                                                                )}
                                                                                            </div>
                                                                                            <Table
                                                                                                hover
                                                                                                bordered
                                                                                                size="sm"
                                                                                                className="mb-0"
                                                                                            >
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th>
                                                                                                            #
                                                                                                        </th>
                                                                                                        <th>
                                                                                                            Source
                                                                                                            Language
                                                                                                        </th>
                                                                                                        <th>
                                                                                                            Source
                                                                                                            Dialect
                                                                                                        </th>
                                                                                                        <th>
                                                                                                            Target
                                                                                                            Language
                                                                                                        </th>
                                                                                                        <th>
                                                                                                            Target
                                                                                                            Dialect
                                                                                                        </th>
                                                                                                        {(props
                                                                                                            .backPermissions
                                                                                                            ?.edit ||
                                                                                                            props
                                                                                                                .backPermissions
                                                                                                                ?.delete) && (
                                                                                                            <th>
                                                                                                                Actions
                                                                                                            </th>
                                                                                                        )}
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {priceList.languages &&
                                                                                                    priceList
                                                                                                        .languages
                                                                                                        .length >
                                                                                                        0 ? (
                                                                                                        priceList.languages.map(
                                                                                                            (
                                                                                                                lang,
                                                                                                                langIndex,
                                                                                                            ) => (
                                                                                                                <tr
                                                                                                                    key={
                                                                                                                        lang.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    <td>
                                                                                                                        {langIndex +
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
                                                                                                                                                        priceList,
                                                                                                                                                        lang,
                                                                                                                                                        langIndex,
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
                                                                                                                                                        priceList,
                                                                                                                                                        lang,
                                                                                                                                                        langIndex,
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
                                                                                                                No
                                                                                                                languages
                                                                                                                added
                                                                                                                yet
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )}
                                                                                                </tbody>
                                                                                            </Table>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </Fragment>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td
                                                                        colSpan="8"
                                                                        className="text-center"
                                                                    >
                                                                        No price
                                                                        lists
                                                                        added
                                                                        yet
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>

                                    <TabPane tabId="2">
                                        <Row className="g-3 mt-3">
                                            <Col md="12">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <H5>Unit Conversions</H5>
                                                    {(props.backPermissions
                                                        ?.add ||
                                                        props.backPermissions
                                                            ?.edit) && (
                                                        <Btn
                                                            attrBtn={{
                                                                color: "btn btn-success",
                                                                onClick:
                                                                    openAddUnitModal,
                                                            }}
                                                        >
                                                            <i className="icofont icofont-plus"></i>{" "}
                                                            Add Unit Conversion
                                                        </Btn>
                                                    )}
                                                </div>

                                                <div className="table-responsive">
                                                    <Table hover bordered>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>
                                                                    Task Type
                                                                </th>
                                                                <th>
                                                                    Unit From
                                                                </th>
                                                                <th>
                                                                    Value From
                                                                </th>
                                                                <th>Unit To</th>
                                                                <th>
                                                                    Value To
                                                                    (Hours)
                                                                </th>
                                                                {(props
                                                                    .backPermissions
                                                                    ?.edit ||
                                                                    props
                                                                        .backPermissions
                                                                        ?.delete) && (
                                                                    <th>
                                                                        Actions
                                                                    </th>
                                                                )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {unitConversions.length >
                                                            0 ? (
                                                                unitConversions.map(
                                                                    (
                                                                        unit,
                                                                        index,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                unit.id
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {index +
                                                                                    1}
                                                                            </td>
                                                                            <td>
                                                                                {unit
                                                                                    .task_type
                                                                                    ?.name ||
                                                                                    "-"}
                                                                            </td>
                                                                            <td>
                                                                                {unit
                                                                                    .unit_from_relation
                                                                                    ?.name ||
                                                                                    "-"}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    unit.value_from
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                Hours
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    unit.value_to
                                                                                }
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
                                                                                                            openEditUnitModal(
                                                                                                                unit,
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
                                                                                                            deleteUnit(
                                                                                                                unit,
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
                                                                        colSpan="7"
                                                                        className="text-center"
                                                                    >
                                                                        No unit
                                                                        conversions
                                                                        added
                                                                        yet
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </>
                        )}
                    </CardBody>
                </Collapse>
            </Card>

            <Modal
                isOpen={priceListModalOpen}
                toggle={togglePriceListModal}
                size="lg"
            >
                <ModalHeader toggle={togglePriceListModal}>
                    {priceListMode === "add"
                        ? "Add Price List"
                        : "Edit Price List"}
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
                                Currency
                            </Label>
                            <Controller
                                name="currency"
                                control={controlPriceList}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={selectedCurrency}
                                        options={optionsCurrency}
                                        onInputChange={(inputValue) =>
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
                                            setSelectedCurrency(option);
                                            field.onChange(option.value);
                                        }}
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
                                Quota Hours
                            </Label>
                            <input
                                className="form-control"
                                type="number"
                                min="0"
                                {...registerPriceList("quota_hours", {
                                    required: true,
                                })}
                                placeholder="Quota Hours"
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
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
                                {...registerPriceList("salary", {
                                    required: true,
                                })}
                                placeholder="Salary"
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Start Date
                            </Label>
                            <input
                                className="form-control"
                                type="date"
                                {...registerPriceList("start_date", {
                                    required: true,
                                })}
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                End Date
                            </Label>
                            <input
                                className="form-control"
                                type="date"
                                {...registerPriceList("end_date", {
                                    required: true,
                                })}
                            />
                        </Col>
                        <Col md="6">
                            <Label
                                htmlFor="isActiveSwitch"
                                className="form-label"
                            >
                                Status
                            </Label>
                            <div>
                                <input
                                    type="checkbox"
                                    id="isActiveSwitch"
                                    {...registerPriceList("is_active")}
                                />
                                <Label
                                    htmlFor="isActiveSwitch"
                                    style={{ marginLeft: "8px" }}
                                >
                                    {watchPriceList("is_active")
                                        ? "Active"
                                        : "Inactive"}
                                </Label>
                            </div>
                        </Col>
                    </Row>

                    {priceListMode === "add" && (
                        <>
                            <hr className="my-4" />
                            <Row className="g-3">
                                <Col md="12">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">
                                            Languages (Optional)
                                        </h6>
                                        <Btn
                                            attrBtn={{
                                                color: "btn btn-primary btn-sm",
                                                onClick: () =>
                                                    appendLanguage({
                                                        source_language: null,
                                                        target_language: null,
                                                        source_dialect: null,
                                                        target_dialect: null,
                                                    }),
                                            }}
                                        >
                                            <i className="icofont icofont-plus"></i>{" "}
                                            Add Language
                                        </Btn>
                                    </div>

                                    {languageFields.map((field, index) => (
                                        <Card key={field.id} className="mb-3">
                                            <CardBody>
                                                <Row className="g-3">
                                                    <Col md="6">
                                                        <Label className="form-label">
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                    fontSize:
                                                                        "18px",
                                                                }}
                                                            >
                                                                *
                                                            </span>{" "}
                                                            Source Language
                                                        </Label>
                                                        <Controller
                                                            name={`languages.${index}.source_language`}
                                                            control={
                                                                controlPriceList
                                                            }
                                                            rules={{
                                                                required: true,
                                                            }}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Select
                                                                    {...field}
                                                                    options={
                                                                        optionsSourceLang
                                                                    }
                                                                    onInputChange={(
                                                                        inputValue,
                                                                    ) =>
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
                                                        <Label className="form-label">
                                                            Source Dialect
                                                        </Label>
                                                        <Controller
                                                            name={`languages.${index}.source_dialect`}
                                                            control={
                                                                controlPriceList
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Select
                                                                    {...field}
                                                                    options={
                                                                        optionsSourceDialect
                                                                    }
                                                                    onInputChange={(
                                                                        inputValue,
                                                                    ) =>
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
                                                                style={{
                                                                    color: "red",
                                                                    fontSize:
                                                                        "18px",
                                                                }}
                                                            >
                                                                *
                                                            </span>{" "}
                                                            Target Language
                                                        </Label>
                                                        <Controller
                                                            name={`languages.${index}.target_language`}
                                                            control={
                                                                controlPriceList
                                                            }
                                                            rules={{
                                                                required: true,
                                                            }}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Select
                                                                    {...field}
                                                                    options={
                                                                        optionsTargetLang
                                                                    }
                                                                    onInputChange={(
                                                                        inputValue,
                                                                    ) =>
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
                                                        <Label className="form-label">
                                                            Target Dialect
                                                        </Label>
                                                        <Controller
                                                            name={`languages.${index}.target_dialect`}
                                                            control={
                                                                controlPriceList
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Select
                                                                    {...field}
                                                                    options={
                                                                        optionsTargetDialect
                                                                    }
                                                                    onInputChange={(
                                                                        inputValue,
                                                                    ) =>
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
                                                    <Col md="12">
                                                        <Btn
                                                            attrBtn={{
                                                                color: "btn btn-danger btn-sm",
                                                                onClick: () =>
                                                                    removeLanguage(
                                                                        index,
                                                                    ),
                                                            }}
                                                        >
                                                            <i className="icofont icofont-ui-delete"></i>{" "}
                                                            Remove Language
                                                        </Btn>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </Col>
                            </Row>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Btn
                        attrBtn={{
                            color: "secondary",
                            onClick: togglePriceListModal,
                        }}
                    >
                        Cancel
                    </Btn>
                    <Btn
                        attrBtn={{
                            color: "primary",
                            disabled: submitting,
                            onClick: handleSubmitPriceList(
                                onSubmitPriceList,
                                onErrorPriceList,
                            ),
                        }}
                    >
                        {submitting ? (
                            <>
                                <Spinner size="sm" /> Saving...
                            </>
                        ) : priceListMode === "add" ? (
                            "Add"
                        ) : (
                            "Update"
                        )}
                    </Btn>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={languageModalOpen}
                toggle={toggleLanguageModal}
                size="lg"
            >
                <ModalHeader toggle={toggleLanguageModal}>
                    {languageMode === "add"
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
                            onClick: toggleLanguageModal,
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
                        ) : languageMode === "add" ? (
                            "Add"
                        ) : (
                            "Update"
                        )}
                    </Btn>
                </ModalFooter>
            </Modal>

            <Modal isOpen={unitModalOpen} toggle={toggleUnitModal} size="lg">
                <ModalHeader toggle={toggleUnitModal}>
                    {unitMode === "add"
                        ? "Add Unit Conversion"
                        : "Edit Unit Conversion"}
                </ModalHeader>
                <ModalBody>
                    <Row className="g-3">
                        <Col md="12">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Task Type
                            </Label>
                            <Controller
                                name="task_type_id"
                                control={controlUnit}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsTaskType}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "task_type",
                                                "TaskType",
                                                setOptionsTaskType,
                                                optionsTaskType,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        placeholder="Select Task Type"
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
                                Unit From
                            </Label>
                            <Controller
                                name="unit_from"
                                control={controlUnit}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={optionsUnitFrom}
                                        onInputChange={(inputValue) =>
                                            handleInputChange(
                                                inputValue,
                                                "unit",
                                                "UnitFrom",
                                                setOptionsUnitFrom,
                                                optionsUnitFrom,
                                            )
                                        }
                                        className="js-example-basic-single"
                                        isSearchable
                                        placeholder="Select Unit From"
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
                                Value From
                            </Label>
                            <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                min="0"
                                {...registerUnit("value_from", {
                                    required: true,
                                })}
                                placeholder="Value From"
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">Unit To</Label>
                            <input
                                className="form-control"
                                type="text"
                                value="Hours"
                                disabled
                                style={{ backgroundColor: "#e9ecef" }}
                            />
                        </Col>
                        <Col md="6">
                            <Label className="form-label">
                                <span
                                    style={{ color: "red", fontSize: "18px" }}
                                >
                                    *
                                </span>{" "}
                                Value To (Hours)
                            </Label>
                            <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                min="0"
                                {...registerUnit("value_to", {
                                    required: true,
                                })}
                                placeholder="Value To"
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Btn
                        attrBtn={{
                            color: "secondary",
                            onClick: toggleUnitModal,
                        }}
                    >
                        Cancel
                    </Btn>
                    <Btn
                        attrBtn={{
                            color: "primary",
                            disabled: submittingUnit,
                            onClick: handleSubmitUnit(
                                onSubmitUnit,
                                onErrorUnit,
                            ),
                        }}
                    >
                        {submittingUnit ? (
                            <>
                                <Spinner size="sm" /> Saving...
                            </>
                        ) : unitMode === "add" ? (
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
