import React, { Fragment, useEffect, useState } from 'react';
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

const Vendor = () => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 900px)');
        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };

        handleMediaQueryChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }, []);
    return (
        <Fragment >
            <Card id='nav-componant' style={{ position: 'fixed', top: "9.8vh", width: isMobile ? '98%' : '79%', zIndex: 1000, backgroundColor: "#f5f7fb",border:"none" }}>
                <NavBar />
            </Card>
            <div style={{ marginTop: "15vh" }}>
                <div id="personal-data">
                    <PersonalData />
                </div>
                <div id="messaging">
                    <Messaging />
                </div>
                <div id='VM-Notes'>
                    <VMnote />
                </div>
                <div id='Files-Certificate'>
                    <FilesCertificate/>
                </div>
                <div id='Education'>
                    <Education/>
                </div>
                <div id='Experience'>
                    <Experience/>
                </div>
                <div id='Test'>
                <Test/>
                </div>
                <div id='Billing'>
                    <Billing/>
                </div>
                <div id='Price_List'>
                    <Price_List/>
                </div>
                <div id='Evaluation'>
                <Evaluation/>
                </div>
                <div id='Feedback'>
                    <Feedback/>
                </div>
                <div id='Vacation'>
                    <Vacation/>
                </div>
                <div id='History'>
                    <History/>
                </div>
                

            </div>


        </Fragment>
    );
};

export default Vendor;