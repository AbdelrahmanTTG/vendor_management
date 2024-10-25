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
    const [permissions, setPermissions] = useState({
        // type: 'hide',
        // name: 'disable',
        // email: 'disable',
        // status: 'disable',
        // address: "disable",
        // contact:"disable"
    });
    useEffect(() => {
        if (!vendor) { 
            setRedirect(true);
        } else {
            const fetchVendor = async () => {
                try {
                    const data = await axiosClient.get("EditVendor", {
                        params: {
                            id: vendor,
                            PersonalData: "Personal Data"
                        }
                    });
                    setPersonalData(data.data);
                    // console.log(data.data)
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
            <div id='nav-componant' className=" position-fixed  " style={{ zIndex: "1", top: "9vh" }} >
                <div className="position-relative  nav_div" style={{ width: "99%" }}>
                    <NavBar />
                </div>
            </div>

            <div style={{ marginTop: "25vh" }}>
                <div id="personal-data">
                    <PersonalData  onSubmit="onUpdate" mode="edit"
                        permission={permissions} vendorPersonalData={vendorPersonalData}
                    />
                </div>
                <div id="messaging">
                    <Messaging />
                </div>
                <div id='VM-Notes'>
                    <VMnote />
                </div>
                <div id='Files-Certificate'>
                    <FilesCertificate />
                </div>
                <div id='Education'>
                    <Education />
                </div>
                <div id='Experience'>
                    <Experience />
                </div>
                <div id='Test'>
                    <Test />
                </div>
                <div id='Billing'>
                    <Billing ID={id} />
                </div>
                <div id='Portal_User'>
                    <Portal_User />
                </div>
                <div id='Price_List'>
                    <Price_List />
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