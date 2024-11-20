// import React, { useState } from 'react';
// import '../styles/Login.css';

import React, { useEffect } from 'react';
import keycloak from '../keycloak';
import '../styles/Login.css';

function Login() {
    useEffect(() => {
        keycloak.init({ onLoad: 'login-required'}).then((authenticated) => {
            if (authenticated) {
                console.log('User authenticated');
                console.log('Token:', keycloak.token);
            } else {
                console.warn('User not authenticated');
            }
        }).catch((error) => {
            console.error('Failed to initialize Keycloak:', error);
        });
    }, []);

    const handleLogout = () => {
        keycloak.logout();
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <p>You are logged in using Keycloak.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Login;

// function Login() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleLogin = () => {
//         // Perform login logic here
//         console.log('Username:', username);
//         console.log('Password:', password);
//     };

//     return (
//         <div className="login-page">
//             <h1>Login</h1>
//             <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             <button onClick={handleLogin}>Login</button>
//         </div>
//     );
// }

// export default Login;