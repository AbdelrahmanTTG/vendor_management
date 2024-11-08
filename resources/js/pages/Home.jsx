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




const ChartComponent = () => {
  return (
    <Fragment>
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