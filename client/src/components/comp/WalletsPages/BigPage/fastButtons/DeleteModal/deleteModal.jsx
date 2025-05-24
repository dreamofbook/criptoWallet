import React, {useState} from 'react';
import Modal from "react-modal";
import './deleteModal.css'
import {useTranslation} from "react-i18next";
import {deleteWalletFromDb} from "../../../../../../main-scripts/walletStorage.js";

const DeleteModal = ({modalIsOpen,setModalIsOpen,setDeleteFinally}) => {

	const {t} = useTranslation();
	function closeModal() {
		setModalIsOpen(false);
	}

	function deleteFromModal() {
		closeModal();
		setDeleteFinally(true);
	}

	function openModal() {
		setModalIsOpen(true);
	}



	return (
		<div className="deleteModal">
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				className={"delete-modal"}
				style={{
					overlay: {
						position: "fixed",
						zIndex: 999,
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						height: "100vh",
						width: "100vw",
						backgroundColor: "rgba(0, 0, 0, 0.75)",
						justifyItems: "center",
						alignContent: "center",
					},
					content: {
						width: "max-content",
						height: "max-content",
						// justifySelf: "center",
						// alignSelf: "center",
						background: "#fff",
						borderRadius: "20px",
						backgroundColor: "#ececec",
						padding: "16px 32px"
					}
				}}
			>
				<div className="inside-modal">
					<div className={'delete-modal-warning'}>
						{t('warning')}
					</div>
					<div className={'delete-modal-body'}>
						{t('warning-description')}
					</div>
					<div className="delete-modal-buttons">
						<button className="cancel"
						onClick={() => closeModal}>
							{t('delete-cancel-modal')}
						</button>
						<button className="delete"
						onClick={() => deleteFromModal()}>
							{t('delete-wallet-modal')}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default DeleteModal;