// import React from 'react';
// import { ListGroup } from 'reactstrap';
import ListItems from './ListItem';

import React, { forwardRef } from "react";
import { ListGroup } from "reactstrap"; // تأكد من استيراد ListGroup

const UL = forwardRef(({ attrUL, listItem, attrLI, children }, ref) => {
  return (
    <ListGroup {...attrUL} ref={ref}>
      {listItem
        ? listItem.map((item, i) => (
          <ListItems val={item} attrLI={attrLI} key={i} />
        ))
        : children}
    </ListGroup>
  );
});

export default UL;