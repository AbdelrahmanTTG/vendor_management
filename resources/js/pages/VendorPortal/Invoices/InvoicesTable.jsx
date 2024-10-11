import React, { Fragment } from 'react';
import { Table } from 'reactstrap';

const InvoicesTable = (props) => {

    return (
        <Fragment>
            <div className="table-responsive">
                <Table>
                    <thead className="bg-primary">
                        <tr>                            
                            <th scope="col">{'Task Code'}</th>
                            <th scope="col">{'Invoice Date'}</th>                                     
                            <th scope="col">{'Total Cost'}</th>
                            <th scope="col">{'Currency'}</th>
                            <th scope="col">{'Start Date'}</th>
                            <th scope="col">{'Delivery Date'}</th>
                            <th scope="col">{'Status'}</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {props.pageInvoices.map((item, i) => (
                            <tr key={item.id}>                                
                                <td>{item.code}</td>                              
                                <td>{item.total_cost}</td>
                                <td>{item.currency.name}</td>
                                <td>{item.start_date}</td>
                                <td>{item.delivery_date}</td>
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