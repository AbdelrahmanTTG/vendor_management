import React, { Fragment, useState } from 'react';
import Table from './table';
import Search from './searchModel';

const AliasEmail = () => {
       const [queryParams, setQueryParams] = useState(null);
        const gitQueryParams = (data) => {
            setQueryParams(data)
        }
    return (
        <Fragment>
            <Search getQu={gitQueryParams} />
            <Table queryParams={queryParams} />
        </Fragment>
    );
};

export default AliasEmail;