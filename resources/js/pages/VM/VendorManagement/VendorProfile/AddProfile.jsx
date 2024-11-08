import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card } from 'reactstrap';
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
const AddProfile = () => {
    const [data, setdata] = useState([]);
    const handleDataSend = (data) => {
        setdata(data);
    };
    
    return (
        <Fragment >

            <div id='nav-componant' className=" position-fixed  " style={{ zIndex: "2", top: "9vh" }} >
                <div className="position-relative  nav_div" style={{ width: "99%" }}>
                    <NavBar />
                </div>
            </div>
            <div style={{ marginTop: "25vh" }}>
                <div id="personal-data">
                    <PersonalData onDataSend={handleDataSend} onSubmit="onSubmit" />
                </div>
                <div id="messaging">
                    <Messaging onSubmit="onSubmit"  />
                </div>
                <div id='VM-Notes'>
                    <VMnote id={data.id} email={data.email} onSubmit="onSubmit" />
                </div>
                <div id='Files-Certificate'>
                    <FilesCertificate onSubmit="onSubmit" id={data.id} />
                </div>
                <div id='Education'>
                    <Education />
                </div>
                <div id='Experience'>
                    <Experience onSubmit="onSubmit" id={data.id} />
                </div>
                <div id='Test'>
                    <Test />
                </div>
                <div id='Billing'>
                    <Billing id={data.id} onSubmit="onSubmit" />
                </div>
                <div id='Portal_User'>
                    <Portal_User email={data.email} onSubmit="onSubmit" />
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

export default AddProfile;