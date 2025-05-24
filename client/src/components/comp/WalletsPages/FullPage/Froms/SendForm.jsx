import React, {useState} from 'react';
import downArrow from '../../../../../assets/image/downArrow.svg';
import './sendForm.css'
import UseInput from "../../../../../customHooks/UseInput.jsx";
import sendImage from "../../../../../assets/image/ArrowSend.svg";
import {useTranslation} from "react-i18next";

const SendForm = ({address, currency}) => {

	const secondAddress = UseInput('', {isEmpty: false, isEthError: false});
	const {t} = useTranslation();

	const currencyRate = UseInput('', {isEmpty: false, });
	const currencyEther = UseInput('', {isEmpty: false, });

	return (
		<div className="send-box">
			<div className={'send-form glass'}>
				<input
					className={'send-from glassInput'}
					value={address}
					disabled={true}
					size={50}
				/>
				<div className={'center-box'}>
					<input
						type="number"
						className="eth-equal"
						value={currencyEther}
						placeholder={'ETH'}
					/>
					<img src={downArrow} alt=""/>
					<input
						type="number"
						className="currency-equal"
						value={currencyRate}
						placeholder={currency}
					/>
				</div>
				<input
					className={'send-to glassInput'}
					value={secondAddress.value}
					onChange={(e) => secondAddress.onChange(e)}
					onBlur={() => secondAddress.onBlur()}
					size={50}
				/>
			</div>
			<div className="send">
				<a>
					<img src={sendImage} alt="" />
					Send
				</a>
			</div>
		</div>
	);
};

export default SendForm;