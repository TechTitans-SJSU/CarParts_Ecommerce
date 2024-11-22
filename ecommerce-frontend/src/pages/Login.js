import { useKeycloak } from '@react-keycloak/web';

const Login = () => {
  const { keycloak } = useKeycloak();

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() => keycloak.login()}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
