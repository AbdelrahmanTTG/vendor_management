import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs, Spinner } from '../AbstractElements';
import CommonModal from './VM/Model';









const ModelEmail = () => {
  

    return (
        <Fragment>
            <CommonModal  marginTop="-10vh" size="lg" isOpen={modal} title={props.titelModel} toggler={toggle} style={{ Width: "600px", height: "80vh" }} >

            </CommonModal>
        </Fragment>
    );
};

export default ModelEmail;
