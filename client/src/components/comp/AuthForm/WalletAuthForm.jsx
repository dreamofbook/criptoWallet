import React, { useState } from 'react';
import {
	generateWallet,
	importWalletFromMnemonic,
	importWalletFromPrivateKey,
} from '../../../main-scripts/walletUtils.js';
import UseInput from "../../../customHooks/UseInput.jsx";
import './auth.css'
import {useTranslation} from "react-i18next";
import { saveWalletToDb } from "../../../main-scripts/walletStorage.js";

const WalletAuthForm = ({ onWalletReady }) => {
	const [mode, setMode] = useState('generate');
	const {t} = useTranslation();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			let result;

			if (mode === 'generate') {
				result = await generateWallet(password.value);
			} else if (mode === 'import-mnemonic') {
				result = await importWalletFromMnemonic(seedPhrase.value.trim(), password.value);
			} else if (mode === 'import-key') {
				result = await importWalletFromPrivateKey(privateKey.value.trim(), password.value);
			}

			// localStorage.setItem('wallet', JSON.stringify([{
			// 	address: result.address,
			// 	encrypted: result.encrypted
			// 	},{
			//
			// }
			// ]));
			//
			// onWalletReady(result.address);

			await saveWalletToDb(result.address, result.encrypted, true);

			onWalletReady(result.address);
			alert(`Кошелёк добавлен: ${result.address}`);

		} catch (err) {
			console.error(err);
		}
	};

	const password = UseInput('', {isEmpty: true, passwordError: false})
	const seedPhrase = UseInput('', {isEmpty: true, bipError: false})
	const privateKey = UseInput('', {isEmpty: true, privateKeyError: false})

	return (
		<div className="auth-form">
			<div className="glass">
				<h2 className={'title'}>{t('walletTitle')}</h2>

				<div className="types-form">
					<div className="box-types-form">
						<input
							type="radio"
							name="mode"
							checked={mode === 'generate'}
							onChange={() => { setMode('generate');}}
						/>
						<label
							onClick={() => { setMode('generate');}}
						>
							{t('generateRadio')}
						</label>
					</div>
					<div className="box-types-form">
						<input
							type="radio"
							name="mode"
							checked={mode === 'import-mnemonic'}
							onChange={() => { setMode('import-mnemonic');}}
						/>
						<label
							onClick={() => { setMode('import-mnemonic');}}
						>

							{t('seedPhraseRadio')}
						</label>
					</div>
					<div className="box-types-form">
						<input
							type="radio"
							name="mode"
							checked={mode === 'import-key'}
							onChange={() => { setMode('import-key');}}
						/>
						<label onClick={() => { setMode('import-key');}}
						>
							{t('privateKeyRadio')}
						</label>
					</div>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={'types-input'}>
						{mode === 'import-mnemonic' && (
							<>
								{seedPhrase && (<div className={'error-message'}>{seedPhrase.errorMessage}</div>)}
								<textarea
									rows="3"
									cols="50"
									placeholder={t('mnemonicPlaceHolder')}
									value={seedPhrase.value}
									onChange={(e) => seedPhrase.onChange(e)}
									onBlur={(e) => seedPhrase.onBlur(e)}
								/>
							</>
						)}
						{mode === 'import-key' && (
							<>
								{privateKey.errorMessage && (<div className={'error-message'}>{privateKey.errorMessage}</div>)}
								<textarea
									rows="3"
									cols="50"
									placeholder={t('privateKeyPlaceHolder')}
									value={privateKey.value}
									onChange={(e) => privateKey.onChange(e)}
									onBlur={(e) => privateKey.onBlur(e)}
								/>
							</>
						)}
					</div>

					<div className={'password-form'}>
						{password.errorMessage && <div className={'error-message'}>{password.errorMessage}</div>}
						<input
							size={35}
							type="password"
							placeholder={t('passwordPlaceHolder')}
							value={password.value}
							onChange={(e) => password.onChange(e)}
							onBlur={(e) => password.onBlur(e)}
						/>
					</div>

					<button
						className={'submit-btn'}
						type="submit"
						disabled={!(password.isInputValid && seedPhrase.isInputValid)}
					>{t('continue')}</button>
				</form>
			</div>
		</div>
	);
};

export default WalletAuthForm;
