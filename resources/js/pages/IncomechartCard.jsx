import React, { Fragment, useEffect, useState, useRef } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import Chart from "react-apexcharts";
import ConfigDB from "../Config/ThemeConfig";
import { H5, P } from '../AbstractElements';

const primary = localStorage.getItem("default_color") || ConfigDB.data.color.primary_color;
const secondary = localStorage.getItem("secondary_color") || ConfigDB.data.color.secondary_color;
const IncomeChartClass = (props) => {
  const [date, setDate] = useState([])
  const [highestDate, setHighestDate] = useState()
  const [highestValue, setHighestValue] = useState()


  const hasRun = useRef(false);

  useEffect(() => {
    if (props.vendor.length && !hasRun.current) {
      
      const transformedData = props.vendor.map(item => [
        new Date(item.month).getTime(), 
        item.total,
      ]);
      setDate([
        {
          data: transformedData,
        },
      ]);
      const maxValueItem = props.vendor.reduce((maxItem, currentItem) => {
        return currentItem.total > maxItem.total ? currentItem : maxItem;
      }, props.vendor[0]); 
      setHighestDate(new Date(maxValueItem.month).getTime());
      setHighestValue(maxValueItem.total)
      hasRun.current = true;
    }
  }, [props.vendor]);
  const x = {
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        type: "area",
        stacked: false,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: primary,
            label: {
              show: true,
              text: "Support",
              style: {
                color: "#fff",
                background: primary,
              },
            },
          },
        ],
        xaxis: [
          {
            x: highestDate,
            borderColor: primary,
            label: {
              show: true,
              text: `${highestValue}`,
              style: {
                color: "#fff",
                background: primary,
              },
            },
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        style: "hollow",
      },
      xaxis: {
        type: "datetime",
        min: new Date(new Date().setMonth(new Date().getMonth() - 6)).getTime(), 
        max: new Date().getTime(), 
        tickAmount: 6, 
      },
      colors: [primary],
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        autoSelected: "zoom",
      },
      fill: {
        colors: primary,
        borderColor: primary,
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
        },
      },
    },
  }
  return (
    <Fragment>
      <Col md="12" className="box-col-12 des-xl-100 dashboard-sec">
        <Card className="income-card">
          <CardHeader>
            <div className="header-top d-sm-flex align-items-center">
              <H5>Vendors</H5>
              <div className="center-content">
                <P className="d-flex align-items-center">
                  <i className="toprightarrow-primary fa fa-arrow-up me-2"></i>the last 6 months
                </P>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div id="chart-timeline-dashbord">
              <Chart options={x?.options} series={date} height="395" width="100%" type="area" />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
};

export default IncomeChartClass;
