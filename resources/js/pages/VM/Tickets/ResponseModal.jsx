import React, { useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner,
} from "reactstrap";
import { Btn } from "../../../AbstractElements";
import { Close, SaveChanges } from "../../../Constant";
import { toast } from "react-toastify";
import axiosClient from "../../../pages/AxiosClint";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ResponseModal = (props) => {
    const [commentInput, setCommentInput] = useState("");
    const [fileInput, setFileInput] = useState("");
    const [loading, setLoading] = useState(false); 

  const sendTicketResponse = () => {
      if (commentInput.length === 0) {
          toast.error("please Enter Comment .....");
          return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("user", props.fromInuts.user);
      formData.append("id", props.fromInuts.ticket_id);
      formData.append("comment", commentInput);
      if (fileInput) {
          formData.append("file", fileInput);
      }

      axiosClient
          .post("sendTicketResponse", formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          })
          .then(async ({ data }) => {
              switch (data.type) {
                  case "success":
                      await props.changeTicketData();
                      toast.success(data.message);
                      setCommentInput("");
                      setFileInput("");
                      props.sendDataToParent(false); 
                      break;

                  case "error":
                      toast.error(data.message);
                      break;
              }
          })
          .catch(() => {
              toast.error("Something went wrong, please try again.");
          })
          .finally(() => {
              setLoading(false);
          });
  };


    return (
        <Modal
            isOpen={props.isOpen}
            toggle={loading ? undefined : props.toggler}
            size={props.size}
            centered
        >
            <ModalHeader toggle={loading ? undefined : props.toggler}>
                {props.title}
            </ModalHeader>
            <ModalBody className={props.bodyClass}>
                <Row>
                    <Col>
                        <FormGroup className="mb-0">
                            <Label>{"Comment :"}</Label>
                            <CKEditor
                                name="comment"
                                editor={ClassicEditor}
                                data={commentInput}
                                onChange={(e, editor) =>
                                    setCommentInput(editor.getData())
                                }
                                onReady={(editor) => {
                                    editor.ui.view.editable.element.style.minHeight =
                                        "200px";
                                }}
                            />
                          <style>{`
                        .ck-editor__editable_inline {
                        min-height: 200px;
                        }
                    `}</style>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup className="row">
                            <Label className="col-sm-3 col-form-label">
                                {"Upload File"}
                            </Label>
                            <Col sm="9">
                                <Input
                                    className="form-control"
                                    accept="zip, .rar"
                                    type="file"
                                    onChange={(e) =>
                                        setFileInput(e.target.files[0])
                                    }
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Btn
                    attrBtn={{
                        color: "secondary",
                        onClick: props.toggler,
                        disabled: loading,
                    }}
                >
                    {Close}
                </Btn>
                <Btn
                    attrBtn={{
                        color: "primary",
                        onClick: sendTicketResponse,
                        disabled: loading,
                    }}
                >
                    {loading ? <Spinner size="sm" /> : SaveChanges}
                </Btn>
            </ModalFooter>
        </Modal>
    );
};

export default ResponseModal;
