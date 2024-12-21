import React, { Fragment } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs } from '../AbstractElements';
// import BarChartsWidgets from './BarChartsWidgets';
// import BrowserChartWidgets from './BrowserChartWidgets';
// import ChartWidgets from './ChartWidgets';
// import LiveChart from './LiveChart';
import MonthlySaleChart from './MonthlySaleChart';
import TurnoverChart from './TurnoverChart';
import UsesChart from './UsesChart';
import BrowserUses from './BrowserUses';
import Charts from './Charts';
import LiveChart from './LiveChart';
import BarChartsWidgets from './BarChartsWidgets';
import axios from "../pages/AxiosClint";




const ChartComponent = () => {
  const test = async () => {
      try {
        const formData = {
          content: "Test",
          sender_id: "TEd5cVI2T055cVFhd2FSRS9lRWJWYnRjM2NrQTJLeGU2Qm5TVnQ2UVd5dkFOa1Iwb08wYS9lTE9SRTc1d0U2NA==",
          receiver_id: "menna.ashour@thetranslationgate.com"
        };
        const response = await axios.post('/SendMessage', formData);
        console.log(response.data)
      } catch (error) {
        console.error('Failed to send message:', error);
      } 
 
  }
  return (
    <Fragment>
      <button className='btn-info' onClick={test}>{"Test"}</button>
      {/* <Breadcrumbs mainTitle="Chart" parent="Widgets" title="Chart" /> */}
      <Container fluid={true} className="chart-widget">
        <Charts />
        {/* <BarChartsWidgets />  */}
        <Row>
          <LiveChart />
          <TurnoverChart />
          <MonthlySaleChart />
          <UsesChart />
        </Row> 
        <BrowserUses />
        {/* <ChartWidgets />
        <BarChartsWidgets />
        <Row>
          <LiveChart />
          <TurnoverChart />
          <MonthlySaleChart />
          <UsesChart />
        </Row>
        <BrowserChartWidgets /> */}
      </Container>
    </Fragment>
  );
};

export default ChartComponent;
