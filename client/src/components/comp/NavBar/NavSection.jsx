import React from 'react';
import "./headerSection.css"
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

const NavSection = ({className, path}) => {

	const {t} = useTranslation();

	return (
		<Link
			className={className + ' menu'}
			to={path}
		>
			{t(className)}
		</Link>
	)
};

export default NavSection;