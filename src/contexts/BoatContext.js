import { useState, createContext, useEffect } from 'react';
import Axios from 'axios';
import * as mqtt from 'react-paho-mqtt';
export const BoatContext = createContext();

export const BoatProvider = (props) => {
	// Currently all available boats
	const [boats, setBoats] = useState([]);

	// currently selected boat
	const [selectedBoat, setBoat] = useState('');

	//confirmation message from device, if message has arrived and been handled
	const [recievedMessage, setRecievedMessage] = useState('');

	// mqtt client
	const [client, setClient] = useState(null);

	useEffect(() => {
		// get all boats from dweet
		getBoats();
		// initialize mqtt connection
		_init();
	}, [boats]);

	const _init = () => {
		const c = mqtt.connect(
			'161.35.167.71',
			Number(8000),
			'mqtt',
			_onConnectionLost,
			_onMessageArrived
		);
		c.connect({
			userName: process.env.REACT_APP_MQTT_USERNAME,
			password: process.env.REACT_APP_MQTT_PASSWORD,
			onSuccess: () => {
				console.log('connected');
				c.subscribe('#');
			},
			useSSL: false,
		});

		setClient(c);
	};

	const getBoats = () => {
		// first URL, find all available IDs from Particle cloud
		var url = `https://api.particle.io/v1/devices?access_token=${process.env.REACT_APP_PARTICLE_TOKEN}`;
		Axios.get(url).then((response) => {
			//based on array of devices from get request above, get all dweets from dweet.io
			response.data.map((device) => {
				Axios.get(`http://dweet.io/get/latest/dweet/for/${device.id}`).then(
					(response) => {
						// is response successful
						if (response.data.this === 'succeeded') {
							// check if this id is allready in boats
							const index = boats.findIndex(
								(element) => element.id === device.id
							);
							// if not in boats, then add Id
							if (index === -1) {
								var boat = response.data.with[0].content;
								boat['id'] = device.id;
								// JSON object from dweet is number 1 || 0, convert to boolean value instead
								boat.unlock = boat.unlock ? true : false;
								// add to boats array
								setBoats([...boats, boat]);
								// add the boat's state so not loading icon appears
								setRecievedMessage(boat.unlock ? true : false);
							}
						}
					}
				);
			});
		});
	};

	const _onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
			console.log('onConnectionLost: ' + responseObject.errorMessage);
		}
	};

	// callback if incoming mqtt message
	const _onMessageArrived = (message) => {
		// split the topicpath for identifying message type
		const topicPath = message.topic.split('/');
		const id = topicPath[0];
		const index = boats.findIndex((element) => element.id === id);
		var boatsTemp = boats;

		// if topic path is last will, then bad disconnection, add lastwill property and set true
		// makes boat unavailable
		if (topicPath[1] === 'lastWill') {
			if (index !== -1) {
				boatsTemp[index]['lastWill'] = true;
			}

			// if the topic path is data, // manipulate boat array
		} else if (topicPath[1] === 'data') {
			let data = JSON.parse(message.payloadString);

			data['id'] = id;

			// boat is not in boats array, add it to array
			if (index === -1) {
				boatsTemp.push(data);
				// make sure you update the recieved message to,prevent loading icon appearing
				setRecievedMessage(data.unlock);
			} else {
				boatsTemp.splice(index, 1, data);
			}

			// update dweet.io with new state from mqtt message
			var url = `http://www.dweet.io/dweet/for/2a003b000a47373336323230?latitude=${data.latitude}&longitude=${data.longitude}&unlock=`;

			url += data.unlock ? '1' : '0';
			Axios.get(url);

			// if topic path is confirm status, then set recievedMessage accordingly
		} else if (topicPath[1] === 'confirmStatus') {
			setRecievedMessage(message.payloadString === 'locked' ? false : true);
			return;
		}

		// update boats array
		setBoats([...boatsTemp]);
	};

	// Start tur / avslutt tur has been clicked, send mqtt message, and update dweet.io
	const sendMessage = (boat) => {
		boat.unlock = !boat.unlock;

		var url = `http://www.dweet.io/dweet/for/2a003b000a47373336323230?latitude=${boat.latitude}&longitude=${boat.longitude}&unlock=`;

		url += boat.unlock ? '1' : '0';

		Axios.get(url);

		const testMessage = mqtt.parsePayload(
			boat.id + '/data',
			JSON.stringify({
				latitude: boat.latitude,
				longitude: boat.longitude,
				unlock: boat.unlock,
			}),
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
