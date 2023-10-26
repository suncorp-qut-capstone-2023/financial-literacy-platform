"use client";

import {useRouter} from "next/navigation";
import {useContext} from "react";
import { AuthContext } from '@/app/auth.jsx';

const Logout = () => {
    const router = useRouter();

    const { setAuthToken, setUserType, setAuth } = useContext(AuthContext);

    setAuthToken(null);
    setAuth(false);
    setUserType(null);
    window.localStorage.clear();
    router.push("/");
}

export default Logout;