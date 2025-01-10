import React, { Fragment, useContext, useState } from 'react';
import Table from './table';
import Search from './searchModel';
const CodeTables = (props) => {
    const [queryParams, setQueryParams] = useState(null);
    const gitQueryParams = (data) => {
        setQueryParams(data)
    }
    return (
        <Fragment>
            <Search fields={props.fields} getQu={gitQueryParams} />
            {/* <h1>{props.permission_add}</h1> */}
            <Table permissions={props.permissions} queryParams={queryParams} table={props.table} dataTable={props.dataTable} header={props.header} fields={props.fields} related={props.related} columns={props.columns}  />
        </Fragment>
    );
};

export default CodeTables;
// import React, { Fragment, useContext } from 'react';
// import Table from './table';
// // import Search from './LanguagesSearch';
// // const CodeTables = React.memo((props) => {
// //     return (
// //         <React.Fragment>
// //             {/* <Search /> */}
// //             <Table table={props.table} dataTable={props.dataTable} header={props.header} fields={props.fields} related={props.related} columns={props.columns} />
// //         </React.Fragment>
// //     );
// // });
// // This component receives props from a parent component and passes them to the Table component
// const CodeTables = React.memo((props) => {
//     // Destructure props to make them easier to work with
//     const { table, dataTable, header, fields, related, columns } = props;

//     // Memoize the props to avoid unnecessary re-renders in the Table component
//     const tableProps = useMemo(() => ({
//         table,
//         dataTable,
//         header,
//         fields,
//         related,
//         columns
//     }), [table, dataTable, header, fields, related, columns]);

//     // Render the component
//     return (
//         <Fragment>
//             {/* Optional Search component can be included here */}
//             {/* <Search /> */}
//             <Table table={props.table} dataTable={props.dataTable} header={props.header} fields={props.fields} related={props.related} columns={props.columns} />
//             <Table {...tableProps} />
//         </Fragment>
//     );
// });

// export default CodeTables;