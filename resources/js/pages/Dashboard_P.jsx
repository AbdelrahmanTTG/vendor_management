import React, { Fragment, useState, useEffect } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import useScripts from "./layout/scripts";
import { useStateContext } from "./context/contextAuth";
import Layout from "../Layout/Layout_P";
import CommonModal from "./VM/Model";
import { Btn } from "../AbstractElements";
import { useForm, Controller } from 'react-hook-form';
import { Col, Label, Input, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader ,Form } from "reactstrap";
import axiosClient from "../pages/AxiosClint";
import PDFViewer from "./PDF";
import LogoutClass from '../Layout/Header_P/RightBar/Logout';

export default function Dashboard_p() {
    const { user, token } = useStateContext();
    const { setUser, setToken } = useStateContext();

    const [modal, setModal] = useState(true);
    const [dis, setDis] = useState(false);

    const pdfFile = "NDA/Vendor VM and Portal 2025_02_04.pdf";
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    if (!token || !user) {
        return <Navigate to="/login" />;
    } else if (!user.user_type) {
        return <Navigate to="/vm" />;
    }

    if (user.first_login == 0) {
  const baseURL = "/Portal/Vendor";
        const onSubmit = async (form) => {
       
           if (form.nda) {
               try {
                   setDis(true)
                   const response = await fetch(pdfFile);
                   const blob = await response.blob();
                   const formData = new FormData();
                   formData.append("vendor_id", user.id);
                   formData.append("nda_approved", "true");
                   const currentDate = new Date().toISOString().split("T")[0]; 
                   formData.append("date", currentDate);
                   formData.append("nda_file", blob, "nda.pdf");
                   await axiosClient.post(baseURL + "/NDA_vendor", formData, {
                       headers: {
                           "Content-Type": "multipart/form-data",
                       },
                   });
               } catch (error) {
                   setDis(false);
                   
                   close();
                //    console.error("Error uploading NDA file", error);
               } finally {
                   setModal(false);
                   setDis(false);
                   if (user) {
                       user.first_login = 1; 
                       localStorage.setItem("USER", JSON.stringify(user));
                   }
                   return <Navigate to="/vendor" />;

               }
           }
        };
        const close = async () => {
               setUser(null)
               setToken(null)
               localStorage.removeItem("profileURL");
               localStorage.removeItem("token");
               localStorage.removeItem("auth0_profile");
               localStorage.removeItem("Name");
               localStorage.removeItem("ACCESS_TOKEN");
        };
        return (
            <Fragment>
                {/* <CommonModal
                    isOpen={modal}
                    title="Approval NDA"
                    size="lg"
                    onSave={handleSubmit(onSubmit)}
                >
                    <Col className="d-flex justify-content-center">
                        <iframe
                            src={
                                pdfFile +
                                "#toolbar=0&navpanes=0&scrollbar=0&embedded=true"
                            }
                            width="70%"
                            height="400px"
                            frameBorder="0"
                            title="PDF Viewer"
                        />
                    </Col>

                    <Col sm="12">
                        <FormGroup id="StatusInput">
                            <Label
                                className="col-form-label-sm f-12"
                                htmlFor="NDA"
                            ></Label>
                            <div className="d-flex">
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            className="checkbox_animated"
                                            id="NDA"
                                            type="checkbox"
                                            name="nda"
                                            value="1"
                                        />
                                        I approve
                                    </Label>
                                </FormGroup>
                            </div>
                        </FormGroup>
                    </Col>
                </CommonModal> */}
                <Form className="needs-validation" noValidate="">
                    <Modal
                        isOpen={modal}
                        size="lg"
                        backdrop="static"
                        centered
                        // style={{ marginTop: props.marginTop }}
                    >
                        <ModalHeader>
                            <div>Approval NDA</div>
                        </ModalHeader>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                minHeight: "50vh",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxHeight: "50vh",
                                    overflow: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PDFViewer
                                    url="NDA/Vendor VM and Portal 2025_02_04.pdf"
                                    scale={0.8}
                                />
                            </div>
                        </div>
                        <ModalBody></ModalBody>
                        <ModalFooter className="d-flex justify-content-between align-items-start">
                            <div className="d-flex flex-column align-items-start">
                                <div className="d-flex align-items-center">
                                    <input
                                        className="checkbox_animated me-3  "
                                        id="NDA"
                                        type="checkbox"
                                        {...register("nda", { required: true })}
                                    />
                                    <Label htmlFor="NDA" className="mb-0 mt-1">
                                        I agree
                                    </Label>
                                </div>

                                {errors.nda && (
                                    <div className="text-danger mt-1 ">
                                        You must approve the NDA
                                    </div>
                                )}
                            </div>

                            <div>
                                <Btn
                                    attrBtn={{
                                        color: "secondary",
                                        onClick: close,
                                        disabled: dis,
                                    }}
                                >
                                    Close
                                </Btn>
                                <Btn
                                    attrBtn={{
                                        color: "primary",
                                        onClick: handleSubmit(onSubmit),
                                        className: "ms-2",
                                        disabled: dis, 
                                    }}
                                >
                                    Submit
                                </Btn>
                            </div>
                        </ModalFooter>
                    </Modal>
                </Form>
            </Fragment>
        );
    }
    return (
        <>
            <Layout />
        </>
    );
}
