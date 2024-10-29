import React, { Fragment } from 'react';
import { Table } from 'reactstrap';

const InvoicesTable = (props) => {

    return (
        <Fragment>
            <div className="table-responsive">
                <Table>
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col">{'#'}</th>
                            <th scope="col">{'Billing Legal Name'}</th>
                            <th scope="col">{'Invoice Date'}</th>
                            <th scope="col">{'Total'}</th>
                            <th scope="col">{'Payment Method'}</th>
                            <th scope="col">{'Status'}</th>

                        </tr>
                    </thead>
                    <tbody>
                        {props.pageInvoices.map((item, i) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.billing_legal_name}</td>
                                <td>{item.invoice_date}</td>
                                <td>{item.total}</td>
                                <td>{item.payment_method}</td>
                                <td>{item.statusData}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </Table>

            </div>
        </Fragment>
    );
};

export default InvoicesTable;