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
import Steps from "./Steps"
const AddProfile = (props) => {
    const [data, setdata] = useState([]);
    const [Currancydata, setCurrancy] = useState([]);
    const [progressValue, setProgressValue] = useState(20);
    const [marginBottom, setMarginBottom] = useState('18vh');
    const handleProgressValue = (data) => {
        setProgressValue(progressValue + data)
    }
    const handleDataSend = (data) => {
        setdata(data);
    };
    const getCurrancy = (Currancystat) => {
        setCurrancy(Currancystat);
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
    useEffect(() => {
        // console.log(props.permissions)

    }, [props.permissions]);
    return (
        <Fragment >

            <div
                id="nav-componant" className="position-relative" style={{ marginBottom }}>
                <div className=" position-fixed" style={{ zIndex: "2", top: "8.4vh"  }}>
                    <NavBar value={progressValue} />
                </div>
            </div>
            <div className=" mt-5 mt-sm-6 mt-md-8 mt-lg-10 mt-xl-12 py-3 py-md-5">
                <div id="personal-data" className="row mb-3">
                    <div className="col-12">
                        <PersonalData onDataSend={handleDataSend} onSubmit="onSubmit" />
                    </div>
                </div>

                <div id="messaging" className="row mb-3">
                    <div className="col-12">
                        <Messaging onSubmit="onSubmit" id={data.id} />
                    </div>
                </div>

                <div id="VM-Notes" className="row mb-3">
                    <div className="col-12">
                        <VMnote id={data.id} email={data.email} onSubmit="onSubmit" />
                    </div>
                </div>

                <div id="Files-Certificate" className="row mb-3">
                    <div className="col-12">
                        <FilesCertificate onSubmit="onSubmit" id={data.id} />
                    </div>
                </div>

                <div id="Education" className="row mb-3">
                    <div className="col-12">
                        <Education id={data.id} />
                    </div>
                </div>

                <div id="Experience" className="row mb-3">
                    <div className="col-12">
                        <Experience onSubmit="onSubmit" id={data.id} />
                    </div>
                </div>

                <div id="Test" className="row mb-3">
                    <div className="col-12">
                        <Test id={data.id} onSubmit="onSubmit" />
                    </div>
                </div>

                <div id="Billing" className="row mb-3">
                    <div className="col-12">
                        <Billing id={data.id} onSubmit="onSubmit" Currancy={getCurrancy} />
                    </div>
                </div>

                <div id="Portal_User" className="row mb-3">
                    <div className="col-12">
                        <Portal_User email={data.email} onSubmit="onSubmit" />
                    </div>
                </div>

                <div id="Price_List" className="row mb-3">
                    <div className="col-12">
                        <Price_List Currency={Currancydata} id={data.id} />
                    </div>
                </div>

                <div id="Evaluation" className="row mb-3">
                    <div className="col-12">
                        <Evaluation />
                    </div>
                </div>

                <div id="Feedback" className="row mb-3">
                    <div className="col-12">
                        <Feedback />
                    </div>
                </div>

                <div id="Vacation" className="row mb-3">
                    <div className="col-12">
                        <Vacation />
                    </div>
                </div>

                <div id="History" className="row mb-3">
                    <div className="col-12">
                        <History />
                    </div>
                </div>
            </div>



        </Fragment>
    );
};

export default AddProfile;