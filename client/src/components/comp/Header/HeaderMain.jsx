import React from 'react';
import Navigation from "../NavBar/Navigation.jsx";
import SettingsPanel from "../SettingsPanel/SettingsPanel.jsx";
import Logo from "../logo/Logo.jsx";
import './headerMain.css'

const HeaderMain = ({ onRpcChange, onAddressChange }) => {
	return (
		<div className="HeaderMain">
			<Logo/>
			<Navigation/>
			<SettingsPanel
				onRpcChange={onRpcChange}
				onAddressChange={onAddressChange}
			/>
		</div>
	);
};

export default HeaderMain;