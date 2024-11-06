import React, { Fragment, useEffect, useState } from 'react';
import { Col, Container, Row, Card, CardBody, CardHeader, Form, FormGroup, Input, Label, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { BreadcrumbsPortal, H3, H4, H6, P, Image, Btn } from '../../AbstractElements';
import { useStateContext } from '../../pages/context/contextAuth';
import { MyProfile, Password, Save, EmailAddress } from '../../Constant';
import userImg from '../../assets/images/user/default.png';
import { Link } from 'react-router-dom';
import axiosClient from '../AxiosClint';
import { toast } from 'react-toastify';
import EditMyProfile from '../VM/VendorManagement/VendorProfile/PersonalData';
import Billing from '../VM/VendorManagement/VendorProfile/Billing';

const Profile = () => {
  const baseURL = "/Portal/Admin/";    
  const { user } = useStateContext();
  const [activeTab, setActiveTab] = useState('1');
  const [id, setId] = useState(user.id);
  const [vendorData, setVendorData] = useState([]);
  const [personalData, setPersonalData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const handleDataSend = (data) => {
    setId(data);
  };
  useEffect(() => {
    if (user) {
        const payload = {
            'id': user.id,           
        };
        const fetchVendor = async () => {
          try {
              const user = JSON.parse(localStorage.getItem('USER'));
              const data = await axiosClient.get("EditVendor", {
                  params: {
                      id: user.id,
                      PersonalData: "Personal Data",
                      BillingData: "Billing Data",
                  }
              });
              setPersonalData({ PersonalData: data.data.Data });
              setBillingData({ BillingData: data.data.BillingData })
          } catch (error) {
              console.error('Error fetching vendor:', error);
          } finally {
          }
      };
      fetchVendor();  
    }
}, [user]);

  const [permissions, setPermissions] = useState({
    // type: 'hide',
    // name: 'disable',
    email: 'disable',
    status: 'hide',
    //  address:"disable"
  });
  const handleSubmit = (event) => {
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    axiosClient.post(baseURL + "savePassword", formData)
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
      <BreadcrumbsPortal mainTitle="My Profile" parent="My Profile" title="Edit Information" />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col xl="3">
              <Card>
                {/* <CardHeader className="pb-0">
                  <H4 attrH4={{ className: 'card-title mb-0' }}>{MyProfile}</H4>
                  <div className="card-options">

                  </div>
                </CardHeader> */}
                <CardBody className='b-t-primary px-3'>
                <form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                      <div className="profile-title">
                        <div className="media d-flex">
                          <Image attrImage={{ className: 'img-70 rounded-circle', alt: '', src: `${userImg}` }} />
                          <div className="media-body">
                            <Link to={``}>
                              <H3 attrH3={{ className: 'mb-1 f-20 txt-primary' }}>{vendorData.name}</H3>
                            </Link>
                            <P></P>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{EmailAddress}</Label>
                      <Input type='hidden' name='id' defaultValue={vendorData.id} />
                      <Input className="form-control" disabled placeholder={vendorData.email} />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{Password}</Label>
                      <Input className="form-control"  name='old_pass' type="password" defaultValue="" />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{'New Password'}</Label>
                      <Input className="form-control" name='new_pass' type="password" defaultValue="" />
                    </FormGroup>
                    <div className="form-footer">
                      <Btn attrBtn={{ className: 'btn-block', color: 'primary',type: 'submit'}} >{'Change Password'}</Btn>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
            <Col xl="9">
              <Card>
                <CardBody className='b-t-primary'>
                  <Nav tabs className="border-tab">
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
                        <i className="icofont icofont-list me-1"></i>{'Personal Data'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
                        <i className="icofont icofont-bank-alt me-1"></i>{'Billing Information'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>


                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <EditMyProfile onSubmit="onUpdate" mode="edit"
                        permission={permissions} vendorPersonalData={personalData}/>
                    </TabPane>
                    <TabPane tabId="2">
                      <Billing ID={id} />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};
export default Profile;