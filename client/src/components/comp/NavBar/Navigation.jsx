import './navigation.css'
import NavSection from "./NavSection.jsx";
import {useState} from "react";
import arr from'./arr.json'

const Navigation = () => {

	const [inNav, setInNav] = useState(null);
	const [active, setActive] = useState(0);

	return (
		<div className={'navigation'}>
			<div className="NavBar">
				{arr.map((item, index) =>
					<NavSection
						path={item.path}
						id={item.id}
						className={item.title}
						key={index}
					>{item.title}</NavSection>
				)}
			</div>
		</div>
	);
};
export default Navigation;