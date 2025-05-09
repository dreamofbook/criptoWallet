import React from 'react';
import './transaction.css'

const Transaction = ({from, to, time, value, errorStatus}) => {
	return (
		<div className="transation">
			<div className="tx-trans">
				<div className="from">
					{from}
				</div>
				<div className="to">
					{to}
				</div>
			</div>
			<div className="tx-time">
				{time}
			</div>
			<div className="value">
				{value} ETH<br/>status: {errorStatus}
			</div>
		</div>
	);
};

export default Transaction;