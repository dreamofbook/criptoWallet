import React from 'react';
import {Outlet} from "react-router";
import "../styles/App.css"
import backgroundImg from "../assets/image/background.jpg";
import HeaderMain from "../components/comp/Header/HeaderMain.jsx";


const MainPage = ({ onRpcChange, wallets }) => {

	return (
		<div className="app container">
			<img src={backgroundImg} className={'backgroundImg'} alt=""/>
			<HeaderMain onRpcChange={onRpcChange} wallets={wallets}/>
			<Outlet/>
		</div>
	);
};

export default MainPage;