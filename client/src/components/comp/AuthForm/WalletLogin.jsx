// import React, { useState } from 'react';
// import { decryptWallet } from '../../../main-scripts/walletUtils.js';
// import { Wallet } from 'ethers';
// import UseInput from "../../../customHooks/UseInput.jsx";
// import './singForm.css'
// import {useTranslation} from "react-i18next";
//
// const WalletLogin = ({ address, onWalletReady}) => {
// 	const [error, setError] = useState('');
// 	const {t} = useTranslation();
// 	const password = UseInput('', {isEmpty: true, passwordError: false})
//
// 	const handleUnlock = async (e) => {
// 		e.preventDefault();
// 		setError('');
//
// 		try {
// 			const stored = address;
// 			if (!stored) {
// 				setError(t('noSavedWallet'));
// 				return;
// 			}
//
// 			const { encrypted } = JSON.parse(stored);
// 			const decryptedPrivateKey = await decryptWallet(stored, password.value);
//
// 			const wallet = new Wallet(decryptedPrivateKey);
// 			onWalletReady(wallet.address);
//
// 			alert(`Успешно расшифрован! Адрес: ${wallet.address}`);
// 		} catch (err) {
// 			setError(t('passwordErrorSign'));
// 		}
// 	};
//
//
// 	return (
// 		<div className={"singForm"}>
// 			<div className="glass">
// 				<h2 className={'title'}>{t('signWalletTitle')}</h2>
// 				<form onSubmit={(e) => handleUnlock(e)}>
// 					{error && <div className={'error-message'}>{error}</div>}
// 					<input
// 						className={'password-form glassInput'}
// 						size={35}
// 						type="password"
// 						placeholder={t('signPasswordPlaceholder')}
// 						value={password.value}
// 						onChange={(e) => password.onChange(e)}
// 						onBlur={(e) => password.onBlur(e)}
// 					/>
// 					<button className={'submit-btn'} type="submit">{t('unlock')}</button>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
//
// export default WalletLogin;



import React, { useState } from 'react';
import { getWalletFromDb } from '../../../main-scripts/walletStorage.js';
import { decryptWallet } from '../../../main-scripts/walletUtils.js';
import './singForm.css'
import UseInput from "../../../customHooks/UseInput.jsx";
import {useTranslation} from "react-i18next";
import {add} from "react-modal/lib/helpers/classList.js";

const WalletLogin = ({ onWalletReady }) => {
	const {t} = useTranslation();
	const [error, setError] = useState('');
	const [privateKey, setPrivateKey] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');
		setPrivateKey('');

		try {
			if (!/^0x[a-fA-F0-9]{40}$/.test(address.value)) {
				setError('Неверный формат адреса');
				return;
			}

			const walletData = await getWalletFromDb(address.value);
			if (!walletData) {
				setError('Кошелек не найден');
				return;
			}

			const decrypted = await decryptWallet(walletData.encrypted, password);
			if (!/^0x[a-fA-F0-9]{64}$/.test(decrypted)) {
				setError('Не удалось расшифровать приватный ключ. Неверный пароль?');
				return;
			}

			setPrivateKey(decrypted); // опционально показывать
			onWalletReady(address, decrypted);
		} catch (err) {
			console.error('Ошибка входа:', err);
			setError('Ошибка при входе: ' + err.message);
		}
	};

	const password = UseInput('', {isEmpty: true})
	const address = UseInput('', {isEmpty: true, isEthError: false})

	return (
		<div className={"singForm"}>
			<div className={"glass"}>
				<h2 className={'title'}>{t('signWalletTitle')}</h2>
				<form onSubmit={handleLogin}>
					<div>
						<input
							size={35}
							className={'address-form glassInput'}
							type="text"
							placeholder={t('signAddressPlaceholder')}
							value={address.value}
							onChange={(e) => address.onChange(e)}
							onBlur={(e) => address.onBlur(e)}
							required
						/>
					</div>
					<div>
						<input
							size={35}
							className={'password-form glassInput'}
							type="password"
							placeholder={t('signPasswordPlaceholder')}
							value={password.value}
							onChange={(e) => password.onChange(e)}
							onBlur={(e) => password.onBlur(e)}
						/>
					</div>
					<button className={'submit-btn'} type="submit">{t('unlock')}</button>
				</form>
				{error && <p className={'error-message'}>{error}</p>}
				{privateKey && (
					<div className={"private-key"}>
						<strong>Ваш приватный ключ:</strong>
						<pre>{privateKey}</pre>
					</div>
				)}
			</div>
		</div>
	);
};

export default WalletLogin;
