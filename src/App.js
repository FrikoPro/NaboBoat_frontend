import Map from './views/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import SelectedBoat from './components/SelectedBoat';
import { Container, Row } from 'react-bootstrap';
import { BoatProvider } from './contexts/BoatContext';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Boats from './views/Boats';

const App = () => {
	return (
		<Container>
			<BoatProvider>
				<BrowserRouter>
					<Navbar>
						<Nav>
							<Nav.Link as={Link} to="/">
								Map
							</Nav.Link>
						</Nav>
						<Nav>
							<Nav.Link as={Link} to="/Båter">
								Båter
							</Nav.Link>
						</Nav>
					</Navbar>
					<Switch>
						<Route exact path="/">
							<Row>
								<Map />
							</Row>
							<Row>
								<SelectedBoat />
							</Row>
						</Route>
						<Route path="/båter">
							<Boats></Boats>
						</Route>
					</Switch>
				</BrowserRouter>
			</BoatProvider>
		</Container>
	);
};

export default App;
