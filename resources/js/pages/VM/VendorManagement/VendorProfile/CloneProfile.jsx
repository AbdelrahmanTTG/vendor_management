import React, { Fragment, useEffect, useState, Suspense } from "react";
import { Card, CardBody } from "reactstrap";
import { useLocation, Navigate } from "react-router-dom";
import { Spinner } from "../../../../AbstractElements";
const PersonalData = React.lazy(() => import("./PersonalData"));
const Messaging = React.lazy(() => import("./Messaging"));
const VMnote = React.lazy(() => import("./VMnote"));
const FilesCertificate = React.lazy(() => import("./FilesCertificate"));
const Education = React.lazy(() => import("./Education"));
const Experience = React.lazy(() => import("./Experience"));
const Price_List = React.lazy(() => import("./Price_List"));
const Evaluation = React.lazy(() => import("./Evaluation"));
const Feedback = React.lazy(() => import("./Feedback"));
const Vacation = React.lazy(() => import("./Vacation"));
const Test = React.lazy(() => import("./Test"));
const Billing = React.lazy(() => import("./Billing"));
const History = React.lazy(() => import("./History"));
const Portal_User = React.lazy(() => import("./Portal_User"));
const VendorLog = React.lazy(() => import("./Log"));

import NavBar from "./NavBar";
import axiosClient from "../../../../pages/AxiosClint";
import ErrorBoundary from "../../../../ErrorBoundary";
import { decryptData } from "../../../../crypto";

const CloneProfile = (props) => {
    const [redirect, setRedirect] = useState(false);
    const [vendorPersonalData, setPersonalData] = useState([]);
    const [BillingData, setBillingData] = useState([]);
    const [VendorExperience, setExperience] = useState([]);
    const [VendorFiles, setVendorFiles] = useState([]);
    const [InstantMessaging, setInstantMessaging] = useState([]);
    const [VendorTestData, setVendorTestData] = useState([]);
    const [EducationVendor, setEducationVendor] = useState([]);
    const [marginBottom, setMarginBottom] = useState("18vh");
    const [Currancydata, setCurrancy] = useState(null);
    const [Cur, setCUR] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const encryptedData = params.get("data");

    let vendor = {};
    if (encryptedData) {
        try {
            vendor = decryptData(encryptedData);
        } catch (e) {
            setRedirect(true);
        }
    }

    const getCurrancy = (Currancystat, Cur) => {
        setBillingData({ BillingData: Currancystat });
        setCurrancy(Currancystat);
        setCUR(Cur);
    };

    const handleDataSend = (data) => {
        setData({ country: data.country, nationality: data?.nationality });
        setPersonalData({
            PersonalData: {
                ...data,
                id: data.id,
            },
        });
    };

    const LazyWrapper = ({ children }) => (
        <ErrorBoundary>
            <Suspense
                fallback={
                    <div className="loader-box">
                        <Spinner attrSpinner={{ className: "loader-6" }} />
                    </div>
                }
            >
                {children}
            </Suspense>
        </ErrorBoundary>
    );

    useEffect(() => {
        const updateMargin = () => {
            if (window.innerWidth < 768) {
                setMarginBottom("0vh");
            } else {
                setMarginBottom("20vh");
            }
        };

        updateMargin();
        window.addEventListener("resize", updateMargin);

        return () => {
            window.removeEventListener("resize", updateMargin);
        };
    }, []);

    useEffect(() => {
        if (!vendor || !vendor?.id || !vendor?.clone) {
            setRedirect(true);
            return;
        }

        const fetchVendor = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("USER"));
                const payload = {
                    id: vendor.id,
                    PersonalData: "PersonalData",
                    BillingData: "BillingData",
                    Experience: "VendorExperience",
                    VendorFiles: "VendorFiles",
                    InstantMessaging: "InstantMessaging",
                    VendorTestData: "VendorTestData",
                    EducationVendor: "EducationVendor",
                };

                const response = await axiosClient.post("EditVendor", payload);

                const clonedData = response.data.Data;

                setPersonalData({
                    PersonalData: {
                        ...clonedData,
                        id: null,
                        name: clonedData.name
                            ? `${clonedData.name}`
                            : "",
                    },
                });

                setData({
                    country: response?.data?.Data?.country,
                    nationality: response?.data?.Data?.nationality,
                });

                setBillingData({ BillingData: response.data.BillingData });
                setExperience({ Experience: response.data.Experience });
                setVendorFiles({ VendorFiles: response.data.VendorFiles });
                setInstantMessaging({
                    InstantMessaging: response.data.InstantMessaging,
                });
                setVendorTestData({
                    VendorTestData: response.data.VendorTestData,
                });
                setEducationVendor({
                    EducationVendor: response.data.EducationVendor,
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching vendor:", error);
                setRedirect(true);
            }
        };

        fetchVendor();
    }, [vendor?.id]);

    if (redirect) {
        return <Navigate to="*" />;
    }

    const isPermissionsEmpty = (permissions) => {
        return Object.entries(permissions)
            .filter(([key]) => key !== "Profile")
            .every(([, value]) => value === null || value === undefined);
    };

    const isEmpty = isPermissionsEmpty(props.permissions);

    return (
        <Fragment>
            <div
                id="nav-componant"
                className="position-relative"
                style={{ marginBottom }}
            >
                <div
                    className="position-fixed"
                    style={{ zIndex: "2", top: "8.4vh" }}
                >
                    <NavBar permissions={props.permissions} />
                </div>
            </div>

            <div className="mt-5 mt-sm-6 mt-md-8 mt-lg-10 mt-xl-12 py-3 py-md-5">
                {loading ? (
                    <div className="loader-box">
                        <Spinner attrSpinner={{ className: "loader-6" }} />
                    </div>
                ) : (
                    <>
                        {props.permissions?.PersonalData?.view == 1 && (
                            <LazyWrapper>
                                <div id="personal-data">
                                    <PersonalData
                                        onSubmit="onSubmit"
                                        mode="clone"
                                        onDataSend={handleDataSend}
                                        backPermissions={
                                            props.permissions?.PersonalData
                                        }
                                        vendorPersonalData={vendorPersonalData}
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Messaging?.view == 1 && (
                            <LazyWrapper>
                                <div id="messaging">
                                    <Messaging
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        backPermissions={
                                            props.permissions?.Messaging
                                        }
                                        mode="clone"
                                        onSubmit="onSubmit"
                                        InstantMessaging={InstantMessaging}
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.VMnote?.view == 1 && (
                            <LazyWrapper>
                                <div id="VM-Notes">
                                    <VMnote
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        email={
                                            vendorPersonalData?.PersonalData
                                                ?.email || ""
                                        }
                                        backPermissions={
                                            props.permissions?.VMnote
                                        }
                                        lastMessage={null}
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.FilesCertificate?.view == 1 && (
                            <LazyWrapper>
                                <div id="Files-Certificate">
                                    <FilesCertificate
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        mode="clone"
                                        backPermissions={
                                            props.permissions?.FilesCertificate
                                        }
                                        VendorFiles={VendorFiles}
                                        onSubmit="onSubmit"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Education?.view == 1 && (
                            <LazyWrapper>
                                <div id="Education">
                                    <Education
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        EducationVendor={EducationVendor}
                                        backPermissions={
                                            props.permissions?.Education
                                        }
                                        mode="clone"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Experience?.view == 1 && (
                            <LazyWrapper>
                                <div id="Experience">
                                    <Experience
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        Experience={VendorExperience}
                                        backPermissions={
                                            props.permissions?.Experience
                                        }
                                        mode="clone"
                                        onSubmit="onSubmit"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Test?.view == 1 && (
                            <LazyWrapper>
                                <div id="Test">
                                    <Test
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        VendorTestData={VendorTestData}
                                        backPermissions={
                                            props.permissions?.Test
                                        }
                                        mode="clone"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Billing?.view == 1 && (
                            <LazyWrapper>
                                <div id="Billing">
                                    <Billing
                                        countryAndNationality={data}
                                        Bill={Currancydata}
                                        Currancy={getCurrancy}
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        BillingData={BillingData}
                                        onSubmit="onSubmit"
                                        backPermissions={
                                            props.permissions?.Billing
                                        }
                                        mode="clone"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Portal_User?.view == 1 && (
                            <LazyWrapper>
                                <div id="Portal_User">
                                    <Portal_User
                                        id={
                                            vendorPersonalData?.PersonalData
                                                ?.id || null
                                        }
                                        email={
                                            vendorPersonalData?.PersonalData
                                                ?.email || ""
                                        }
                                        backPermissions={
                                            props.permissions?.Portal_User
                                        }
                                        onSubmit="onSubmit"
                                        mode="clone"
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Price_List?.view == 1 && (
                            <LazyWrapper>
                                <div id="Price_List">
                                    <Price_List
                                        Currency={
                                            BillingData?.BillingData
                                                ?.billingData
                                                ?.billing_currency || Cur
                                        }
                                        backPermissions={
                                            props.permissions?.Price_List
                                        }
                                        id={null}
                                        priceList={{}}
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Evaluation?.view == 1 && (
                            <LazyWrapper>
                                <div id="Evaluation">
                                    <Evaluation
                                        backPermissions={
                                            props.permissions?.Evaluation
                                        }
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Feedback?.view == 1 && (
                            <LazyWrapper>
                                <div id="Feedback">
                                    <Feedback
                                        backPermissions={
                                            props.permissions?.Feedback
                                        }
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.Vacation?.view == 1 && (
                            <LazyWrapper>
                                <div id="Vacation">
                                    <Vacation
                                        backPermissions={
                                            props.permissions?.Vacation
                                        }
                                    />
                                </div>
                            </LazyWrapper>
                        )}

                        {props.permissions?.History?.view == 1 && (
                            <LazyWrapper>
                                <div id="History">
                                    <History
                                        backPermissions={
                                            props.permissions?.History
                                        }
                                    />
                                </div>
                            </LazyWrapper>
                        )}
                    </>
                )}

                <Fragment>
                    {isEmpty && (
                        <Card>
                            <CardBody>
                                <div style={{ textAlign: "center" }}>
                                    <h5>Oops !!</h5>
                                    <h6>
                                        You are not allowed to see any sections
                                        here ):
                                    </h6>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </Fragment>
            </div>
        </Fragment>
    );
};

export default CloneProfile;
