import React, { Fragment, useState, useContext } from 'react';
import { LI } from '../../../AbstractElements';
import {Moon ,Sun} from 'react-feather';

import ConfigDB from '../../../Config/ThemeConfig_P';
import CustomizerContext from '../../../_helper/Customizer';

const MoonLight = () => {
    const { addMixBackgroundLayout } = useContext(CustomizerContext);
    const [moonlight, setMoonlight] = useState(false);
    const localStorageLayout = localStorage.getItem('layout_type') || ConfigDB.data.settings.layout_type;

    const MoonlightToggle = (light) => {
        if (light) {
            addMixBackgroundLayout('light-only');
            document.body.classList.add("light-only");
            document.body.classList.remove("dark-only");
            document.body.classList.remove("dark-sidebar");
            document.body.classList.add(localStorageLayout);
            setMoonlight(!light);
        } else {
            addMixBackgroundLayout('dark-only');
            document.body.classList.add("dark-only");
            document.body.classList.remove("dark-sidebar");
            document.body.classList.remove("light-only");
            document.body.classList.add(localStorageLayout);
            setMoonlight(!light);
        }
    };
    return (
        <Fragment>
            <LI>
                <div className="mode" onClick={() => MoonlightToggle(moonlight)} >
                    {moonlight ? <Sun/> : <Moon/>}
                </div>
            </LI>
        </Fragment>
    );
};

export default MoonLight;