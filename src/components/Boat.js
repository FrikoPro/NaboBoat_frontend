import { Card, Col, Row } from 'react-bootstrap';

const Boat = (props) => {
	const getStatusBg = () => {
		if (props.lastWill) {
			return 'bg-danger';
		} else {
			return props.unlocked ? 'bg-warning' : 'bg-success';
		}
	};
	return (
		<Card className={getStatusBg()}>
			<Card.Body>
				<Card.Text>
					<Row>
						<Col>Latitude: {props.latitude}</Col>
						<Col>Longitude: {props.longitude}</Col>
						<Col>I bruk: {props.unlocked ? 'Ja' : 'Nei'}</Col>
						{props.lastWill ? <Col>Mistet tilkoblingen</Col> : undefined}
					</Row>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Boat;
