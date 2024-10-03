import React,{ Fragment ,useEffect} from 'react';
import { Container,Row } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';

import PersonalData from './PersonalData'
import Messaging from './Messaging'
import NavBar from './NavBar';
 
const Vendor = () => {

    return (
      <Fragment >
            <NavBar />
           
            <div id="personal-data">
                <PersonalData />
            </div>
            <div id="messaging">
                <Messaging />
            </div>
            
     
      </Fragment>
    );
};

export default Vendor;