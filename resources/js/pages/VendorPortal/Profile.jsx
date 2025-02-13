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
const Price_List = React.lazy(() => import('../VM/VendorManagement/VendorProfile/Price_List'));
const Messaging = React.lazy(() => import('../VM/VendorManagement/VendorProfile/Messaging'));
const FilesCertificate = React.lazy(() => import('../VM/VendorManagement/VendorProfile/FilesCertificate'));
const Education = React.lazy(() => import('../VM/VendorManagement/VendorProfile/Education'));
const Experience = React.lazy(() => import('../VM/VendorManagement/VendorProfile/Experience'));

const Profile = () => {
  const baseURL = "/Portal/Admin/";
  const { user } = useStateContext();
  const [activeTab, setActiveTab] = useState('1');
  const [id, setId] = useState(user.id);
  const [personalData, setPersonalData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [priceList, setpriceList] = useState([]);
  const [VendorExperience, setExperience] = useState([]);
  const [EducationVendor, setEducationVendor] = useState([]);
  const [VendorFiles, setVendorFiles] = useState([]);
  const [InstantMessaging, setInstantMessaging] = useState([]);
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

          const data = await axiosClient.post("EditVendor", {
            id: user.id,
            PersonalData: "Personal Data",
            BillingData: "Billing Data",
            InstantMessaging: "InstantMessaging",
            priceList: "priceList",
            Experience: "VendorExperience",
            EducationVendor: "EducationVendor",
            VendorFiles: "VendorFiles"
          });
          setPersonalData({ PersonalData: data.data.Data });
          setBillingData({ BillingData: data.data.BillingData });
          setpriceList({ priceList: data.data.priceList });
          setExperience({ Experience: data.data.Experience });
          setEducationVendor({ EducationVendor: data.data.EducationVendor });
          setVendorFiles({ VendorFiles: data.data.VendorFiles });
          setInstantMessaging({ InstantMessaging: data.data.InstantMessaging })

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
    billing_status: 'hide',
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
                              <H3 attrH3={{ className: 'mb-1 f-20 txt-primary' }}>{personalData.PersonalData?.name}</H3>
                            </Link>
                            <P></P>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{EmailAddress}</Label>
                      <Input type='hidden' name='id' defaultValue={user.id} />
                      <Input className="form-control" disabled placeholder={personalData.PersonalData?.email} />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{Password}</Label>
                      <Input className="form-control" name='old_pass' type="password" defaultValue="" />
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <Label className="form-label">{'New Password'}</Label>
                      <Input className="form-control" name='new_pass' type="password" defaultValue="" />
                    </FormGroup>
                    <div className="form-footer">
                      <Btn attrBtn={{ className: 'btn-block', color: 'primary', type: 'submit' }} >{'Change Password'}</Btn>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
            <Col xl="9">
              <Card>
                <CardBody className='b-t-primary px-1'>
                  <Nav tabs className="border-tab portal-profile" style={{overflow:'scroll'}}>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '1' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('1')}>
                        <i className="icofont icofont-list me-1"></i>{'Personal Data'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '2' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('2')}>
                        <i className="icofont icofont-bank-alt me-1"></i>{'Billing Information'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '3' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('3')}>
                        <i className="icofont icofont-list me-1"></i>{'Price List'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '4' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('4')}>
                        <i className="icofont icofont-ui-messaging me-1"></i>{'Messaging'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '5' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('5')}>
                        <i className="icofont icofont-certificate-alt-1 me-1"></i>{'Files & Certificate'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '6' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('6')}>
                        <i className="icofont icofont-book-alt me-1"></i>{'Education'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>
                    <NavItem id="myTab" role="tablist">
                      <NavLink href="#javascript" className={activeTab === '7' ? 'active' : ''} style={{ padding: '10px', fontSize: '14px' }} onClick={() => setActiveTab('7')}>
                        <i className="icofont icofont-listing-box me-1"></i>{'Experience'}
                      </NavLink>
                      <div className="material-border"></div>
                    </NavItem>


                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <EditMyProfile onSubmit="onUpdate" mode="edit" VendorSide="1"
                        permission={permissions} vendorPersonalData={personalData} backPermissions={{ edit: 1 }} />
                    </TabPane>
                    <TabPane tabId="2">
                      <Billing backPermissions={{ edit: 1 }} onSubmit="onUpdate" mode="edit" VendorSide="1" permission={permissions} id={id} BillingData={billingData} />
                    </TabPane>
                    <TabPane tabId="3">
                      <Price_List Currency={billingData?.BillingData?.billingData?.billing_currency} mode="edit" backPermissions={{ view: 1 }} id={id} priceList={priceList} />
                    </TabPane>
                    <TabPane tabId="4">
                      <Messaging backPermissions={{view:1}} id={id} mode="edit" InstantMessaging={InstantMessaging}  />
                    </TabPane>
                    <TabPane tabId="5">
                      <FilesCertificate backPermissions={{ view: 1 }} id={id} mode="edit" VendorFiles={VendorFiles} />
                    </TabPane>
                    <TabPane tabId="6">
                      <Education backPermissions={{ view: 1 }} id={id} EducationVendor={EducationVendor} mode="edit" />
                    </TabPane>
                    <TabPane tabId="7">
                      <Experience backPermissions={{ view: 1 }} id={id} Experience={VendorExperience} mode="edit" />
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