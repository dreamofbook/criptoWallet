import React from 'react';
import Modal from "react-modal";
import './errorSendModal.css'
import {useTranslation} from "react-i18next";

const ErrorSendModal = ({error, setError, modalIsOpen, setModalIsOpen}) => {

	const {t} = useTranslation();
	function closeModal() {
		setModalIsOpen(false);
		setError('');
	}

	function openModal() {
		setModalIsOpen(true);
	}

	return (
		<div className="error-send-modal">
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				className={"error-modal"}
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
					<div className={'send-modal-warning'}>
						{t('SendError')}
					</div>
					<div className="error-message">
						{error}
					</div>
					<div className="close-btn">
						<button
							onClick={() => closeModal()}
						>
							{t('delete-cancel-modal')}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ErrorSendModal;