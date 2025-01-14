import React, { Fragment, useEffect, useState, useRef } from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import Chart from "react-apexcharts";
import ConfigDB from "../Config/ThemeConfig";
const primary = localStorage.getItem("default_color") || ConfigDB.data.color.primary_color;
const secondary = localStorage.getItem("secondary_color") || ConfigDB.data.color.secondary_color;
const Column = (props) => {

    const hasRun = useRef(false);
    const [chartData, setChartData] = useState([{ name: 'Inflation', data: [] }]);
    const [chartOptions, setChartOptions] = useState([]);
    useEffect(() => {
        if (props.taskType.length && !hasRun.current) {
            const totals = [];
            const task_type_name = [];
            props.taskType.sort(() => Math.random() - 0.5)
            props.taskType.forEach(item => {
                totals.push(item.total);
                task_type_name.push(item.task_type_name)
            })
            setChartOptions(task_type_name)
            setChartData(
                [{
                    name: 'Inflation',
                    data: totals
                }]
            )

            hasRun.current = true;
        }
    }, [props.taskType]);
    const x =
    {
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            colors: [primary, '#33FF57', '#3357FF'],
            dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: chartOptions,
                position: 'top',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                logarithmic: true,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val;
                    }
                }
            },
            title: {
                text: 'Top 10 Task type Rating',
                floating: true,
                offsetY: 440,
                align: 'center',
                style: {
                    color: '#444'
                }
            }
        }



    };
    return (
        <Fragment>
            <Col md="6" className="box-col-6 des-xl-100 dashboard-sec">
                <Card className="income-card">
                    <CardBody className="p-0">
                        <div id="chart-timeline-dashbord">
                            <Chart options={x.options} series={chartData} type="bar" height={460} />
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default Column;
