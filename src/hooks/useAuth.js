import { useContext } from 'react';
import AuthContext from "../sections/auth/context/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;