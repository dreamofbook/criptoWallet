import React from 'react';
import './buttonLanguage.css'
import {useTranslation} from "react-i18next";

const ButtonLanguage = ({children, lang}) => {

	const { t, i18n } = useTranslation();
	const handleChangeLang = (lang) => {
		i18n.changeLanguage(lang);
		localStorage.setItem('lang', lang);
	};

	return (
		<button
			type="button"
			className="buttonLanguage"
			onClick={() => handleChangeLang(lang)}
		>
			{children}
		</button>
	);
};

export default ButtonLanguage;