// import React, {useEffect, useMemo, useState} from 'react';
// import { JsonRpcProvider, formatEther } from 'ethers';
// import './wallet-mini.css';
// import {Link} from "react-router";
// import {useTranslation} from "react-i18next";
// import copyBtn from '../../../../../assets/image/copyButton.svg'
// import FastButtons from "../fastButtons/FastButtons.jsx";
// import tokens from'../../../../../main-scripts/tokens.json'
// import { ethers } from 'ethers';
// import {getTokenBalance, getTokenPriceBinance} from '../../../../../../../server/scripts/erc20Service.js'
//
//
// const WalletMini = ({ address, rpcUrl, addressesTokens, length }) => {
// 	const {t} = useTranslation();
//
//
// 	console.log(addressesTokens);
//
// 	return (
// 		<div className="wallet-component">
// 			<div className="wallet">
// 				<div className="glass">
// 					<div className={"wallet-info"}>
// 						<div className={'address-box'}>
// 							<h4>{t('wallet-address')}: <code>{address}</code></h4>
// 							<button className="copy-btn" onClick={() => copy(address)}>
// 								<img src={copyBtn} alt=""/>
// 							</button>
// 						</div>
// 						<div className={'balance-box'}>
// 							<div className="balance-tokens">
// 								{addressesTokens.size === length?  (
// 										<>
// 											{addressesTokens.get(address.toString()).map((token) =>
// 												<div className={`token ${token.symbol}`} key={token.symbol}>
// 													{t('balance-value')}: {token.balance} {token.symbol}
// 													<br/>{t('atThisRatePhrase')} : ${token.price}
// 													<br/>{t('amountTokenPrice')} : ${token.valueUSD.toFixed(2)}
// 													<br/>{token.symbol}: {token.balance} ≈ $
// 												</div>
// 											)}
// 										</>
// 									) : (
// 										<>
// 											Loading...
// 										</>
// 									)}
// 							</div>
// 							{/*<div className={"finally-amount"}>*/}
// 							{/*	<p>{t('finally-amount')}: <strong>{totalUSD} / USDT</strong></p>*/}
// 							{/*</div>*/}
// 							{/*<div className={'balance-currency'}>*/}
// 							{/*    ${totalUSD.toFixed(2)}*/}
// 							{/*	/!*<span>{t('currency-value')}: {exchangeRate ? `${exchangeRate} ${currency}` : '...'} / ETH</span>*!/*/}
// 							{/*</div>*/}
// 						</div>
// 					</div>
// 					<div className="btnLink">
// 						<Link to={`/wallets/fullpage/${address}`}>
// 							<div className="toWallet-btn">
// 								{t("toWallet-btn")}
// 							</div>
// 						</Link>
// 					</div>
// 				</div>
// 			</div>
// 			<FastButtons address={address} isMini={true}/>
// 		</div>
// 	);
// };
//
// export default WalletMini;



// wallet-mini.jsx
import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import copyBtn from '../../../../../assets/image/copyButton.svg';
import FastButtons from '../fastButtons/FastButtons.jsx';
import { useTokenPrices } from '../../../../../customHooks/UseTokenPrices.jsx';
import './wallet-mini.css';

const WalletMini = ({ address, addressesTokens }) => {
	const { t } = useTranslation();
	const { prices } = useTokenPrices();

	const tokenList = addressesTokens.get(address.toString()) || [];

	return (
		<div className="wallet-component">
			<div className="wallet">
				<div className="glass">
					<div className={"wallet-info"}>
						<div className={'address-box'}>
							<h4>{t('wallet-address')}: <code>{address}</code></h4>
							<button className="copy-btn" onClick={() => navigator.clipboard.writeText(address)}>
								<img src={copyBtn} alt="copy" />
							</button>
						</div>
						<div className={'balance-box'}>
							<div className="balance-tokens">
								{tokenList.length > 0 ? (
									tokenList.map((token) => {
										const currentPrice = prices[token.symbol]?.price || 0;
										const valueUSD = token.balance * currentPrice;
										return (
											<div className={`token ${token.symbol}`} key={token.symbol}>
												{t('balance-value')}: {token.balance} {token.symbol}<br />
												{t('atThisRatePhrase')}: ${currentPrice}<br />
												{t('amountTokenPrice')}: ${valueUSD.toFixed(2)}
											</div>
										);
									})
								) : (
									<>Loading...</>
								)}
							</div>
						</div>
					</div>
					<div className="btnLink">
						<Link to={`/wallets/fullpage/${address}`}>
							<div className="toWallet-btn">
								{t('toWallet-btn')}
							</div>
						</Link>
					</div>
				</div>
			</div>
			<FastButtons address={address} isMini={true} />
		</div>
	);
};

export default WalletMini;
