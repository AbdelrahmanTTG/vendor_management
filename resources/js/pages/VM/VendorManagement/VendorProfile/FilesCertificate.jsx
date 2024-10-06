import React, { Fragment, useState } from 'react';
import { Card, CardBody, CardHeader, Table, Collapse, Label, Row } from 'reactstrap';
import {Btn, H5 } from '../../../../AbstractElements';

const VMnote = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    }
    const [cvFileName, setCvFileName] = useState('No file chosen');
    const [ndaFileName, setNdaFileName] = useState('No file chosen');
    const [rows, setRows] = useState([]);
  
    const handleFileChange = (event, setFileName) => {
      const file = event.target.files[0];
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('No file chosen');
      }
    };
    const addRow = () => {
        const newRow = {
            id: rows.length + 1,
            File_Title: '',
            File_Content:"",
            File:"",

        };
        setRows([...rows, newRow]);
    };
  
    const handleInputChange = (event, rowId ,nameInput) => {
        const updatedRows = rows.map(row => {
            if (row.id === rowId) {
                return { ...row, [nameInput]: event.target.value };
            }
            return row;
        });
        setRows(updatedRows);
    };
    // const handletextChange = (event, rowId name) => {
    //     const updatedRows = rows.map(row => {
    //         if (row.id === rowId) {
              
    //             return { ...row, File_Content : event.target.value };
    //         }
    //         return row;
    //     });
    //     setRows(updatedRows);
    // };
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
                    <H5>Files & Certificate</H5>
                    <i className={`icon-angle-${isOpen ? 'down' : 'left'}`} style={{ fontSize: '24px' }}></i>
                </CardHeader>
                <Collapse isOpen={isOpen}>
                    <CardBody>
                        <Row className="g-3 mb-3">
                            <div className="form-group row mb-4">
                             
                                <label className="col-lg-2 text-lg-right col-form-label" style={{ alignSelf: 'center' }}>CV</label>
                                <div className="col-lg-4 text-lg-center">
                                    <label id="label_CV">{cvFileName}</label>
                                    <button className="container-btn-file btn-secondary" >
                                        Upload CV
                                        <input
                                            id="CV_file"
                                            required
                                            className="file"
                                            accept=".pdf,.zip"
                                            name="cv"
                                            type="file"
                                            onChange={(e) => handleFileChange(e, setCvFileName)}
                                        />
                                    </button>
                                    <span className="form-text text-muted py-2">Note: if exceeds 5MB please zip it.</span>
                                </div>

                              
                                <label className="col-lg-2 text-lg-right col-form-label" style={{ alignSelf: 'center' }}>NDA</label>
                                <div className="col-lg-4 text-lg-center">
                                    <label id="label_NDA">{ndaFileName}</label>
                                    <button className="container-btn-file btn-success">
                                        Upload NDA
                                        <input
                                            id="NDA_file"
                                            required
                                            className="file"
                                            name="nda"
                                            type="file"
                                            onChange={(e) => handleFileChange(e, setNdaFileName)}
                                        />
                                    </button>
                                    <span className="form-text text-muted py-2">Note: if exceeds 5MB please zip it.</span>
                                </div>
                            </div>
                        </Row>
                        <Table hover>
                <thead>
                    <tr>
                        <th scope="col">{'#'}</th>
                        <th scope="col">{'File Title'}</th>
                        <th scope="col">File Content</th>
                        <th style={{ width: "30%" }} scope="col">File</th>
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
                            <input
                                    type="text"
                                    value={row.File_Title} 
                                    onChange={(e) => handleInputChange(e, row.id,"File_Title")} 
                                    className="form-control"
                                />
                            </td>
                            <td>
                           <textarea style={{ height: '35px' }} className="form-control" name="" id=""  value={row.File_Content}   onChange={(e) => handleInputChange(e, row.id,"File_Content")} >
                           </textarea>
                            </td>
                            <td >
                            <input
                                    type="file"
                                    value={row.File} 
                                    onChange={(e) => handleInputChange(e, row.id,"File")} 
                                    className="form-control"
                                />
                            </td>
                            <td>
                            <td style={{ width: "10%" }}  onClick={() => deleteRow(row.id)}>
                                <button className="btn btn-danger">
                                <i className="fa fa-trash"></i> 
                                </button>
                               
                            </td>
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

export default VMnote;