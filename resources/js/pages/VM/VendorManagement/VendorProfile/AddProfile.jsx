import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { Card, CardBody } from 'reactstrap';
const PersonalData = React.lazy(() => import('./PersonalData'));
const Messaging = React.lazy(() => import('./Messaging'));
const VMnote = React.lazy(() => import('./VMnote'));
const FilesCertificate = React.lazy(() => import('./FilesCertificate'));
const Education = React.lazy(() => import('./Education'));
const Experience = React.lazy(() => import('./Experience'));
const Price_List = React.lazy(() => import('./Price_List'));
const Evaluation = React.lazy(() => import('./Evaluation'));
const VendorLog = React.lazy(() => import('./Log'));
const Feedback = React.lazy(() => import('./Feedback'));
const Vacation = React.lazy(() => import('./Vacation'));
const Test = React.lazy(() => import('./Test'));
const Billing = React.lazy(() => import('./Billing'));
const History = React.lazy(() => import('./History'));
const Portal_User = React.lazy(() => import('./Portal_User'));
const InHousePriceList = React.lazy(() => import("./InHousePriceList"));
import NavBar from './NavBar';
import ErrorBoundary from "../../../../ErrorBoundary";
import { Spinner } from '../../../../AbstractElements';

const AddProfile = (props) => {
    const [data, setdata] = useState(null);
    const [Currancydata, setCurrancy] = useState(null);
    const [Cur, setCUR] = useState(null);
    const [showInHousePriceList, setShowInHousePriceList] = useState(false);
    const [progressValue, setProgressValue] = useState(20);
    const [marginBottom, setMarginBottom] = useState('18vh');
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
    const handleProgressValue = (data) => {
        setProgressValue(progressValue + data)
    }
    const handleDataSend = (data) => {
        setdata(data);
        console.log(data)
        setShowInHousePriceList(data?.type == 1);
    };
    const getCurrancy = (Currancystat , Cur) => {
        setCurrancy(Currancystat);
        setCUR(Cur)
    }

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
                    <NavBar
                        permissions={props.permissions}
                        value={progressValue}
                    />
                </div>
            </div>
            <div className=" mt-5 mt-sm-6 mt-md-8 mt-lg-10 mt-xl-12 py-3 py-md-5">
                {props.permissions?.PersonalData?.view == 1 && (
                    <LazyWrapper>
                        <div id="personal-data" className="row mb-3">
                            <div className="col-12">
                                <PersonalData
                                    personal={data}
                                    backPermissions={
                                        props.permissions?.PersonalData
                                    }
                                    onDataSend={handleDataSend}
                                    onSubmit="onSubmit"
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Messaging?.view == 1 && (
                    <LazyWrapper>
                        <div id="messaging" className="row mb-3">
                            <div className="col-12">
                                <Messaging
                                    backPermissions={
                                        props.permissions?.Messaging
                                    }
                                    onSubmit="onSubmit"
                                    id={data?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.VMnote?.view == 1 && (
                    <LazyWrapper>
                        <div id="VM-Notes" className="row mb-3">
                            <div className="col-12">
                                <VMnote
                                    id={data?.id}
                                    backPermissions={props.permissions?.VMnote}
                                    email={data?.email}
                                    onSubmit="onSubmit"
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.FilesCertificate?.view == 1 && (
                    <LazyWrapper>
                        <div id="Files-Certificate" className="row mb-3">
                            <div className="col-12">
                                <FilesCertificate
                                    backPermissions={
                                        props.permissions?.FilesCertificate
                                    }
                                    onSubmit="onSubmit"
                                    id={data?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Education?.view == 1 && (
                    <LazyWrapper>
                        <div id="Education" className="row mb-3">
                            <div className="col-12">
                                <Education
                                    backPermissions={
                                        props.permissions?.Education
                                    }
                                    id={data?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Experience?.view == 1 && (
                    <LazyWrapper>
                        <div id="Experience" className="row mb-3">
                            <div className="col-12">
                                <Experience
                                    backPermissions={
                                        props.permissions?.Experience
                                    }
                                    onSubmit="onSubmit"
                                    id={data?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Test?.view == 1 && (
                    <LazyWrapper>
                        <div id="Test" className="row mb-3">
                            <div className="col-12">
                                <Test
                                    backPermissions={props.permissions?.Test}
                                    id={data?.id}
                                    onSubmit="onSubmit"
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Billing?.view == 1 && (
                    <LazyWrapper>
                        <div id="Billing" className="row mb-3">
                            <div className="col-12">
                                <Billing
                                    countryAndNationality={{
                                        country: data?.country,
                                        nationality: data?.nationality,
                                    }}
                                    Bill={Currancydata}
                                    backPermissions={props.permissions?.Billing}
                                    id={data?.id}
                                    onSubmit="onSubmit"
                                    Currancy={getCurrancy}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Portal_User?.view == 1 && (
                    <LazyWrapper>
                        <div id="Portal_User" className="row mb-3">
                            <div className="col-12">
                                <Portal_User
                                    id={data?.id}
                                    backPermissions={
                                        props.permissions?.Portal_User
                                    }
                                    email={data?.email}
                                    onSubmit="onSubmit"
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Price_List?.view == 1 && (
                    <LazyWrapper>
                        <div id="Price_List" className="row mb-3">
                            <div className="col-12">
                                {showInHousePriceList ? (
                                    <InHousePriceList
                                        UpdateCurrency={
                                            props.permissions?.UpdateCurrency
                                        }
                                        backPermissions={
                                            props.permissions?.Price_List
                                        }
                                        Currency={Cur}
                                        id={data?.id}
                                    />
                                ) : (
                                    <Price_List
                                        UpdateCurrency={
                                            props.permissions?.UpdateCurrency
                                        }
                                        backPermissions={
                                            props.permissions?.Price_List
                                        }
                                        Currency={Cur}
                                        id={data?.id}
                                    />
                                )}
                            </div>
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
                                    id={data?.id}
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Evaluation?.view == 1 && (
                    <LazyWrapper>
                        <div id="Evaluation" className="row mb-3">
                            <div className="col-12">
                                <Evaluation
                                    backPermissions={
                                        props.permissions?.Evaluation
                                    }
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}

                {props.permissions?.Feedback?.view == 1 && (
                    <LazyWrapper>
                        <div id="Feedback" className="row mb-3">
                            <div className="col-12">
                                <Feedback
                                    backPermissions={
                                        props.permissions?.Feedback
                                    }
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.Vacation?.view == 1 && (
                    <LazyWrapper>
                        <div id="Vacation" className="row mb-3">
                            <div className="col-12">
                                <Vacation
                                    backPermissions={
                                        props.permissions?.Vacation
                                    }
                                />
                            </div>
                        </div>
                    </LazyWrapper>
                )}
                {props.permissions?.History?.view == 1 && (
                    <LazyWrapper>
                        <div id="History" className="row mb-3">
                            <div className="col-12">
                                <History
                                    backPermissions={props.permissions?.History}
                                />
                            </div>
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

export default AddProfile;