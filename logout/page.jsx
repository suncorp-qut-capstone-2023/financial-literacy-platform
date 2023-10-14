"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

const Logout = () => {
    const router = useRouter();
    localStorage.clear();
    router.push("/");
}

export default Logout;