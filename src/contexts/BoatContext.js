import { useState, createContext, useEffect } from 'react';
import * as mqtt from 'react-paho-mqtt';
export const BoatContext = createContext();

export const BoatProvider = (props) => {
	const [boats, setBoats] = useState([
		{
			id: 'boat2345',
			latitude: 59.903295,
			longitude: 10.753708,
		},
		{
			id: 'boat3535',
			latitude: 59.907672,
			longitude: 10.726348,
		},
		{
			id: 'boat2343',
			latitude: 59.907217,
			longitude: 10.726359,
		},
	]);

	const [boat, setBoat] = useState('');

	// useEffect(() => {
	// 	var devices = [];
	// 	var url = `https://api.particle.io/v1/devices?access_token=2ee345d875011fc4f34c904b226dd7f59b9c164e`;
	// 	Axios.get(url).then((response) => {
	// 		response.data.map((device) => {
	// 			console.log('deviceId: ');
	// 			Axios.get(`http://dweet.io/get/latest/dweet/for/${device.id}`).then(
	// 				(response) => {
	// 					console.log(response.data.with[0].content);
	// 					setBoats([...boats, response.data.with[0].content]);
	// 				}
	// 			);
	// 		});
	// 	});
	// }, []);

	const [client, setClient] = useState(null);

	useEffect(() => {
		_init();
	}, [boats]);

	const _init = () => {
		const c = mqtt.connect(
			'161.35.167.71',
			Number(8000),
			'mqtt',
			_onConnectionLost,
			_onMessageArrived
		); // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)
		c.connect({
			userName: process.env.REACT_APP_MQTT_USERNAME,
			password: process.env.REACT_APP_MQTT_PASSWORD,
			onSuccess: () => {
				console.log('connected');
				c.subscribe('naboBåtData/#');
			},
			useSSL: false,
		});

		setClient(c);
	};

	const _onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
			console.log('onConnectionLost: ' + responseObject.errorMessage);
		}
	};

	const _onMessageArrived = (message) => {
		if (message == null) return;
		const path = message.topic.split('/');
		var boatsTemp = boats;
		const index = boats.findIndex((element) => element.id === path[1]);

		if (index !== -1) {
			console.log('found boat');
			boatsTemp[index][path[2]] = message.payloadString;
		} else {
			boatsTemp = [
				...boatsTemp,
				{ id: path[1], [path[2]]: message.payloadString },
			];
			console.log('boatsTemp: ', boatsTemp);
		}

		setBoats([...boatsTemp]);
	};

	return (
		<BoatContext.Provider
			value={{ boat: [boat, setBoat], boats: [boats, setBoats] }}>
			{props.children}
		</BoatContext.Provider>
	);
};
