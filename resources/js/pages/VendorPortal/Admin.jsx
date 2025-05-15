
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Label, FormGroup, Input, CardFooter, Table, Nav, NavItem, TabContent, TabPane, NavLink, Media } from 'reactstrap';
import { BreadcrumbsPortal, H5, Btn, H6 } from '../../AbstractElements';
import axiosClient from '../AxiosClint';
import { useStateContext } from '../../pages/context/contextAuth';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Admin = () => {
  const baseURL = "/Portal/Admin/";
  const [pageData, setPageData] = useState([]);
  const { user } = useStateContext();
  const [LeftLineTab, setLeftLineTab] = useState('1');
  const [peInvoiceInput, setPeInvoiceInput] = useState('');
  const [peMessageInput, setPeMessageInput] = useState('');
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      axiosClient.post(baseURL + "settingsData")
        .then(({ data }) => {
          setPageData(data?.vmConfig);
          setPeInvoiceInput(data?.vmConfig?.pe_invoice_body);
          setPeMessageInput(data?.vmConfig?.pe_message_body);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    const form = new FormData(event.currentTarget);
    const formData = {
      ...Object.fromEntries(form),      
      'pe_invoice_body': peInvoiceInput,
      'pe_message_body': peMessageInput,
  };
   
    event.preventDefault();
    axiosClient.post(baseURL + "saveSettings", formData)
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
          <BreadcrumbsPortal
              mainTitle="Admin Page"
              parent="Admin Page"
              title="Portal Settings"
          />
          <Container fluid={true}>
              <form onSubmit={handleSubmit}>
                  <Row>
                      <Col sm="12">
                          <Card className="mb-0">
                              <CardBody>
                                  <Row>
                                      <Col
                                          sm="3"
                                          className="tabs-responsive-side"
                                      >
                                          <Nav className="nav flex-column nav-pills">
                                              <NavItem>
                                                  <NavLink
                                                      href="#javascript"
                                                      className={
                                                          LeftLineTab === "1"
                                                              ? "active"
                                                              : ""
                                                      }
                                                      onClick={() =>
                                                          setLeftLineTab("1")
                                                      }
                                                  >
                                                      <i className="icofont icofont-list me-1"></i>
                                                      General
                                                  </NavLink>
                                              </NavItem>
                                              <NavItem>
                                                  <NavLink
                                                      href="#javascript"
                                                      className={
                                                          LeftLineTab === "2"
                                                              ? "active"
                                                              : ""
                                                      }
                                                      onClick={() =>
                                                          setLeftLineTab("2")
                                                      }
                                                  >
                                                      <i className="icofont icofont-tick-boxed me-1"></i>
                                                      Evaluation
                                                  </NavLink>
                                              </NavItem>
                                              <NavItem>
                                                  <NavLink
                                                      href="#javascript"
                                                      className={
                                                          LeftLineTab === "3"
                                                              ? "active"
                                                              : ""
                                                      }
                                                      onClick={() =>
                                                          setLeftLineTab("3")
                                                      }
                                                  >
                                                      <i className="icofont icofont-email me-1"></i>
                                                      Invoice Email
                                                  </NavLink>
                                              </NavItem>
                                              <NavItem>
                                                  <NavLink
                                                      href="#javascript"
                                                      className={
                                                          LeftLineTab === "4"
                                                              ? "active"
                                                              : ""
                                                      }
                                                      onClick={() =>
                                                          setLeftLineTab("4")
                                                      }
                                                  >
                                                      <i className="icofont icofont-email me-1"></i>
                                                      Message Email
                                                  </NavLink>
                                              </NavItem>
                                          </Nav>
                                      </Col>
                                      <Col sm="9">
                                          <TabContent activeTab={LeftLineTab}>
                                              <TabPane
                                                  className="fade show"
                                                  tabId="1"
                                              >
                                                  <Card className="mb-0 b-t-primary">
                                                      <CardBody className="py-2">
                                                          <FormGroup className="row  pt-2">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {
                                                                      "Enable vendor evaluation"
                                                                  }
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Media
                                                                      body
                                                                      className="text-start icon-state"
                                                                  >
                                                                      <Label className="switch">
                                                                          {pageData.enable_evaluation ==
                                                                          1 ? (
                                                                              <Input
                                                                                  type="checkbox"
                                                                                  name="enable_evaluation"
                                                                                  defaultValue={
                                                                                      "1"
                                                                                  }
                                                                                  defaultChecked
                                                                              />
                                                                          ) : (
                                                                              <Input
                                                                                  type="checkbox"
                                                                                  name="enable_evaluation"
                                                                                  defaultValue={
                                                                                      "1"
                                                                                  }
                                                                              />
                                                                          )}
                                                                          <span className="switch-state"></span>
                                                                      </Label>
                                                                  </Media>
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {"Erp Link"}
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="erp_link"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.erp_link
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {
                                                                      "Erp Uploads Folder Path"
                                                                  }
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="erp_uploads_folder_path"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.erp_uploads_folder_path
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {"PM Email"}
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="pm_email"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.pm_email
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row ">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {"VM Email"}
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="vm_email"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.vm_email
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {
                                                                      "Accounting Email"
                                                                  }
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="accounting_email"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.accounting_email
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-4 col-form-label">
                                                                  {
                                                                      "Maximum amount"
                                                                  }
                                                              </Label>
                                                              <Col sm="8">
                                                                  <Input
                                                                      type="text"
                                                                      name="amount"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.amount
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                      </CardBody>
                                                  </Card>
                                              </TabPane>
                                              <TabPane tabId="2">
                                                  <Card className="mb-0">
                                                      <CardHeader className=" b-l-primary pb-2">
                                                          <H6>Evaluation</H6>
                                                          <span>
                                                              Vendor Feedback
                                                              Points
                                                          </span>
                                                      </CardHeader>
                                                      <CardBody className="py-2">
                                                          <Row>
                                                              <Col>
                                                                  <div className="table-responsive">
                                                                      <Table>
                                                                          <thead className="bg-primary">
                                                                              <tr>
                                                                                  <th scope="col">
                                                                                      {
                                                                                          "#"
                                                                                      }
                                                                                  </th>
                                                                                  <th scope="col">
                                                                                      {
                                                                                          "Evaluation Point"
                                                                                      }
                                                                                  </th>
                                                                                  <th
                                                                                      scope="col"
                                                                                      style={{
                                                                                          width: "20%",
                                                                                      }}
                                                                                  >
                                                                                      {
                                                                                          "Percentage %"
                                                                                      }
                                                                                  </th>
                                                                              </tr>
                                                                          </thead>
                                                                          <tbody>
                                                                              {[
                                                                                  ...Array(
                                                                                      6
                                                                                  ),
                                                                              ].map(
                                                                                  (
                                                                                      x,
                                                                                      i
                                                                                  ) => {
                                                                                      ++i;
                                                                                      let myName =
                                                                                          "v_ev_name" +
                                                                                          i;
                                                                                      let myPer =
                                                                                          "v_ev_per" +
                                                                                          i;
                                                                                      return (
                                                                                          <tr
                                                                                              key={
                                                                                                  i
                                                                                              }
                                                                                          >
                                                                                              <th scope="col">
                                                                                                  {
                                                                                                      i
                                                                                                  }
                                                                                              </th>
                                                                                              <td>
                                                                                                  <Input
                                                                                                      type="text"
                                                                                                      name={`v_ev_name${i}`}
                                                                                                      className="form-control"
                                                                                                      defaultValue={
                                                                                                          pageData[
                                                                                                              myName
                                                                                                          ]
                                                                                                      }
                                                                                                  />
                                                                                              </td>
                                                                                              <td>
                                                                                                  <Input
                                                                                                      type="text"
                                                                                                      name={`v_ev_per${i}`}
                                                                                                      className="form-control"
                                                                                                      defaultValue={
                                                                                                          pageData[
                                                                                                              myPer
                                                                                                          ]
                                                                                                      }
                                                                                                  />
                                                                                              </td>
                                                                                          </tr>
                                                                                      );
                                                                                  }
                                                                              )}
                                                                          </tbody>
                                                                      </Table>
                                                                  </div>
                                                              </Col>
                                                          </Row>
                                                      </CardBody>
                                                  </Card>
                                              </TabPane>
                                              <TabPane tabId="3">
                                                  <Card className="mb-0 b-t-primary">
                                                      <CardBody className="py-3">
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-3 col-form-label">
                                                                  {
                                                                      "Email (Subject)"
                                                                  }
                                                              </Label>
                                                              <Col sm="9">
                                                                  <Input
                                                                      type="text"
                                                                      name="pe_invoice_subject"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.pe_invoice_subject
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-3 col-form-label">
                                                                  {
                                                                      "Email (Body)"
                                                                  }
                                                              </Label>
                                                              <Col sm="9">
                                                                  <CKEditor
                                                                      name="pe_invoice_body"
                                                                      editor={
                                                                          ClassicEditor
                                                                      }
                                                                      data={
                                                                          pageData?.pe_invoice_body ||
                                                                          ""
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                          editor
                                                                      ) => {
                                                                          const data =
                                                                              editor.getData();
                                                                          setPeInvoiceInput(
                                                                              data
                                                                          );
                                                                      }}
                                                                  />

                                                                  {/* <textarea name="pe_invoice_body" rows={10} className="form-control" defaultValue={pageData.pe_invoice_body}>{pageData.pe_invoice_body}</textarea> */}
                                                              </Col>
                                                          </FormGroup>
                                                      </CardBody>
                                                  </Card>
                                              </TabPane>
                                              <TabPane tabId="4">
                                                  <Card className="mb-0 b-t-primary">
                                                      <CardBody className="py-3">
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-3 col-form-label">
                                                                  {
                                                                      "Email (Subject)"
                                                                  }
                                                              </Label>
                                                              <Col sm="9">
                                                                  <Input
                                                                      type="text"
                                                                      name="pe_message_subject"
                                                                      className="form-control"
                                                                      defaultValue={
                                                                          pageData.pe_message_subject
                                                                      }
                                                                  />
                                                              </Col>
                                                          </FormGroup>
                                                          <FormGroup className="row  ">
                                                              <Label className="col-sm-3 col-form-label">
                                                                  {
                                                                      "Email (Body)"
                                                                  }
                                                              </Label>
                                                              <Col sm="9">
                                                                  <CKEditor
                                                                      name="pe_message_body"
                                                                      editor={
                                                                          ClassicEditor
                                                                      }
                                                                      data={
                                                                          pageData?.pe_message_body ||
                                                                          ""
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                          editor
                                                                      ) => {
                                                                          const data =
                                                                              editor.getData();
                                                                          setPeMessageInput(
                                                                              data
                                                                          );
                                                                      }}
                                                                  />
                                                                  {/* <textarea name="pe_message_body" rows={10} className="form-control" defaultValue={pageData.pe_message_body}>{pageData.pe_message_body}</textarea> */}
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
                          <Card className="mt-0 text-end">
                              <CardFooter className="py-3">
                                  <Btn
                                      attrBtn={{
                                          color: "primary",
                                          type: "submit",
                                      }}
                                  >
                                      Save Changes
                                  </Btn>
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
