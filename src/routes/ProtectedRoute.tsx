import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../context/useAuth.ts";
import {Spin} from "antd";
import styles from "./ProtectedRoute.module.css"

export function ProtectedRoute() {
    const { isLoading, isAuthenticated } = useAuth();
    console.log({
        isLoading,
        isAuthenticated,
    });

    if (isLoading) return (
        <div className={styles.loading}>
            <Spin />
        </div>
    );
    if (!isAuthenticated) return <Navigate to="/login" />;

    return <Outlet />;
}
