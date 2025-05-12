import React from 'react';
import './logOut.css'

const LogoutButton = ({ onLogout }) => {
	const handleLogout = () => {
		localStorage.removeItem('wallet');
		onLogout();
	};

	return (
		<button onClick={handleLogout}>
			Выйти
		</button>
	);
};

export default LogoutButton;
