// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './styles/App.css';
// import App from './App';
// import keycloak from './keycloak'; // Import Keycloak instance

// keycloak.init({
//     onLoad: 'login-required',
//     checkLoginIframe: false, // Optional: Disable third-party iframe check
// }).then((authenticated) => {
//     if (authenticated) {
//         console.log('Authenticated:', authenticated);
//         const root = ReactDOM.createRoot(document.getElementById('root'));
//         root.render(
//             <React.StrictMode>
//                 <App />
//             </React.StrictMode>
//         );
//     } else {
//         console.warn('User is not authenticated.');
//         keycloak.login();
//     }
// }).catch((error) => {
//     console.error('Failed to initialize Keycloak:', error);
// });


// index.js
// index.js
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';

// // Best practice: add error handling
// const container = document.getElementById('root');
// if (!container) {
//   throw new Error(
//     'Root element not found. Please add <div id="root"></div> to your HTML'
//   );
// }

// const root = createRoot(container);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';
import keycloak from './keycloak';
import { Provider } from 'react-redux';


// Initialize Keycloak
const initKeycloak = () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    keycloak.init({
        onLoad: 'login-required',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        enableLogging: true // Helpful for debugging
    })
    .then((authenticated) => {
        if (authenticated) {
            // Store the token in localStorage or your Redux store if needed
            localStorage.setItem('token', keycloak.token);
            localStorage.setItem('refreshToken', keycloak.refreshToken);

            // Set up token refresh
            setInterval(() => {
                keycloak.updateToken(70).then((refreshed) => {
                    if (refreshed) {
                        console.log('Token refreshed');
                        localStorage.setItem('token', keycloak.token);
                    }
                }).catch(() => {
                    console.error('Failed to refresh token');
                    keycloak.login();
                });
            }, 60000); // Check token every minute

            // Render the app
            root.render(
                <React.StrictMode>
                    <Provider>
                        <App keycloak={keycloak} />
                    </Provider>
                </React.StrictMode>
            );
        } else {
            console.warn('Authentication failed');
            keycloak.login();
        }
    })
    .catch((error) => {
        console.error('Keycloak initialization failed:', error);
    });
};

initKeycloak();