import React, {useState} from 'react';
import './sendForm.css'
import UseInput from "../../../../../customHooks/UseInput.jsx";
import sendImage from "../../../../../assets/image/ArrowSend.svg";
import {useTranslation} from "react-i18next";
import CurrencyForm from "./CurrencyForm.jsx";
import downArrow from "../../../../../assets/image/downArrow.svg";
import {sendEthTransactionFromStorage} from "../../../../../main-scripts/sendScripts.js";
import UseCurrencyInput from "../../../../../customHooks/UseCurrencyInput.jsx";
import ErrorSendModal from "./ErrorSend/ErrorSendModal.jsx";

const SendForm = ({address, currency, ethBalance, exchangeRate}) => {

	const secondAddress = UseInput('', {isEmpty: false, isEthError: false});
	const {t} = useTranslation();
	const password = UseInput('', {isEmpty: false});
	const [error, setError] = useState('');
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [isFromValid, setIsFromValid] = useState(false);

	const currencies = UseCurrencyInput('', '', ethBalance, exchangeRate, currency);

	const handlerSend = async () => {
		if (isFromValid) {
			setError('')
		} else if (!isFromValid){

			setError(secondAddress.errorMessage ?
				secondAddress.errorMessage === "Это поле не может быть пустым" ?
					"Введите адрес кошелька-получателя" : secondAddress.errorMessage
				:
				`Введите пароль от кошелька-отправителя:\n${address}`)
		} else {
			if (ethBalance) {
				setError(t('balanceErrorNull'))
			} else if (ethBalance >= currencies.currencyETH){
				setError(t('balanceErrorToMuch'))
			}
		}
		setModalIsOpen(true);
	}

	React.useEffect(() => {
		setIsFromValid(
			password.isInputValid && secondAddress.isInputValid
			&& ethBalance >= currencies.currencyETH && ethBalance
		)
	}, [currencies.currencyETH, currencies.currencyRate, password, secondAddress]);

	return (
		<div className="send-box">
			<div className={'send-form glass'}>
				<input
					className={'send-from glassInput'}
					value={address}
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
				<CurrencyForm currency={currency} ethBalance={ethBalance} exchangeRate={exchangeRate} currencies={currencies}/>
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
			</div>
			<div className="send" onClick={() => handlerSend()}>
				<a>
					<img src={sendImage} alt="" />
					Send
				</a>
			</div>
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