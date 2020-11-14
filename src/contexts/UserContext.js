import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
	const [user, setUser] = useState({
		username: 'fredrik12',
	});

	return <UserContext.Provider>{props.children}</UserContext.Provider>;
};
