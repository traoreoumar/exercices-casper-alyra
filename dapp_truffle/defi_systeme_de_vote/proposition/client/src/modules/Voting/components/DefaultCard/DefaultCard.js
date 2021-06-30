import React from "react";
import { Card } from 'react-bootstrap';

import "./DefaultCard.scss";

function DefaultCard(props) {
  const cardFooter = (props.footer)
    ? (
      <Card.Footer className="card-footer-btn-fs">
        {props.footer}
      </Card.Footer>
    )
    : <></>;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{props.title}</Card.Title>
      </Card.Header>

      <Card.Body>
        {props.content}
      </Card.Body>

      {cardFooter}
    </Card>
  );
}

export default DefaultCard;
