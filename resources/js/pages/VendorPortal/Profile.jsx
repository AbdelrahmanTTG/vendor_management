import React, { Fragment, useState } from 'react';
import { Col, Container, Row,Card, CardBody, CardHeader, Form, FormGroup, Input, Label } from 'reactstrap';
import { BreadcrumbsPortal, H3, H4, H6, P, Image, Btn  } from '../../AbstractElements';
import { useStateContext } from '../../pages/context/contextAuth';
import { MyProfile, Password, Website, Save, EmailAddress } from '../../Constant';
import userImg from '../../assets/images/user/default.png';
import { Link } from 'react-router-dom';
import  EditMyProfile  from '../VM/VendorManagement/VendorProfile/PersonalData';

const Profile = () => {
  const { user } = useStateContext();
  const [id, setId] = useState(user.id);
    const handleDataSend = (data) => {
        setId(data);
    };
    const [permissions, setPermissions] = useState({
      // type: 'hide',
      //  name: 'disable',
        email: 'disable',
        status: 'hide',
      //  address:"disable"
    });
  console.log(user);
  return (
    <Fragment>
      <BreadcrumbsPortal mainTitle="My Profile" parent="My Profile" title="Edit Information" />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col xl="3">
              <Card>
                <CardHeader className="pb-0">
                  <H4 attrH4={{ className: 'card-title mb-0' }}>{MyProfile}</H4>
                  <div className="card-options">
                   
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row className="mb-2">
                      <div className="profile-title">
                        <div className="media d-flex">
                          <Image attrImage={{ className: 'img-70 rounded-circle', alt: '', src: `${userImg}` }} />
                          <div className="media-body">
                            <Link to={``}>
                              <H3 attrH3={{ className: 'mb-1 f-20 txt-primary' }}>{user.user_name}</H3>
                            </Link>
                            <P></P>
                          </div>
                        </div>
                      </div>
                    </Row>                 
                    <FormGroup className="mb-3">
                      <Label className="form-label">{EmailAddress}</Label>
                      <Input className="form-control" placeholder="your-email@domain.com" />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{Password}</Label>
                      <Input className="form-control" type="password" defaultValue="password" />
                    </FormGroup>                  
                    <div className="form-footer">
                      <Btn attrBtn={{ className: 'btn-block', color: 'primary' }} >{Save}</Btn>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xl="9">
            <Card>
              </Card>
              <EditMyProfile onDataSend={handleDataSend} route="" onSubmit="onUpdate"
                        permission={permissions}/>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};
export default Profile;