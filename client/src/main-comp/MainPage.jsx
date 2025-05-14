import React from 'react';
import {Outlet} from "react-router";
import Navigation from "../components/comp/NavBar/Navigation.jsx";
import "../styles/App.css"
import backgroundImg from "../assets/image/background.jpg";
import HeaderMain from "../components/comp/Header/HeaderMain.jsx";

const MainPage = ({ onRpcChange, onAddressChange }) => {
	return (
		<div className="app container">
			<img src={backgroundImg} className={'backgroundImg'} alt=""/>
			<HeaderMain onAddressChange={onAddressChange} onRpcChange={onRpcChange}/>
			<Outlet/>
		</div>
	);
};

export default MainPage;