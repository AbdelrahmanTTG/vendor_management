import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Link } from 'react-router-dom';

const JobsTable = (props) => {
    let viewStatus = 'true';
    {
        props.viewStatus && (
            viewStatus = props.viewStatus
        )
    }
    let currentPage = props.currentPage;
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= props.pageLinks.length - 2) {
            currentPage = newPage;
        } else if (newPage == 0 && currentPage != 1) {
            currentPage = currentPage - 1;
        } else if (newPage == props.pageLinks.length - 1 && currentPage != props.pageLinks.length - 2) {
            currentPage = currentPage + 1;
        }
        props.sendDataToParent(currentPage);
    };

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
                            {viewStatus == "true" && (
                                <th scope="col">{'Status'}</th>
                            )}
                            <th scope="col">{'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.pageTasks.length > 0 ? (
                            <>
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
                                        {viewStatus == "true" && (
                                            <td>{item.statusData}</td>
                                        )}
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
                            </>
                        ) : (
                            <tr >
                                <td scope="row" colSpan={12} className='text-center bg-light f-14' >{'No Data Available'}</td>
                            </tr>
                        )
                        }
                    </tbody>
                </Table>
            </div>
            {props.pageLinks && props.pageLinks.length > 3 && (
                <div className="mt-5 ">
                    <Pagination aria-label="Page navigation example" className="pagination justify-content-end pagination-primary">
                        {props.pageLinks.map((link, i) => (
                            <PaginationItem key={i} active={link.active} className={`${link.url ? "" : "disabled"}`} onClick={() => handlePageChange(i)}>
                                <PaginationLink dangerouslySetInnerHTML={{ __html: link.label }} ></PaginationLink>
                            </PaginationItem>

                        ))}
                    </Pagination>
                </div>)}
        </Fragment>
    );
};

export default JobsTable;