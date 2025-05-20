import React, {useEffect, useState} from 'react';
import './fastBtn.css'
import sendImage from '../../../../assets/image/ArrowSend.svg'
import deleteImage from '../../../../assets/image/deleteWalletBtn.svg'
import swapImage from '../../../../assets/image/swapBtn.svg'
import {Link} from "react-router";
import {deleteWalletFromDb} from "../../../../main-scripts/walletStorage.js";
import Modal from "react-modal";
import DeleteModal from "./DeleteModal/deleteModal.jsx";

Modal.setAppElement('#root');

const FastButtons = ({address, isMini}) => {

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [deleteFinally, setDeleteFinally] = useState(false);
	useEffect(() => {
		if (deleteFinally) {
			deleteWalletFromDb(address);
		}
	},[deleteFinally])

	return (
		<>
			{isMini ? (
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
						<Link to={''}
							onClick={() => {
								setModalIsOpen(true)
							}}
						>
							<img src={deleteImage} alt="" />
							Delete
						</Link>
					</div>
					<DeleteModal
						modalIsOpen={modalIsOpen}
						setModalIsOpen={setModalIsOpen}
						setDeleteFinally={setDeleteFinally}
					/>
				</div>
			) : (
				<div className={'maxi-buttons'} style={{width:'max-content'}}>
					gbcmrfds
				</div>
			)}
		</>
	);
};

export default FastButtons;