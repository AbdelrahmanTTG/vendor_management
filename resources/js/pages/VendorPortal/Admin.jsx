
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Label, FormGroup, Input, CardFooter, Table, Nav, NavItem, TabContent, TabPane, NavLink, Media } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, H6, P, } from '../../AbstractElements';
import axios from 'axios';
import { useStateContext } from '../../pages/context/contextAuth';
import { toast } from 'react-toastify';

const Admin = () => {
  const baseURL = window.location.origin + "/Portal/Admin/";
  const [pageData, setPageData] = useState([]);
  const { user } = useStateContext();
  const [LeftLineTab, setLeftLineTab] = useState('1');
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      axios.post(baseURL + "settingsData")
        .then(({ data }) => {
          console.log(data);
          setPageData(data?.vmConfig);
        });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    for (let [key, defaultValue] of formData.entries()) {
      console.log(key, defaultValue);
    }
    axios.post(baseURL + "saveSettings", formData)
      .then(({ data }) => {
        switch (data.type) {
          case 'success':
            toast.success(data.message);
            break;
          case 'error':
            toast.error(data.message);
            break;
        }

      });
  };
  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="Admin Page" parent="Admin Page" title="Portal Settings" />
      <Container fluid={true}>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col sm="12">
              <Card className='mb-0'>
                <CardBody>
                  <Row>
                    <Col sm="2" className="tabs-responsive-side">
                      <Nav className="nav flex-column nav-pills">
                        <NavItem>
                          <NavLink href="#javascript" className={LeftLineTab === '1' ? 'active' : ''} onClick={() => setLeftLineTab('1')}>General</NavLink>
                        </NavItem>
                        <NavItem >
                          <NavLink href="#javascript" className={LeftLineTab === '2' ? 'active' : ''} onClick={() => setLeftLineTab('2')}>Evaluation</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href="#javascript" className={LeftLineTab === '3' ? 'active' : ''} onClick={() => setLeftLineTab('3')}>Invoice Email</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href="#javascript" className={LeftLineTab === '4' ? 'active' : ''} onClick={() => setLeftLineTab('4')}>Message Email</NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                    <Col sm="10">
                      <TabContent activeTab={LeftLineTab}>
                        <TabPane className="fade show" tabId="1">
                          <Card className='mb-0 b-t-primary'>
                            <CardBody className='py-2'>
                              <FormGroup className="row  pt-2">
                                <Label className="col-sm-4 col-form-label">{'Enable vendor evaluation'}</Label>
                                <Col sm="8">
                                  <Media body className="text-start icon-state">
                                    <Label className="switch">
                                      {pageData.enable_evaluation == 1 ? (
                                        <Input type="checkbox" name="enable_evaluation" defaultValue={'1'} defaultChecked />
                                      ) : (
                                        <Input type="checkbox" name="enable_evaluation" defaultValue={'1'} />
                                      )}
                                      <span className="switch-state" ></span>
                                    </Label>
                                  </Media>
                                </Col>
                              </FormGroup>
                              <FormGroup className="row">
                                <Label className="col-sm-4 col-form-label">{'PM Email'}</Label>
                                <Col sm="8">
                                  <Input type="text" name="pm_email" className="form-control" defaultValue={pageData.pm_email} />
                                </Col>
                              </FormGroup>
                              <FormGroup className="row ">
                                <Label className="col-sm-4 col-form-label">{'VM Email'}</Label>
                                <Col sm="8">
                                  <Input type="text" name="vm_email" className="form-control" defaultValue={pageData.vm_email} />
                                </Col>
                              </FormGroup>
                              <FormGroup className="row  ">
                                <Label className="col-sm-4 col-form-label">{'Accounting Email'}</Label>
                                <Col sm="8">
                                  <Input type="text" name="accounting_email" className="form-control" defaultValue={pageData.accounting_email} />
                                </Col>
                              </FormGroup>
                            </CardBody>
                          </Card>
                        </TabPane>
                        <TabPane tabId="2">
                          <Card className='mb-0'>
                            <CardHeader className=' b-l-primary pb-2'>
                              <H6 >Evaluation</H6>
                              <span>Vendor Feedback Points</span>
                            </CardHeader>
                            <CardBody className='py-2'>
                              <Row>
                                <Col>
                                  <div className="table-responsive">
                                    <Table>
                                      <thead className="bg-primary">
                                        <tr>
                                          <th scope="col">{'#'}</th>
                                          <th scope="col">{'Evatuation Point'}</th>
                                          <th scope="col" style={{ 'width': '30%' }}>{'Percentage %'}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td> 1 </td>
                                          <td><Input type="text" name="v_ev_name1" className="form-control" defaultValue={pageData.v_ev_name1} /></td>
                                          <td><Input type="text" name="v_ev_per1" className="form-control" defaultValue={pageData.v_ev_per1} /></td>
                                        </tr>
                                        <tr>
                                          <td> 2 </td>
                                          <td><Input type="text" name="v_ev_name2" className="form-control" defaultValue={pageData.v_ev_name2} /></td>
                                          <td><Input type="text" name="v_ev_per2" className="form-control" defaultValue={pageData.v_ev_per2} /></td>
                                        </tr>
                                        <tr>
                                          <td> 3 </td>
                                          <td><Input type="text" name="v_ev_name3" className="form-control" defaultValue={pageData.v_ev_name3} /></td>
                                          <td><Input type="text" name="v_ev_per3" className="form-control" defaultValue={pageData.v_ev_per3} /></td>
                                        </tr>
                                        <tr>
                                          <td> 4 </td>
                                          <td><Input type="text" name="v_ev_name4" className="form-control" defaultValue={pageData.v_ev_name4} /></td>
                                          <td><Input type="text" name="v_ev_per4" className="form-control" defaultValue={pageData.v_ev_per4} /></td>
                                        </tr>
                                        <tr>
                                          <td> 5 </td>
                                          <td><Input type="text" name="v_ev_name5" className="form-control" defaultValue={pageData.v_ev_name5} /></td>
                                          <td><Input type="text" name="v_ev_per5" className="form-control" defaultValue={pageData.v_ev_per5} /></td>
                                        </tr>
                                        <tr>
                                          <td> 5 </td>
                                          <td><Input type="text" name="v_ev_name5" className="form-control" defaultValue={pageData.v_ev_name5} /></td>
                                          <td><Input type="text" name="v_ev_per5" className="form-control" defaultValue={pageData.v_ev_per5} /></td>
                                        </tr>
                                        <tr>
                                          <td> 6 </td>
                                          <td><Input type="text" name="v_ev_name6" className="form-control" defaultValue={pageData.v_ev_name6} /></td>
                                          <td><Input type="text" name="v_ev_per6" className="form-control" defaultValue={pageData.v_ev_per6} /></td>
                                        </tr>

                                      </tbody>
                                    </Table>
                                  </div>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </TabPane>
                        <TabPane tabId="3">
                          <Card className='mb-0 b-t-primary'>
                            <CardBody className='py-3'>
                              <FormGroup className="row  ">
                                <Label className="col-sm-3 col-form-label">{'Email (Subject)'}</Label>
                                <Col sm="9">
                                  <Input type="text" name="pe_invoice_subject" className="form-control" defaultValue={pageData.pe_invoice_subject} />
                                </Col>
                              </FormGroup>
                              <FormGroup className="row  ">
                                <Label className="col-sm-3 col-form-label">{'Email (Body)'}</Label>
                                <Col sm="9">
                                  <textarea name="pe_invoice_body" rows={10} className="form-control">{pageData.pe_invoice_body}</textarea>
                                </Col>
                              </FormGroup>
                            </CardBody>
                          </Card>
                        </TabPane>
                        <TabPane tabId="4">
                          <Card className='mb-0 b-t-primary'>
                            <CardBody className='py-3'>
                              <FormGroup className="row  ">
                                <Label className="col-sm-3 col-form-label">{'Email (Subject)'}</Label>
                                <Col sm="9">
                                  <Input type="text" name="pe_message_subject" className="form-control" defaultValue={pageData.pe_message_subject} />
                                </Col>
                              </FormGroup>
                              <FormGroup className="row  ">
                                <Label className="col-sm-3 col-form-label">{'Email (Body)'}</Label>
                                <Col sm="9">
                                  <textarea name="pe_message_body" rows={10} className="form-control">{pageData.pe_message_body}</textarea>
                                </Col>
                              </FormGroup>
                            </CardBody>
                          </Card>
                        </TabPane>

                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card className='mt-0 text-end'>
                <CardFooter className='py-3'>
                  <Btn attrBtn={{ color: 'primary', type: 'submit' }}>Save Changes</Btn>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </form>
      </Container>
    </Fragment>
  );
};

export default Admin;
