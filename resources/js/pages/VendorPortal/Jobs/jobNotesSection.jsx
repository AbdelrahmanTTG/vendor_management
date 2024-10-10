import React, { Fragment } from 'react';
import { Col, Media, Row } from 'reactstrap';
import { LI, P, UL, H6, Image } from '../../../AbstractElements';
import comment from '../../../assets/images/user/user.png';

const jobNotesSection = (props) => {
const item = props.item;
    return (
        <Fragment>
             <div className='chat-history chat-msg-box custom-scrollbar'>
             <ul >
             <LI attrLI={{ className: "clearfix" }} key={item.id}>
                    <div className={`message my-message ${item.from !== 2 ? "" : "pull-right"}`}>
                      <Image
                        attrImage={{
                          src: `${comment}`,
                          className: `rounded-circle ${item.from !== 2 ? "float-left" : "float-right"} chat-user-img img-30`,
                          alt: "",
                        }}
                      />
                      <div className='message-data text-end'>
                        <span className='message-data-time'>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                      {item.message}
                    </div>
                  </LI>
                  </ul>
                  </div>

            <Media className="align-self-center">
                <Media className="align-self-center w-auto h-auto" src={comment} alt="" />
                <Media body>
                    <Row>
                        <Col md="4">
                            <H6 attrH6={{ className: 'mt-0' }} >{item.created_by}</H6>
                        </Col>
                        <Col md="8">
                            <UL attrUL={{ className: 'comment-social float-left float-md-right simple-list' }} >
                                <LI attrLI={{ className: 'digits' }} >{new Date(item.created_at).toLocaleString()}</LI>
                            </UL>
                        </Col>
                    </Row>
                    <p dangerouslySetInnerHTML={{ __html: item.message }} />
                </Media>
            </Media>
        </Fragment>
    );
};

export default jobNotesSection;