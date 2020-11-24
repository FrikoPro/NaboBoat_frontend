import { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { BoatContext } from '../contexts/BoatContext';

const SelectedBoat = () => {
	const { boat, sendMessage, recievedMessage } = useContext(BoatContext);

	const [boatState, setBoat] = boat;

	const [recievedMessageState, setRecievedMessage] = recievedMessage;

	const renderButtonOrLoadingIcon = () => {
		if (recievedMessageState === boatState.unlock) {
			return (
				<Button
					className={boatState.unlock ? 'bg-danger' : 'bg-primary'}
					onClick={() => sendMessage(boatState)}>
					{boatState.unlock ? 'Avslutt tur' : 'Start tur'}
				</Button>
			);
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

	return boat[0] !== '' ? renderCard() : <></>;
};

export default SelectedBoat;
