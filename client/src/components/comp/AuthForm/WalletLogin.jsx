import React, { useState } from 'react';
import { decryptWallet } from '../../../main-scripts/walletUtils.js';
import { Wallet } from 'ethers';
import UseInput from "../../../customHooks/UseInput.jsx";
import './singForm.css'
import {useTranslation} from "react-i18next";

const WalletLogin = ({ onWalletReady }) => {
	const [error, setError] = useState('');
	const {t} = useTranslation();

	const handleUnlock = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const stored = localStorage.getItem('wallet');
			if (!stored) {
				setError(t('noSavedWallet'));
				return;
			}

			const { encrypted } = JSON.parse(stored);
			const decryptedPrivateKey = await decryptWallet(encrypted, password.value);

			const wallet = new Wallet(decryptedPrivateKey);
			onWalletReady(wallet.address);

			alert(`Успешно расшифрован! Адрес: ${wallet.address}`);
		} catch (err) {
			setError(t('passwordErrorSign'));
		}
	};

	const password = UseInput('', {isEmpty: true, passwordError: false})

	return (
		<div className={"singForm glass"}>
			<h2 className={'title'}>{t('signWalletTitle')}</h2>
			<form onSubmit={handleUnlock}>
				{error && <div className={'error-message'}>{error}</div>}
				<input
					className={'password-form glassInput'}
					size={35}
					type="password"
					placeholder={t('signPasswordPlaceholder')}
					value={password.value}
					onChange={(e) => password.onChange(e)}
					onBlur={(e) => password.onBlur(e)}
				/>
				<button className={'submit-btn'} type="submit">{t('unlock')}</button>
			</form>
		</div>
	);
};

export default WalletLogin;
