import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Link } from 'react-router-dom';

const JobsTable = (props) => {

    return (
        <Fragment>
            <div className="table-responsive">
                <Table>
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col">{'#'}</th>
                            <th scope="col">{'Code'}</th>
                            <th scope="col">{'Subject'}</th>
                            <th scope="col">{'Task Type'}</th>
                            <th scope="col">{'Rate'}</th>
                            <th scope="col">{'Unit'}</th>
                            <th scope="col">{'Total Cost'}</th>
                            <th scope="col">{'Currency'}</th>
                            <th scope="col">{'Start Date'}</th>
                            <th scope="col">{'Delivery Date'}</th>
                            <th scope="col">{'Status'}</th>
                            <th scope="col">{'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.pageTasks.map((item, i) => (
                            <tr key={item.id}>
                                <th scope="row">{item.id}</th>
                                <td>{item.code}</td>
                                <td>{item.subject}</td>
                                <td>{item.task_type.name}</td>
                                <td>{item.rate}</td>
                                <td>{item.count}</td>
                                <td>{item.total_cost}</td>
                                <td>{item.currency.name}</td>
                                <td>{item.start_date}</td>
                                <td>{item.delivery_date}</td>
                                <td>{item.statusData}</td>
                                <td>
                                    {item.type == 'job_offer' ? (
                                        <Link to={`/Vendor/Jobs/viewOffer/${item.offer_type}/${item.id}`}>
                                            <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
                                                {'View Offer'}
                                            </Btn>
                                        </Link>
                                        ) :
                                        (
                                            <Link to={`/Vendor/Jobs/viewJob/${item.id}`}>
                                                <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
                                                    {'View Job'}
                                                </Btn>
                                            </Link>
                                        )}
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </Table>

                <div className="p-5 m-5">
                    {props.tableLinks.map(link => (
                        link.url ? (
                            <Link key={link.label}
                                className={`p-1 mx-1 ${link.active ? " text-blue-500 font-bold" : ""}`}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }} />


                        ) : (
                            <span key={link.label}
                                className='p-1 mx-1 text-slate-500'
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}

                </div>
            </div>
        </Fragment>
    );
};

export default JobsTable;