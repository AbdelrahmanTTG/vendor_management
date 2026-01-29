import React, { Fragment, useEffect, useState, useRef, Suspense ,useContext } from 'react';
import { Card, CardBody } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { Spinner } from '../../../../AbstractElements';
const PersonalData = React.lazy(() => import('./PersonalData'));
const Messaging = React.lazy(() => import('./Messaging'));
const VMnote = React.lazy(() => import('./VMnote'));
const FilesCertificate = React.lazy(() => import('./FilesCertificate'));
const Education = React.lazy(() => import('./Education'));
const Experience = React.lazy(() => import('./Experience'));
const Price_List = React.lazy(() => import('./Price_List'));
const Evaluation = React.lazy(() => import('./Evaluation'));
const Feedback = React.lazy(() => import('./Feedback'));
const Vacation = React.lazy(() => import('./Vacation'));
const Test = React.lazy(() => import('./Test'));
const Billing = React.lazy(() => import('./Billing'));
const History = React.lazy(() => import('./History'));
const Portal_User = React.lazy(() => import('./Portal_User'));
const VendorLog = React.lazy(() => import('./Log'));
const InHousePriceList = React.lazy(() => import("./InHousePriceList"));
import NavBar from './NavBar';
import { Navigate } from 'react-router-dom';
import axiosClient from "../../../../pages/AxiosClint";
import ErrorBoundary from "../../../../ErrorBoundary";
import { decryptData } from "../../../../crypto";
import CheckContext from '../../../../_helper/Customizer';

const EditProfile = (props) => {
    const [id, setId] = useState('');
    const { toggleSidebar } = useContext(CheckContext);
    
    // const location = useLocation();
    // const vendor = Object.values(location.state || {})[0] || {};
    const [redirect, setRedirect] = useState(false);
    const [vendorPersonalData, setPersonalData] = useState([]);
    const [lastMessage, setlastMessage] = useState([]);
    const [BillingData, setBillingData] = useState([]);
    const [VendorExperience, setExperience] = useState([]);
    const [VendorFiles, setVendorFiles] = useState([]);
    const [InstantMessaging, setInstantMessaging] = useState([]);
    const [priceList, setpriceList] = useState([]);
    const [VendorTestData, setVendorTestData] = useState([]);
    const [EducationVendor, setEducationVendor] = useState([]);
    const [marginBottom, setMarginBottom] = useState('18vh');
    const [Currancydata, setCurrancy] = useState(null);
    const [Cur, setCUR] = useState(null);
    const [data, setData] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const encryptedData = params.get("data");
    const [toggleSide, setToggleSide] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [showInHousePriceList, setShowInHousePriceList] = useState(false);
    const triggerRefresh = () => {
        setRefreshFlag((prev) => !prev);
    };

        const openCloseSidebar = () => {
            setToggleSide(false);
            toggleSidebar(toggleSide);
        };
    let vendor = {};
    if (encryptedData) {
        try {
            vendor = decryptData(encryptedData);
        } catch (e) {
            // console.error("Failed to decrypt data:", e);
        }
    }
    const getCurrancy = (Currancystat, Cur) => {
        setBillingData({ BillingData:Currancystat })
        setCurrancy(Currancystat);
        setCUR(Cur)
    }
   const handleDataSend = (data) => {
       setData({ country: data.country, nationality: data?.nationality });
       setPersonalData({ PersonalData: data });
       setShowInHousePriceList(data?.type === 1);
       triggerRefresh(); 
   };

    const LazyWrapper = ({ children }) => (
        <ErrorBoundary>
        <Suspense fallback={
            <div className="loader-box"  >
                <Spinner attrSpinner={{ className: 'loader-6' }} />
            </div>
        }>
            {children}
            </Suspense>
            </ErrorBoundary>
       
    );
    useEffect(() => {
        const updateMargin = () => {
            if (window.innerWidth < 768) {
                setMarginBottom('0vh');
            } else {
                setMarginBottom('20vh');
            }
        };

        updateMargin();
        window.addEventListener('resize', updateMargin);

        return () => {
            window.removeEventListener('resize', updateMargin);
        };
    }, []);
    useEffect(() => {
        if (!vendor || !vendor?.id) {
            setRedirect(true);
            return;
        }

        const fetchVendor = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("USER"));
                const payload = {
                    id: vendor.id,
                    ...(props.permissions?.PersonalData?.view && {
                        PersonalData: "PersonalData",
                    }),
                    ...(props.permissions?.VMnote?.view && {
                        VMNotes: {
                            sender_email: user.email,
                            receiver_email: vendor.email,
                        },
                    }),
                    ...(props.permissions?.Billing?.view && {
                        BillingData: "BillingData",
                    }),
                    ...(props.permissions?.Experience?.view && {
                        Experience: "VendorExperience",
                    }),
                    ...(props.permissions?.FilesCertificate?.view && {
                        VendorFiles: "VendorFiles",
                    }),
                    ...(props.permissions?.Messaging?.view && {
                        InstantMessaging: "InstantMessaging",
                    }),
                    ...(props.permissions?.Price_List?.view && {
                        priceList: "priceList",
                    }),
                    ...(props.permissions?.Test?.view && {
                        VendorTestData: "VendorTestData",
                    }),
                    ...(props.permissions?.Evaluation?.view && {
                        EducationVendor: "EducationVendor",
                    }),
                };

                const data = await axiosClient.post("EditVendor", payload);

                setPersonalData({ PersonalData: data.data.Data });
                setShowInHousePriceList(data.data.Data?.type == 1);
                setData({
                    country: data?.data?.Data?.country,
                    nationality: data?.data?.Data?.nationality,
                });
                setlastMessage({
                    VMNotes: data.data.VMNotes,
                    pm: data.data.pm,
                });
                setBillingData({ BillingData: data.data.BillingData });
                setExperience({ Experience: data.data.Experience });
                setVendorFiles({ VendorFiles: data.data.VendorFiles });
                setInstantMessaging({
                    InstantMessaging: data.data.InstantMessaging,
                });
                setpriceList({ priceList: data.data.priceList });
                setVendorTestData({ VendorTestData: data.data.VendorTestData });
                setEducationVendor({
                    EducationVendor: data.data.EducationVendor,
                });
            } catch (error) {
                console.error("Error fetching vendor:", error);
            }
        };

        fetchVendor();
    }, [vendor?.id, refreshFlag]);


    if (redirect) {
        return <Navigate to='*' />;
    }
    const isPermissionsEmpty = (permissions) => {
        return Object.entries(permissions)
            .filter(([key]) => key !== 'Profile')
            .every(([, value]) => value === null || value === undefined);
    }
    const isEmpty = isPermissionsEmpty(props.permissions);
    return (
        <Fragment>
            <div
                id="nav-componant"
                className="position-relative"
                style={{ marginBottom }}
            >
                <div
                    className=" position-fixed"
                    style={{ zIndex: "2", top: "8.4vh" }}
                >
                    <NavBar permissions={props.permissions} />
                </div>
            </div>

            <div className=" mt-5 mt-sm-6 mt-md-8 mt-lg-10 mt-xl-12 py-3 py-md-5">
                {props.permissions?.PersonalData?.view == 1 && (
                    <LazyWrapper>
                        <div id="personal-data">
                            <PersonalData
                                onSubmit="onUpdate"
                                mode="edit"
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
                                id={vendor?.id}
                                backPermissions={props.permissions?.Messaging}
                                mode="edit"
                                onSubmit="onUpdate"
                                InstantMessaging={InstantMessaging}
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.VMnote?.view == 1 && (
                    <LazyWrapper>
                        <div id="VM-Notes">
                            <VMnote
                                id={vendor?.id}
                                email={vendorPersonalData?.PersonalData?.email}
                                backPermissions={props.permissions?.VMnote}
                                lastMessage={lastMessage}
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.FilesCertificate?.view == 1 && (
                    <LazyWrapper>
                        <div id="Files-Certificate">
                            <FilesCertificate
                                id={vendor?.id}
                                mode="edit"
                                backPermissions={
                                    props.permissions?.FilesCertificate
                                }
                                VendorFiles={VendorFiles}
                                onSubmit="onUpdate"
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Education?.view == 1 && (
                    <LazyWrapper>
                        <div id="Education">
                            <Education
                                id={vendor?.id}
                                EducationVendor={EducationVendor}
                                backPermissions={props.permissions?.Education}
                                mode="edit"
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Experience?.view == 1 && (
                    <LazyWrapper>
                        <div id="Experience">
                            <Experience
                                id={vendor?.id}
                                Experience={VendorExperience}
                                backPermissions={props.permissions?.Experience}
                                mode="edit"
                                onSubmit="onUpdate"
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Test?.view == 1 && (
                    <LazyWrapper>
                        <div id="Test">
                            <Test
                                id={vendor?.id}
                                VendorTestData={VendorTestData}
                                backPermissions={props.permissions?.Test}
                                mode="edit"
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
                                id={vendor?.id}
                                BillingData={BillingData}
                                onSubmit="onUpdate"
                                backPermissions={props.permissions?.Billing}
                                mode="edit"
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Portal_User?.view == 1 && (
                    <LazyWrapper>
                        <div id="Portal_User">
                            <Portal_User
                                id={vendorPersonalData?.PersonalData?.id}
                                email={vendorPersonalData?.PersonalData?.email}
                                backPermissions={props.permissions?.Portal_User}
                                onSubmit="onUpdate"
                                mode="edit"
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Price_List?.view == 1 && (
                    <LazyWrapper>
                        <div id="Price_List">
                            {showInHousePriceList ? (
                                <InHousePriceList
                                    UpdateCurrency={
                                        props.permissions?.UpdateCurrency
                                    }
                                    Currency={
                                        BillingData?.BillingData?.billingData
                                            ?.billing_currency || Cur
                                    }
                                    backPermissions={
                                        props.permissions?.Price_List
                                    }
                                    id={vendor?.id}
                                    priceList={priceList}
                                />
                            ) : (
                                <Price_List
                                    UpdateCurrency={
                                        props.permissions?.UpdateCurrency
                                    }
                                    Currency={
                                        BillingData?.BillingData?.billingData
                                            ?.billing_currency || Cur
                                    }
                                    backPermissions={
                                        props.permissions?.Price_List
                                    }
                                    id={vendor?.id}
                                    priceList={priceList}
                                />
                            )}
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.VendorLog?.view == 1 && (
                    <LazyWrapper>
                        <div id="VendorLog" className="row mb-3">
                            <div className="col-12">
                                <VendorLog
                                    backPermissions={
                                        props.permissions?.VendorLog
                                    }
                                    id={vendor?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Evaluation?.view == 1 && (
                    <LazyWrapper>
                        <div id="Evaluation">
                            <Evaluation
                                backPermissions={props.permissions?.Evaluation}
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Feedback?.view == 1 && (
                    <LazyWrapper>
                        <div id="Feedback">
                            <Feedback
                                backPermissions={props.permissions?.Feedback}
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Vacation?.view == 1 && (
                    <LazyWrapper>
                        <div id="Vacation">
                            <Vacation
                                backPermissions={props.permissions?.Vacation}
                            />
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.History?.view == 1 && (
                    <LazyWrapper>
                        <div id="History">
                            <History
                                backPermissions={props.permissions?.History}
                            />
                        </div>
                    </LazyWrapper>
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

export default EditProfile;