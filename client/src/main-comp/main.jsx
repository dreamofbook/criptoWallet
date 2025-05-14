import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import '../main-scripts/i18n.js'
import RoutingComp from "./RoutingComp.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    // <App/>
	<RoutingComp/>
)
