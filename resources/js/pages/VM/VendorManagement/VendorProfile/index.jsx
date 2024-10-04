import React, { Fragment, useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import PersonalData from './PersonalData'
import Messaging from './Messaging'
import VMnote from "./VMnote"
import FilesCertificate from "./FilesCertificate"
import NavBar from './NavBar';

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
            </div>


        </Fragment>
    );
};

export default Vendor;