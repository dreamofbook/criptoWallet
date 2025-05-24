import React from 'react';
import './transaction.css'
import {useTranslation} from "react-i18next";

const TransactionDetails = ({from, to, time, value, errorStatus}) => {
	const {t} = useTranslation();

	return (
		<div className={"transaction"}>
			<div className={"tx-trans"}>
				<p className={"from"}>
					{t('from')}: <span>{from}</span>
				</p>
				<p className={"to"}>
					{t('to')}: <span>{to}</span>
				</p>
			</div>
			<div className={"tx-time"}>
				<p className={"time"}>
					{t('timeSent')}: <span>{time}</span>
				</p>
			</div>
			<div className={"tx-value"}>
				<p className={"value"}>
					{t('valueSent')}: <span>{value} ETH</span>
				</p>
				<p className={"trans-status"}>
					{t('status')}: {errorStatus}
				</p>
			</div>
		</div>
	);
};

export default TransactionDetails;