import React, { Fragment, useEffect, useState, useRef } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import Chart from "react-apexcharts";
import ConfigDB from "../Config/ThemeConfig";
const primary = localStorage.getItem("default_color") || ConfigDB.data.color.primary_color;
const secondary = localStorage.getItem("secondary_color") || ConfigDB.data.color.secondary_color;
const SourceChart = (props) => {

    const hasRun = useRef(false);
    const [chartData, setChartData] = useState([{ data: [] }]);
    const [chartOptions, setChartOptions] = useState([]);
    useEffect(() => {
        if (props.source.length && !hasRun.current) {
            const totals = [];
            const source_name = [];
            props.source.sort(() => Math.random() - 0.5)
            props.source.forEach(item => {
                totals.push(item.total);
                source_name.push(item.source_name)
            })

            setChartOptions(source_name)
            setChartData([{ data: totals }])

            hasRun.current = true;
        }
    }, [props.source]);
    const x = {
        options: {
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                    horizontal: true,
                }
            },
            colors: [primary, '#33FF57', '#3357FF'], 
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: chartOptions,
                
            },
            yaxis: {
                categories: chartOptions,
                min: 0, 
                max: 10000, 
              
            }
        }
    };





    return (
        <Fragment>
            <Col md="6" className="box-col-6 des-xl-100 dashboard-sec">
                <Card className="income-card">
                    <CardHeader>
                        <div className="header-top d-sm-flex align-items-center">
                            <h5>Top 10 Source Languages Ranking</h5>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div id="chart-timeline-dashbord">
                            <Chart options={x.options} series={chartData} type="bar" height={350} />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default SourceChart;
