import React, { Fragment, useState, useEffect } from 'react';
import { Btn, H5, Spinner } from '../../../../AbstractElements';
import CommonModal from '../../Model';
import { Card, Table, Col, Pagination, PaginationItem, PaginationLink, CardHeader, Button, CardBody, Label, FormGroup, Input, Row, Collapse, DropdownMenu, DropdownItem, ButtonGroup, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axiosClient from "../../../../pages/AxiosClint";
import { toast } from 'react-toastify';

const Search = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSearchCol, setSelectedSearchCol] = useState([]);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const handleSearchInputsOnChange = (values) => {
        setSelectedSearchCol(values.map(item => item.value));
        if (values.length == 0) {
            setQueryParams(null);
        }
    }

    const options = [
    

    ];
    return (
        <Fragment >
            <Col>
                <Card>
                    <CardHeader
                        className="pb-3 d-flex justify-content-between align-items-center"
                        onClick={toggleCollapse}
                        style={{ cursor: 'pointer', paddingBottom: '25px' }}>
                        <H5>Search</H5>
                        <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                    </CardHeader>
                    <Collapse isOpen={isOpen}>
                        <CardBody>
                            <div className="search-panel mb-3">
                                <label className='f-12'>Searching Fields: </label>
                                <Select onChange={e => handleSearchInputsOnChange(e)} options={options} className="js-example-placeholder-multiple col-sm-12" isMulti />

                            </div>
                            <div className="">

                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </Col>
        </Fragment>
    )
}
export default Search