import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs, Spinner } from '../AbstractElements';

// import BrowserChartWidgets from './BrowserChartWidgets';
// import ChartWidgets from './ChartWidgets';
// import LiveChart from './LiveChart';
import MonthlySaleChart from './MonthlySaleChart';
import TurnoverChart from './TurnoverChart';
import UsesChart from './UsesChart';
import BrowserUses from './BrowserUses';
import Charts from './Charts';
import LiveChart from './LiveChart';
import axios from "../pages/AxiosClint";
import IncomeChartClass from "./IncomechartCard";
import Pip from "./Pip";
import Column from "./ColumnsService";
import ColumnT from "./ColumnsTaskType";
import SourceChart from "./SourceChart";
import TargetChart from "./TargetChart";
import TicketsChart from "./TicketsChart";








const ChartComponent = () => {
  const hasRun = useRef(false);

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

  const [vendor, setVendor] = useState([])
  const [TaskStatus, setTaskStatus] = useState([]);
  const [service, setService] = useState([]);
  const [taskType, setTaskType] = useState([]);
  const [source, setSource] = useState([]);
  const [target, setTarget] = useState([]);
  const [requestType, setRequestType] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!hasRun.current) {
      Chart();
      hasRun.current = true;
    }
  }, []);

  const Chart = async () => {
    setLoading(true); 
    try {
      const response = await axios.get('/getDashboardChart');
      setVendor(response.data.Vendors);
      setTaskStatus(response.data.TaskStatus);
      setService(response.data.service);
      setTaskType(response.data.taskType);
      setSource(response.data.source);
      setTarget(response.data.target);
      setRequestType(response.data.requestType);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Fragment>
      <Container fluid={true} className="chart-widget">
        {loading ? ( 
          <Row className="justify-content-center">
            <div className="loader-box" >
              <Spinner attrSpinner={{ className: 'loader-6' }} />
            </div>
          </Row>
        ) : (
          <>
              <Row>
                <SourceChart source={source} />
                <TargetChart target={target} />
              </Row>
              <Row>
                <Column service={service} />
                <ColumnT taskType={taskType} />
              </Row>

              <IncomeChartClass vendor={vendor} />
              <Row>
                <TicketsChart requestType={requestType} />
                <Pip TaskStatus={TaskStatus} />
              </Row>
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default ChartComponent;
