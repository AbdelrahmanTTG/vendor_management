import React from 'react';
import { Row } from 'reactstrap';

const StepProgress = ({ steps }) => {
    return (
        <Row style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }} className="u-pearls-xs mb-2">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`u-pearl ${step.status}`}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                    }}
                >
                    <span className="u-pearl-number" style={{ fontSize: '10px' }}>{index + 1}</span> 
                    <span className="u-pearl-title" style={{ fontSize: '12px' }}>{step.title}</span> 
                </div>
            ))}
        </Row>
    );
};

export default StepProgress;
