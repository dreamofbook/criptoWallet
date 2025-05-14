import React from 'react';
import './fastBtn.css'
import sendImage from '../../../../assets/image/ArrowSend.svg'
import deleteImage from '../../../../assets/image/deleteWalletBtn.svg'
import swapImage from '../../../../assets/image/swapBtn.svg'
import {Link} from "react-router";

const FastButtons = ({}) => {


	const swapScript = () => {}
	const deleteScript = () => {}
	const sendScript = () => {}

	return (
		<div className="fast-buttons">
			<div className="send btn">
				<Link to={''}>
					<img src={sendImage} alt="" />
					Send
				</Link>
			</div>
			<div className="swap btn">
				<Link to={''}>
					<img src={swapImage} alt="" />
					Swap
				</Link>
			</div>
			<div className="delete btn">
				<Link to={''}>
					<img src={deleteImage} alt="" />
					Delete
				</Link>
			</div>
		</div>
	);
};

export default FastButtons;