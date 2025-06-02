import React, {useState} from 'react';
import './sendForm.css'
import UseInput from "../../../../../customHooks/UseInput.jsx";
import sendImage from "../../../../../assets/image/ArrowSend.svg";
import {useTranslation} from "react-i18next";
import CurrencyForm from "./CurrencyForm.jsx";
import downArrow from "../../../../../assets/image/downArrow.svg";
import {sendAssetFromStorage} from "../../../../../main-scripts/sendScripts.js";
import UseCurrencyInput from "../../../../../customHooks/UseCurrencyInput.jsx";
import ErrorSendModal from "./ErrorSend/ErrorSendModal.jsx";
import {verifyWalletPassword} from "../../../../../main-scripts/verifyWalletPassword.js";

const SendForm = ({fromAddress, rpcUrl, tokens}) => {

	const {t} = useTranslation();
	const [error, setError] = useState('');
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [isFromValid, setIsFromValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState(null);
	const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("ETH");
	const [selectedTokenAddress, setSelectedTokenAddress] = useState("");

	const secondAddress = UseInput('', {isEmpty: false, isEthError: false});
	const password = UseInput('', {isEmpty: false});
	const currencies = UseCurrencyInput('', '', selectedTokenSymbol);

	const handlerSend = async (e) => {
		if (!isFromValid) {
			setError(secondAddress.errorMessage ?
				secondAddress.errorMessage === 'Это поле не может быть пустым'
					? "Введите адрес кошелька-получателя"
					: secondAddress.errorMessage
				: `Введите пароль от кошелька-отправителя:\n${fromAddress}`);
			setModalIsOpen(true);
			// return;
		}

		e.preventDefault();
		setLoading(true);
		setStatus(null);

		try {
			// ✅ Проверка пароля перед отправкой
			const isValidPassword = await verifyWalletPassword(fromAddress, password.value);
			if (!isValidPassword) {
				setError("❌ Неверный пароль");
				setModalIsOpen(true);
				setLoading(false);
				return;
			} else {
				console.log("Пароль верен все кайф");
			}

			const tokenInfo = tokens.find(t => t.symbol === selectedTokenSymbol);
			const tokenAddress = tokenInfo?.address || null;

			const txHash = await sendAssetFromStorage({
				fromAddress,
				password: password.value,
				toAddress: secondAddress.value,
				amount: currencies.currencyETH,
				rpcUrl,
				tokenAddress
			});

			setStatus(`✅ Успешно отправлено! TX Hash: ${txHash}`);
			setModalIsOpen(true);
		} catch (err) {
			setStatus(`❌ Ошибка: ${err.message}`);
			setModalIsOpen(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="send-box">
			<div className={'send-form glass'}>
				<input
					className={'send-from glassInput'}
					value={fromAddress}
					disabled={true}
					size={51}
				/>
				<img src={downArrow} alt=""/>
				{secondAddress.errorMessage && <p className={"error-message"}>{secondAddress.errorMessage}</p>}
				<input
					placeholder={t('sendToPlaceholder')}
					className={'send-to glassInput'}
					value={secondAddress.value}
					onChange={(e) => secondAddress.onChange(e)}
					onBlur={() => secondAddress.onBlur()}
					size={51}
				/>
				<CurrencyForm
					currencies={currencies}
					tokens={tokens}
					setSelectedTokenSymbol={setSelectedTokenSymbol}
					setSelectedTokenAddress={setSelectedTokenAddress}
					selectedTokenAddress={selectedTokenAddress}
				/>
				<div className={'password-form'}>
					{password.errorMessage && <p className={"error-message"}>{password.errorMessage}</p>}
					<input
						className="glassInput"
						type="password"
						placeholder={t('signPasswordPlaceholder')}
						value={password.value}
						onChange={(e) => password.onChange(e)}
						onBlur={() => password.onBlur()}
						size={51}
					/>
				</div>
				{status && <p className={'status-message'}>{status}</p>}
			</div>
			<button
				className="send"
				onClick={(e) => handlerSend(e)}
				disabled={loading}
			>
				{loading? (
					<a>
						<img src={sendImage} alt="" />
						Sending...
					</a>
				) : (
					<a>
						<img src={sendImage} alt="" />
						Send
					</a>
				)}
			</button>
			<ErrorSendModal
				error={error}
				setError={setError}
				modalIsOpen={modalIsOpen}
				setModalIsOpen={setModalIsOpen}
			/>
		</div>
	);
};

export default SendForm;