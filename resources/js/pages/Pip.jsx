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
        if (props.TaskStatus.length && !hasRun.current) {
            const totals = [];
            const statuses = [];
            props.TaskStatus.forEach(item => {
                totals.push(item.total);
                switch (item.status) {
                    case 0:
                        item.status = "In Progress";
                        break;
                    case 1:
                        item.status = "Delivered";
                        break;
                    case 2:
                        item.status = "Cancelled";
                        break;
                    case 3:
                        item.status = "Rejected";
                        break;
                    case 4:
                        item.status = "Waiting Vendor Confirmation";
                        break;
                    case 5:
                        item.status = "Waiting PM Confirmation";
                        break;
                    case 7:
                        item.status = "Heads-Up";
                        break;
                    case 8:
                        item.status = "Heads-Up ( Marked as Available )";
                        break;
                    case 9:
                        item.status = "Heads-Up ( Marked as Not Available )";
                        break;
                    default:
                        item.status = "";
                        break;
                }
                statuses.push(item.status);
                
            });
            setChartData(totals)
            setChartOptions(statuses)
            hasRun.current = true;
        }
    }, [props.TaskStatus]);
    const x =
    {
        options: {
            chart: {
                type: 'donut',
            },
            labels: chartOptions.length > 0 ? chartOptions : [],
            colors: [secondary,primary],
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
                            <H5>Task status</H5>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div id="chart-timeline-dashbord">
                            <Chart options={x.options} series={chartData} type="donut" height="500" width="100%" />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default IncomeChartClass;
