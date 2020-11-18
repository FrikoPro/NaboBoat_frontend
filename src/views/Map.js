import { useContext } from 'react';
import {
	GoogleMap,
	withScriptjs,
	withGoogleMap,
	Marker,
} from 'react-google-maps';
import { BoatContext } from '../contexts/BoatContext';

const InitMap = () => {
	const { boats, boat } = useContext(BoatContext);

	const [boatsState, setBoats] = boats;

	const [boatState, setBoat] = boat;

	return (
		<GoogleMap
			defaultZoom={10}
			defaultCenter={{ lat: 59.913868, lng: 10.752245 }}
			defaultOptions={{ disableDefaultUI: true }}>
			{boatsState.map((boat, i) => (
				<Marker
					key={i}
					position={{
						lat: parseFloat(boat.latitude),
						lng: parseFloat(boat.longitude),
					}}
					onClick={() => setBoat(boat)}
				/>
			))}
		</GoogleMap>
	);
};

const WrappedMap = withScriptjs(withGoogleMap(InitMap));

const Map = () => {
	return (
		<div style={{ height: '100vh', width: '100vw' }}>
			<WrappedMap
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `100vh` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		</div>
	);
};

export default Map;
