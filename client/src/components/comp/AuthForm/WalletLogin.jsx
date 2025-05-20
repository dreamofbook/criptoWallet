import React, { useState } from 'react';
import { decryptWallet } from '../../../main-scripts/walletUtils.js';
import { Wallet } from 'ethers';
import UseInput from "../../../customHooks/UseInput.jsx";
import './singForm.css'
import {useTranslation} from "react-i18next";

const WalletLogin = ({ address, onWalletReady}) => {
	const [error, setError] = useState('');
	const {t} = useTranslation();
	const password = UseInput('', {isEmpty: true, passwordError: false})

	const handleUnlock = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const stored = address;
			if (!stored) {
				setError(t('noSavedWallet'));
				return;
			}

			const { encrypted } = JSON.parse(stored);
			const decryptedPrivateKey = await decryptWallet(stored, password.value);

			const wallet = new Wallet(decryptedPrivateKey);
			onWalletReady(wallet.address);

			alert(`Успешно расшифрован! Адрес: ${wallet.address}`);
		} catch (err) {
			setError(t('passwordErrorSign'));
		}
	};


	return (
		<div className={"singForm"}>
			<div className="glass">
				<h2 className={'title'}>{t('signWalletTitle')}</h2>
				<form onSubmit={(e) => handleUnlock(e)}>
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
		</div>
	);
};

export default WalletLogin;
