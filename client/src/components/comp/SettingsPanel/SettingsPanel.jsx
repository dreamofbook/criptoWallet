import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UseInput from "../../../customHooks/UseInput.jsx";
import ButtonLanguage from "../../UI/buttons/buttonLanguage/ButtonLanguage.jsx";
import './settings.css'

const SettingsPanel = ({ onRpcChange, onAddressChange }) => {
	const { t, i18n } = useTranslation();
	const [rpc, setRpc] = useState(sessionStorage.getItem('rpcUrl') || '');

	const handleRpcChange = (e) => {
		const value = e.target.value;
		setRpc(value);
		sessionStorage.setItem('rpcUrl', value);
		onRpcChange(value);
	};


	const addressEthereum = UseInput('', {isEmpty: true, isEthError: false});

	return (
		<div className="settings-panel container">
			<div className="glass">
				<h3>{t('settings')}</h3>
				<div className="selection-box">
					<select onChange={(e) => handleRpcChange(e)}>
						<option value={'https://mainnet.infura.io/v3/4b2945248a5b4c7298d0323b52ceed8b'}>Infura</option>
						<option selected>{t('selectRpc')}</option>
					</select>
				</div>
				<div className="input-box">
					{addressEthereum.errorMessage && <div className={'error-message'}>{addressEthereum.errorMessage}</div>}
					<input
						type={"text"}
						value={addressEthereum.address}
						onChange={(e) => addressEthereum.onChange(e, onAddressChange)}
						onBlur={(e) => addressEthereum.onBlur(e)}
						placeholder="Ethereum address"
						size={47}
					/>
				</div>
				<div className="btn-box">
					<ButtonLanguage lang={'en'}>🇬🇧</ButtonLanguage>
					<ButtonLanguage lang={'ru'}>🇷🇺</ButtonLanguage>
				</div>
			</div>
		</div>
	);
};

export default SettingsPanel;
