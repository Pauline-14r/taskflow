import {Outlet, NavLink} from "react-router-dom";
import styles from "./Layout.module.css";

function Layout() {
    return (
        <>
            <header>HEADER</header>
            <aside>
                <NavLink
                    to="/projects"
                    className={({ isActive }) => isActive ? styles.active : ""}>
                    Projects
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? styles.active : ""}>
                    Profile
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => isActive ? styles.active : ""}>
                    Settings
                </NavLink>
            </aside>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout;