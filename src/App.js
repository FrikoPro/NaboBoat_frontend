import Map from './views/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import SelectedBoat from './components/SelectedBoat';
import { Container, Row } from 'react-bootstrap';
import { BoatProvider } from './contexts/BoatContext';

const App = () => {
	return (
		<Container>
			<BoatProvider>
				<Row>
					<Map />
				</Row>
				<Row>
					<SelectedBoat />
				</Row>
			</BoatProvider>
		</Container>
	);
};

export default App;
