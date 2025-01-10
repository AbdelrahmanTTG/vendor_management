import React, { Fragment } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { Btn } from '../../../AbstractElements';
import { Link } from 'react-router-dom';

const JobsTable = (props) => {
    let viewStatus = 'true';
    let viewVendor = false;
    {
        props.viewStatus && (
            viewStatus = props.viewStatus
        )
        props.viewVendor && (
            viewVendor = props.viewVendor
        )
    }
    let currentPage = props.currentPage;
    const handlePageChange = (newPage) => {
        if (newPage > 0 ) {
            currentPage = newPage;
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
                            {viewVendor == true && (
                                <th scope="col">{'Vendor'}</th>
                            )}
                            <th scope="col">{'Code'}</th>
                            <th scope="col">{'Subject'}</th>
                            <th scope="col">{'Task Type'}</th>
                            <th scope="col">{'Rate'}</th>
                            <th scope="col">{'Volume'}</th>
                            <th scope="col">{'Unit'}</th>
                            <th scope="col">{'Total Cost'}</th>
                            <th scope="col">{'Currency'}</th>
                            <th scope="col">{'Start Date'}</th>
                            <th scope="col">{'Delivery Date'}</th>
                            {viewStatus == "true" && (
                                <th scope="col">{'Status'}</th>
                            )}                            
                            <th scope="col">{'Brand'}</th>
                            <th scope="col">{'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.pageTasks.length > 0 ? (
                            <>
                                {props.pageTasks.map((item, i) => (
                                    <tr key={item.id}>
                                        <th scope="row">{item.id}</th>
                                        {viewVendor == true && (
                                            <td>{item.vendor}{item.vendor_list??''}</td>
                                        )}
                                        <td>{item.code}</td>
                                        <td>{item.subject}</td>
                                        <td>{item.task_type}</td>
                                        <td>{item.rate}</td>
                                        <td>{item.count}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.total_cost}</td>
                                        <td>{item.currency}</td>
                                        <td>{item.start_date}</td>
                                        <td>{item.delivery_date}</td>
                                        {viewStatus == "true" && (
                                            <td>{item.statusData}</td>
                                        )}                                      
                                        <td>{item.brand_name}</td>
                                        <td>
                                            {item.type == 'job_offer' ? (
                                                <Link to={`/Vendor/Jobs/viewOffer`} state={{id:item.id,type: item.offer_type}}>
                                                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm", color: "default" }}>
                                                        {'View Offer'}
                                                    </Btn>
                                                </Link>
                                            ) :
                                                (
                                                    <Link to={`/Vendor/Jobs/viewJob`} state= { item.id }>
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
                                <td scope="row" colSpan={viewStatus == "true"?14:13} className='text-center bg-light f-14' >{'No Data Available'}</td>
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
                            <PaginationItem key={i} active={link.active} className={`${link.url ? "" : "disabled"}`} onClick={() => handlePageChange(link.url ?link.url.split('page=').pop():0)}>
                                <PaginationLink dangerouslySetInnerHTML={{ __html: link.label }} ></PaginationLink>
                            </PaginationItem>

                        ))}
                    </Pagination>
                </div>)}
        </Fragment>
    );
};

export default JobsTable;