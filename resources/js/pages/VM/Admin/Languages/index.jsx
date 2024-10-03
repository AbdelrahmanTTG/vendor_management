import React, { Fragment, useContext } from 'react';
import  Table  from './LanguagesTable';
import  Search  from './LanguagesSearch';
const customerBranch = () => {
    return (
        <Fragment>
            <Search/>
            <Table/>
        </Fragment>
    );
};

export default customerBranch;