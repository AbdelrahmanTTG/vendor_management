import React, { Fragment, useEffect, useState } from 'react';
import { Archive, CloudLightning, CreditCard, Database, MessageCircle } from 'react-feather';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Btn, H4, H5 } from '../../AbstractElements';
import { useStateContext } from '../../pages/context/contextAuth';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import JobsTable from './Jobs/JobsTable';
import configDB from "../../Config/ThemeConfig_P";
// import Chart from "react-apexcharts";

const Dashboard = () => {
  const { user } = useStateContext();
  const baseURL = window.location.origin + "/Portal/Vendor";
  const [runningJobs, setRunningJobs] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [finishedJobs, setFinishedJobs] = useState([]);
  const [countData, setCountData] = useState([]);
  const month = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  var d = new Date();
  let dateshow = month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  const [value, setValue] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(
      () => setValue(new Date()),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const payload = {
        'id': user.id
      };
      axios.post(baseURL + "/dashboardData", payload)
        .then(({ data }) => {
          console.log(data);
          setRunningJobs(data?.runningJobs);
          setPendingJobs(data?.pendingJobs);
          setFinishedJobs(data?.finishedJobs);
          setCountData(data?.countData);

        });
    }
  }, [user]);

  const primary = localStorage.getItem("default_color") || configDB.data.color.primary_color;
  const secondary = localStorage.getItem("secondary_color") || configDB.data.color.secondary_color;
  const apexDonutCharts = {
    series: [44, 55, 41],
    options: {
      chart: {
        type: 'donut',
        toolbar: {
          show: false
        }
      },
      colors: [primary, secondary, '#242934'],
      labels: ["Approved Invoices", "Pending Invoices", "Jobs Need To Be Invoiced"],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 350,

          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  };


  return (
    <Fragment>
      <Row>
        <Col sm="6" lg="6" xl="3">
          <Card className="o-hidden border-0">
            <CardBody className='bg-primary'>
              <div className="media static-top-widget">
                <div className="align-self-center text-center">
                  <Database />
                </div>
                <div className="media-body">
                  <span className="m-0">{'Running Jobs'}</span>
                  <H4 attrH4={{ className: 'mb-0 counter' }} >{countData?.runningJobsCount}</H4>
                  <Database className="icon-bg" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="6" xl="3">
          <Card className="o-hidden border-0">
            <CardBody className='bg-secondary'>
              <div className="media static-top-widget">
                <div className="align-self-center text-center">
                  <MessageCircle />
                </div>
                <div className="media-body">
                  <span className="m-0">{'New Job Offer'}</span>
                  <H4 attrH4={{ className: 'mb-0 counter' }} >{countData?.offerJobsCount}</H4>
                  <MessageCircle className="icon-bg" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="6" xl="3">
          <Card className="o-hidden border-0">
            <CardBody className='bg-primary'>
              <div className="media static-top-widget">
                <div className="align-self-center text-center">
                  <Archive />
                </div>
                <div className="media-body">
                  <span className="m-0">{'Delivered Jobs'}</span>
                  <H4 attrH4={{ className: 'mb-0 counter' }} >{countData?.closedJobsCount}</H4>
                  <Archive className="icon-bg" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6" lg="6" xl="3">
          <Card className="o-hidden border-0">
            <CardBody className='bg-secondary'>
              <div className="media static-top-widget">
                <div className="align-self-center text-center">
                  <CreditCard />
                </div>
                <div className="media-body">
                  <span className="m-0">{'Total Invoices'}</span>
                  <H4 attrH4={{ className: 'mb-0 counter' }} >{countData?.invoiceCount}</H4>
                  <CreditCard className="icon-bg" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm="8" lg="8" xl="9">
          <Card>
            <CardHeader className='b-t-primary p-3'>
              <Row>
                <Col sm="6">
                  <H5>Jobs In Progress</H5>
                </Col>
                <Col sm="6" className='text-end '>
                  <Link to={`/Vendor/Jobs`} >
                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm ", color: "default" }}>
                      <i className="icofont icofont-list me-1"></i>{'View More'}
                    </Btn>
                  </Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className='pt-0 px-3'>
              <JobsTable pageTasks={runningJobs} viewStatus="false" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader className='b-t-primary p-3'>
              <Row>
                <Col sm="6">
                  <H5>Pending Jobs</H5>
                </Col>
                <Col sm="6" className='text-end '>
                  <Link to={`/Vendor/Jobs/Offers`} >
                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm ", color: "default" }}>
                      <i className="icofont icofont-list me-1"></i>{'View More'}
                    </Btn>
                  </Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className='pt-0 px-3'>
              <JobsTable pageTasks={pendingJobs} viewStatus="false" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader className='b-t-primary p-3'>
              <Row>
                <Col sm="6">
                  <H5>Completed Jobs</H5>
                </Col>
                <Col sm="6" className='text-end '>
                  <Link to={`/Vendor/Jobs/Closed`} >
                    <Btn attrBtn={{ className: "btn btn-outline-primary btn-sm ", color: "default" }}>
                      <i className="icofont icofont-list me-1"></i>{'View More'}
                    </Btn>
                  </Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className='pt-0 px-3'>
              <JobsTable pageTasks={finishedJobs} viewStatus="false" />
            </CardBody>
          </Card>
        </Col>
        <Col sm="4" lg="4" xl="3" >
          <Row>
            <Col xl="12" className="xl-100 box-col-12 box-shadow">
              <Card>
                <div className="mobile-clock-widget">
                  <div className="bg-svg">
                    <CloudLightning />
                  </div>
                  <div>
                    <Clock value={value} />
                    <div id="date" className="date f-24 mb-2">
                      <span>{dateshow}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <div className="header-top d-sm-flex align-items-center">
                    <H5>{'Invoices Overview'}</H5>
                  </div>
                </CardHeader>
                <CardBody className="apex-chart p-0">
                  <div id='donutchart'>
                    {/* <Chart options={apexDonutCharts.options} series={apexDonutCharts.series} type="donut" width={383} /> */}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* <Col xl="6" className="xl-100 box-col-12"> */}
      {/* <Card> */}
      {/* <CardBody className="cal-date-widget p-3"> */}
      {/*                               */}
      {/*             */}
      {/* </CardBody> */}
      {/* </Card> */}
      {/* </Col> */}
    </Fragment>


  );
};

export default Dashboard;