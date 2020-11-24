import { useContext } from 'react';
import Boat from '../components/Boat';
import { BoatContext } from '../contexts/BoatContext';

const Boats = () => {
	const { boats } = useContext(BoatContext);
	const [boatsState, setBoats] = boats;

	return boatsState.map((item) => (
		<Boat
			latitude={item.latitude}
			longitude={item.longitude}
			unlocked={item.unlock}
			lastWill={item.lastWill}></Boat>
	));
};

export default Boats;
