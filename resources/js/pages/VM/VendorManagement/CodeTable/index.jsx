import React, { Fragment, useContext } from 'react';
import Table from './table';
// import Search from './LanguagesSearch';
const CodeTables = React.memo((props) => {
    return (
        <Fragment>
            {/* <Search /> */}
            <Table table={props.table} dataTable={props.dataTable} header={props.header} fields={props.fields} related={props.related} columns={props.columns}  />
        </Fragment>
    );
});

export default CodeTables;