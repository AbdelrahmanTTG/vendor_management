import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Input, InputGroup, InputGroupText, Collapse, Table, Label } from 'reactstrap';
import { Btn, H5 } from '../../../../AbstractElements';
import Select from 'react-select';

const Messaging = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
      setIsOpen(!isOpen);
  }
  const [rows, setRows] = useState([]);

  const options = [
      { value: 'What’s app', label: 'What’s app' },
      { value: 'Facebook Messenger', label: 'Facebook Messenger' },
      { value: 'WeChat', label: 'WeChat' },
      { value: 'Telegram', label: 'Telegram' },
  ];

  const addRow = () => {
      const newRow = {
          id: rows.length + 1,
          type: null, 
          inputValue: '',
      };
      setRows([...rows, newRow]);
  };

  const handleSelectChange = (selectedOption, rowId) => {
      const updatedRows = rows.map(row => {
          if (row.id === rowId) {
              return { ...row, type: selectedOption }; 
          }
          return row;
      });
      setRows(updatedRows);
  };
  const handleInputChange = (event, rowId) => {
    const updatedRows = rows.map(row => {
        if (row.id === rowId) {
            return { ...row, inputValue: event.target.value };
        }
        return row;
    });
    setRows(updatedRows);
};
  const deleteRow = (rowId) => {
    alert("Are you sure you want to delete the ?")
    const updatedRows = rows.filter(row => row.id !== rowId);
    setRows(updatedRows);
};
    return (
        <Fragment>
            <Card>

                <CardHeader
                    className="pb-3 d-flex justify-content-between align-items-center"
                    onClick={toggleCollapse}
                    style={{ cursor: 'pointer', paddingBottom: '25px' }}
                >
                    <H5>Instant Messaging</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                   <CardBody>
                   <Table hover>
                <thead>
                    <tr>
                        <th scope="col">{'#'}</th>
                        <th scope="col">{'Type'}</th>
                        <th scope="col"></th>
                        <th style={{ width: "10%" }} scope="col" onClick={addRow}>
                            <Btn attrBtn={{ color: 'btn btn-light' }} >
                                <i className="fa fa-plus-circle"></i>
                            </Btn>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                                <Select
                                  
                                    options={options}
                                    className="js-example-basic-single col-sm-12"
                                    onChange={(selectedOption) => handleSelectChange(selectedOption, row.id)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={row.inputValue} 
                                    onChange={(e) => handleInputChange(e, row.id)} 
                                    className="form-control"
                                />
                            </td>
                            <td  onClick={() => deleteRow(row.id)}>
                                <Btn attrBtn={{ color: 'btn btn-danger' }}>
                                    <i className="fa fa-trash"></i> 
                                </Btn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                   </CardBody>
                </Collapse>
            </Card>
        </Fragment>
    );
};

export default Messaging;