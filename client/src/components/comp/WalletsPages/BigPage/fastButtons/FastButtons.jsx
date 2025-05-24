import React, {useEffect, useState} from 'react';
import './fastBtn.css'
import sendImage from '../../../../../assets/image/ArrowSend.svg'
import deleteImage from '../../../../../assets/image/deleteWalletBtn.svg'
import swapImage from '../../../../../assets/image/swapBtn.svg'
import {deleteWalletFromDb} from "../../../../../main-scripts/walletStorage.js";
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
						<a>
							<img src={sendImage} alt="" />
							Send
						</a>
					</div>
					<div className="swap btn">
						<a>
							<img src={swapImage} alt="" />
							Swap
						</a>
					</div>
					<div className="delete btn">
						<a
							onClick={() => {
								setModalIsOpen(true)
							}}
						>
							<img src={deleteImage} alt="" />
							Delete
						</a>
					</div>
					<DeleteModal
						modalIsOpen={modalIsOpen}
						setModalIsOpen={setModalIsOpen}
						setDeleteFinally={setDeleteFinally}
					/>
				</div>
			) : (
				<div className={'maxi-buttons'}>
					<div className="send btn">
						<a>
							<img src={sendImage} alt="" />
							Send
						</a>
					</div>
					<div className="swap btn">
						<a>
							<img src={swapImage} alt="" />
							Swap
						</a>
					</div>
				</div>
			)}
		</>
	);
};

export default FastButtons;