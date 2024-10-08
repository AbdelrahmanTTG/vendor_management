import React, { Fragment, useContext, useState } from 'react';
import { AlignCenter } from 'react-feather';
import { Link } from 'react-router-dom';
import { Image } from '../../AbstractElements';
import CheckContext from '../../_helper/Customizer';
import LingoTalentsLogo from '../../assets/images/logo/Lingotalents-logo.png';
import darkLingoTalentsLogo from '../../assets/images/logo/Lingotalents-logo-W.png';

const Leftbar = () => {

    const { mixLayout, toggleSidebar } = useContext(CheckContext);
    const [toggle, setToggle] = useState(false);


    const openCloseSidebar = () => {
        setToggle(!toggle);
        toggleSidebar(toggle);          
        
    };

    return (
        <Fragment>
            <div className="main-header-left">
                {mixLayout ?
                    <div className="logo-wrapper">
                        <Link to={`/dashboard/default`}>
                            <Image attrImage={{ className: 'img-fluid d-inline', src: `${LingoTalentsLogo}`, alt: '' }} />
                        </Link>
                    </div>
                    :
                    <div className="dark-logo-wrapper">
                        <Link to={`/dashboard/default`}>
                            <Image attrImage={{ className: 'img-fluid d-inline', src: `${darkLingoTalentsLogo}`, alt: '' }} />
                        </Link>
                    </div>
                }
                <div className="toggle-sidebar" onClick={() => openCloseSidebar()}>
                    <AlignCenter className="status_toggle middle" id="sidebar-toggle" />
                </div>
            </div>
        </Fragment >
    );
};

export default Leftbar;