import ReactDOM from 'react-dom/client';
import '../main-scripts/i18n.js'
import RoutingComp from "./RoutingComp.jsx";
import {StrictMode} from "react";

ReactDOM.createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RoutingComp/>
	</StrictMode>
)
