import { useState, createContext, useEffect } from 'react';
import Axios from 'axios';
import * as mqtt from 'react-paho-mqtt';
export const BoatContext = createContext();

export const BoatProvider = (props) => {
	const [boats, setBoats] = useState([]);

	const [selectedBoat, setBoat] = useState('');

	const [recievedMessage, setRecievedMessage] = useState('');

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
		const topicPath = message.topic.split('/');
		const id = topicPath[0];
		const index = boats.findIndex((element) => element.id === id);
		var boatsTemp = boats;

		if (topicPath[1] === 'lastWill') {
			if (index !== -1) {
				boatsTemp[index]['lastWill'] = true;
			}
		} else if (topicPath[1] === 'data') {
			let data = JSON.parse(message.payloadString);

			data['id'] = id;

			if (index === -1) {
				boatsTemp.push(data);
			} else {
				boatsTemp.splice(index, 1, data);
			}
		} else if (topicPath[1] === 'confirmStatus') {
			setRecievedMessage(message.payloadString === 'locked' ? false : true);
			return;
		}

		setBoats([...boatsTemp]);
	};

	const sendMessage = (boat) => {
		boat.unlock = !boat.unlock;

		var url = 'http://www.dweet.io/dweet/for/2a003b000a47373336323230?unlock=';

		url += boat.unlock ? '1' : '0';

		Axios.get(url).then((response) => {
			console.log(response.data);
		});

		const testMessage = mqtt.parsePayload(
			boat.id + '/data',
			JSON.stringify(boat),
			2
		);
		client.send(testMessage);
	};

	return (
		<BoatContext.Provider
			value={{
				boat: [selectedBoat, setBoat],
				boats: [boats, setBoats],
				sendMessage: sendMessage,
				recievedMessage: [recievedMessage, setRecievedMessage],
			}}>
			{props.children}
		</BoatContext.Provider>
	);
};
