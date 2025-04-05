import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedInit = () => {

    const router = useRouter()

    const navigate = (url) => {
        router.push(url);
    }

    useEffect(() => {
        navigate("/admin/dashboard");
    }, []);
}

export default ProtectedInit;