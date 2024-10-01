import React, { Fragment, useContext } from 'react';
import  Table  from './customerBranchTable';
import  Search  from './customerBranchInput';
const customerBranch = () => {
    // const { data } = useContext(TableContext);

    return (
        <Fragment>
            <Search/>
            <Table/>
        </Fragment>
    );
};

export default customerBranch;