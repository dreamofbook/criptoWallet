import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useLocation, useNavigate} from "react-router";
import ButtonLanguage from "../../UI/buttons/buttonLanguage/ButtonLanguage.jsx";
import './settings.css';
import settingsIcon from '../../../assets/image/settings_icon.svg';

const SettingsPanel = ({ onRpcChange, wallets }) => {
	const { t, i18n } = useTranslation();
	const [rpc, setRpc] = useState(sessionStorage.getItem('rpcUrl') || '');
	const [activeSettings, setActiveSettings] = useState(false);
	const [address, setAddress] = useState('');
	const navigate = useNavigate();

	const handleRpcChange = (e) => {
		const value = e.target.value;
		setRpc(value);
		localStorage.setItem('rpcUrl', value);
		onRpcChange(value);
	};
	const handleSettings = (e) => {
		setActiveSettings(!activeSettings);
	}

	React.useEffect(() => {
		if (activeSettings) {
			try{
				const right = document.querySelector('.settings-panel .background img')
				const positionSet = right.getBoundingClientRect();
				const division = document.querySelector('.settings-active')
				const positionDiv = division.getBoundingClientRect();

				division.style.opacity = 1;
				division.style.backdropFilter = 'blur(20px)';
				division.style.left = ((positionSet.left + (positionSet.width / 2)) - (positionDiv.width / 2)) + 'px';
			} catch (err){
				console.error(err);
			}
		} else {

		}

	},[activeSettings]);

	React.useEffect(() => {
		navigate(`/wallets/fullpage/${address}`);
	}, [address])

	const location = useLocation();

	return (
		<>
			<div className="settings-panel">
				<div className="background">
					<img src={settingsIcon} alt="" onClick={(e) => handleSettings(e)} />
					<ButtonLanguage lang={'en'}>🇬🇧</ButtonLanguage>
					<ButtonLanguage lang={'ru'}>🇷🇺</ButtonLanguage>
				</div>
				{activeSettings && (
					<div className="settings-active">
						<div className="glass">
							<h3>{t('settings')}</h3>
							<div className="selection-box">
								<select value={rpc} onChange={(e) => handleRpcChange(e)}>
									<option value={'https://mainnet.infura.io/v3/4b2945248a5b4c7298d0323b52ceed8b'}>Infura</option>
									<option>{t('selectRpc')}</option>
								</select>
							</div>
							{location.pathname.slice(0,17) === '/wallets/fullpage' && (
								<div className="select-address">
									<select onChange={(e) =>
										setAddress(e.target.value)
									}>
										{wallets.map((wallet, index) =>
											<option key={index} value={wallet}>{wallet}</option>
										)}
									</select>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>

	);
};

export default SettingsPanel;
