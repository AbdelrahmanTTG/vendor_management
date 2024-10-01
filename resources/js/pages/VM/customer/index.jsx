import React, { Fragment, useContext } from 'react';
import  Table  from './CustomerTable';
import  Search  from './CustomerInput';
const Customer= () => {
    // const { data } = useContext(TableContext);

    return (
        <Fragment>
            <Search/>
            <Table/>
        </Fragment>
    );
};

export default Customer;