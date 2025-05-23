import React, { Fragment } from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

const InvoicesTable = (props) => {
    let currentPage = props.currentPage;
    const handlePageChange = (newPage) => {
        if (newPage > 0) {
            currentPage = newPage;
        }
        props.sendDataToParent(currentPage);
    };
    let viewVendor = false;
    {
        props.viewVendor && (
            viewVendor = props.viewVendor
        )
    }
    return (
        <Fragment>
            <div className="table-responsive">
                <Table>
                    <thead className="bg-primary">
                        <tr>
                            <th scope="col">{'ID'}</th>
                            <th scope="col">{'Company'}</th>
                            {viewVendor == true && (
                                <th scope="col">{'Vendor Name'}</th>
                            )}
                            <th scope="col">{'Billing Legal Name'}</th>                           
                            <th scope="col">{'Invoice Date'}</th>
                            <th scope="col">{'Total'}</th>
                            <th scope="col">{'Payment Method'}</th>
                           
                            <th scope="col">{'Status'}</th>

                        </tr>
                    </thead>
                    <tbody>
                        {props.pageInvoices.length > 0 ? (
                            <>
                                {props.pageInvoices.map((item, i) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.brand_name}</td>
                                        {viewVendor == true && (
                                            <td>{item.vendor}</td>
                                        )}
                                        <td>{item.billing_legal_name}</td>                                      
                                        <td>{item.invoice_date}</td>
                                        <td>{item.total}</td>
                                        <td>{item.payment_method}</td>                                       
                                        <td>{item.statusData}</td>
                                    </tr>
                                ))
                                }
                            </>
                        ) : (
                            <tr >
                                <td scope="row" colSpan={viewVendor == true?8:7} className='text-center bg-light f-14' >{'No Data Available'}</td>
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
                            <PaginationItem key={i} active={link.active} className={`${link.url ? "" : "disabled"}`} onClick={() => handlePageChange(link.url ? link.url.split('page=').pop() : 0)}>
                                <PaginationLink dangerouslySetInnerHTML={{ __html: link.label }} ></PaginationLink>
                            </PaginationItem>

                        ))}
                    </Pagination>
                </div>)}
        </Fragment>
    );
};

export default InvoicesTable;