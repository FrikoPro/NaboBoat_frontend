import { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { BoatContext } from '../contexts/BoatContext';

const SelectedBoat = () => {
  const { boat, sendMessage, recievedMessage } = useContext(BoatContext);

  const [boatState] = boat;

  const [recievedMessageState] = recievedMessage;

  const renderButtonOrLoadingIcon = () => {
    // as long as recivedMessageState and boatsState is equal, then render button
    if (recievedMessageState === boatState.unlock) {
      return (
        <Button
          className={boatState.unlock ? 'bg-danger' : 'bg-primary'}
          onClick={() => sendMessage(boatState)}>
          {boatState.unlock ? 'Avslutt tur' : 'Start tur'}
        </Button>
      );
      // if not, waiting for response, render loading Icon
    } else {
      return (
        <div class="spinner-grow text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      );
    }
  };

  const renderCard = () => (
    <Container xl={1} className="fixed-bottom">
      <Card>
        <Row>
          <Col>
            <Card.Title>{boatState.id}</Card.Title>
          </Col>
        </Row>

        <Card.Body>
          <Row>
            <Col>
              <p>latitude: {boatState.latitude}</p>
              <p>longitude: {boatState.longitude}</p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col xl={12}>{renderButtonOrLoadingIcon()}</Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );

  // if current selected boat is === "", then return empty fragment, else render current selectedBoat
  return boatState !== '' ? renderCard() : <></>;
};

export default SelectedBoat;
