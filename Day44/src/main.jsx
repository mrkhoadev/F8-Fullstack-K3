import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/style.scss'
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-zbpg0fkytxvd7t84.us.auth0.com"
            clientId="8NuA1nZPNifsqXcvifwjGa4ytxCdB1Qj"
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);
