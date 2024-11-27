import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card } from 'reactstrap';
import { useLocation } from 'react-router-dom';

import PersonalData from './PersonalData'
import Messaging from './Messaging'
import VMnote from "./VMnote"
import FilesCertificate from "./FilesCertificate"
import Education from "./Education"
import Experience from "./Experience"
import Price_List from "./Price_List"
import Evaluation from "./Evaluation"
import Feedback from "./Feedback"
import Vacation from "./Vacation"
import Test from "./Test"
import Billing from "./Billing"
import NavBar from './NavBar';
import History from "./History"
import Portal_User from "./Portal_User"
import {  Navigate } from 'react-router-dom';
import axiosClient from "../../../../pages/AxiosClint";

const EditProfile = () => {
    const [id, setId] = useState('');
    const location = useLocation();
    const { vendor } = location.state || {};
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




    const [permissions, setPermissions] = useState({
        // type: 'hide',
        // name: 'disable',
        // email: 'disable',
        // status: 'disable',
        // address: "disable",
        // contact:"disable"
    });
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
        if (!vendor) { 
            setRedirect(true);
        } else {
            const fetchVendor = async () => {
                try {
                    const user = JSON.parse(localStorage.getItem('USER'));
                    const data = await axiosClient.post("EditVendor", {
                        id: vendor.id,
                        PersonalData: "Personal Data",
                        VMNotes: {
                            sender_email: user.email,
                            receiver_email: vendor.email
                        },
                        BillingData: "BillingData",
                        Experience: "VendorExperience",
                        VendorFiles: "VendorFiles",
                        InstantMessaging: "InstantMessaging", 
                        priceList: "priceList",
                        VendorTestData: "VendorTestData",
                        EducationVendor:"EducationVendor"

                    });
                    setPersonalData({ PersonalData: data.data.Data });
                    setlastMessage({ VMNotes: data.data.VMNotes })
                    setBillingData({ BillingData: data.data.BillingData })
                    setExperience({ Experience: data.data.Experience })
                    setVendorFiles({ VendorFiles: data.data.VendorFiles })
                    setInstantMessaging({ InstantMessaging: data.data.InstantMessaging })
                    setpriceList({ priceList: data.data.priceList })
                    setVendorTestData({ VendorTestData: data.data.VendorTestData })
                    setEducationVendor({ EducationVendor: data.data.EducationVendor })
                } catch (error) {
                    console.error('Error fetching vendor:', error);
                } finally {
                }
            };

            fetchVendor();
        }
    }, [vendor]);
    if (redirect) {
        return <Navigate to='*' />;
    }
    return (
        <Fragment >
            <div
                id="nav-componant" className="position-relative" style={{ marginBottom }}>
                <div className=" position-fixed" style={{ zIndex: "2", top: "8.4vh" }}>
                    <NavBar  />
                </div>
            </div>

            <div className=" mt-5 mt-sm-6 mt-md-8 mt-lg-10 mt-xl-12 py-3 py-md-5">
                <div id="personal-data">
                    <PersonalData  onSubmit="onUpdate" mode="edit"
                        permission={permissions} vendorPersonalData={vendorPersonalData}
                    />
                </div>
                <div id="messaging">
                    <Messaging id={vendor?.id} mode="edit" onSubmit="onUpdate" InstantMessaging={InstantMessaging} />
                </div>
                <div id='VM-Notes'>
                    <VMnote email={vendor?.email || vendorPersonalData?.PersonalData?.email} lastMessage={lastMessage} />
                </div>
                <div id='Files-Certificate'>
                    <FilesCertificate id={vendor?.id} mode="edit" VendorFiles={VendorFiles} onSubmit="onUpdate"  />
                </div>
                <div id='Education'>
                    <Education id={vendor?.id} EducationVendor={EducationVendor} mode="edit" />
                </div>
                <div id='Experience'>
                    <Experience id={vendor?.id} Experience={VendorExperience} mode="edit" onSubmit="onUpdate" />
                </div>
                <div id='Test'>
                    <Test id={vendor?.id} VendorTestData={VendorTestData} />
                </div>
                <div id='Billing'>
                    <Billing id={vendor?.id} BillingData={BillingData} onSubmit="onUpdate" mode="edit"  />
                </div>
                <div id='Portal_User' >
                    <Portal_User email={vendor?.email || vendorPersonalData?.PersonalData?.email} onSubmit="onUpdate" mode="edit" />
                </div>
                <div id='Price_List'>
                    <Price_List Currency={BillingData?.BillingData?.billingData?.billing_currency} id={vendor?.id} priceList={priceList} />
                </div>
                <div id='Evaluation'>
                    <Evaluation />
                </div>
                <div id='Feedback'>
                    <Feedback />
                </div>
                <div id='Vacation'>
                    <Vacation />
                </div>
                <div id='History'>
                    <History />
                </div>

            </div>


        </Fragment>
    );
};

export default EditProfile;