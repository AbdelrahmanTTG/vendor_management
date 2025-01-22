import React, { Fragment, useEffect, useState, useRef } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import Chart from "react-apexcharts";
import ConfigDB from "../Config/ThemeConfig";
import { H5, P } from '../AbstractElements';

const primary = localStorage.getItem("default_color") || ConfigDB.data.color.primary_color;
const secondary = localStorage.getItem("secondary_color") || ConfigDB.data.color.secondary_color;
const IncomeChartClass = (props) => {

    const hasRun = useRef(false);
    const [chartData, setChartData] = useState([]);
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        if (props.requestType.length && !hasRun.current) {
            const totals = [];
            const requestType = [];
            props.requestType.forEach(item => {
                totals.push(item.total);
                switch (item.request_type) {
                  
                    case 1:
                        item.request_type = "New Resource";
                        break;
                    case 2:
                        item.request_type = "Price Inquiry";
                        break;
                    case 3:
                        item.request_type = "General";
                        break;
                    case 4:
                        item.request_type = "Resources Availability";
                        break;
                    case 5:
                        item.request_type = "CV Request";
                        break;

                 
                }
                requestType.push(item.request_type);

            });
            setChartData(totals)
            setChartOptions(requestType)
            hasRun.current = true;
        }
    }, [props.requestType]);
    const x =
    {
        options: {
            chart: {
                type: 'polarArea',
            },
            labels: chartOptions.length > 0 ? chartOptions : [],
            colors: [secondary, primary],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    }
    return (
        <Fragment>
            <Col md="6" className="box-col-6 des-xl-100 dashboard-sec">
                <Card className="income-card">
                    <CardHeader>
                        <div className="header-top d-sm-flex align-items-center">
                            <H5>Tickets type</H5>

                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div id="chart-timeline-dashbord">
                            <Chart options={x.options} series={chartData} type="polarArea" height="395" width="100%" />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default IncomeChartClass;
