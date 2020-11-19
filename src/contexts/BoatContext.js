import { useState, createContext, useEffect } from 'react';
import * as mqtt from 'react-paho-mqtt';
export const BoatContext = createContext();

export const BoatProvider = (props) => {
	const [boats, setBoats] = useState([
		{
			id: 'boat2345',
			latitude: 59.903295,
			longitude: 10.753708,
			unlock: false,
		},
		{
			id: 'boat3535',
			latitude: 59.907672,
			longitude: 10.726348,
			unlock: false,
		},
		{
			id: 'boat2343',
			latitude: 59.907217,
			longitude: 10.726359,
			unlock: false,
		},
	]);

	const [selectedBoat, setBoat] = useState('');

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
				c.subscribe('2a003b000a47373336323230/#');
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
		let data = JSON.parse(message.payloadString);

		const id = message.topic.split('/')[0];
		data['id'] = id;
		// console.log(data);
		var boatsTemp = boats;
		const index = boats.findIndex((element) => element.id === data.id);

		if (index === -1) {
			boatsTemp.push(data);
		} else {
			boatsTemp.splice(index, 1, data);
		}

		setBoats([...boatsTemp]);
		// console.log(boatsTemp);
	};

	const sendMessage = (boat) => {
		// let index = boats.findIndex((element) => element.id === boat.id);
		boat.unlock = !boat.unlock;
		// let boatsTemp = boats;
		// boatsTemp.splice(index, 1, boat);

		const testMessage = mqtt.parsePayload(
			boat.id + '/data',
			JSON.stringify(boat)
		);
		client.send(testMessage);

		// setBoats([...boatsTemp]);
		// console.log(boat);
	};

	return (
		<BoatContext.Provider
			value={{
				boat: [selectedBoat, setBoat],
				boats: [boats, setBoats],
				sendMessage: sendMessage,
			}}>
			{props.children}
		</BoatContext.Provider>
	);
};
