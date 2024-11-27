// import { useKeycloak } from '@react-keycloak/web';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = () => {
//   const { keycloak } = useKeycloak();
  
//   return keycloak.authenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PrivateRoute;

// const PrivateRoute = () => {
//     const { keycloak } = useKeycloak();
    
//     if (!keycloak.authenticated) {
//       keycloak.login();
//       return null;
//     }
  
//     return <Outlet />;
//   };

//   export default PrivateRoute;


// const PrivateRoute = () => {
//   const { keycloak, initialized } = useKeycloak();

//   if (!initialized) {
//     return <div>Loading...</div>;
//   }

//   if (!keycloak?.authenticated) {
//     // Safely check if keycloak exists before calling login
//     if (keycloak) {
//       keycloak.login();
//     }
//     return null;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;

// components/PrivateRoute.js
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;