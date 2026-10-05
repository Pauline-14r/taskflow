import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";
import styles from "../NotFoundPage/NotFoundPage.module.css";

function NotFoundPage() {
    const navigate = useNavigate();
    function handleNavigate() {
        navigate("/projects");
    }

    return (
        <div className={styles.notFoundWrapper}>
            <Result
                icon={<div className={styles.notFound404}>404</div>}
                title="Page not found"
                subTitle="The page you are looking for doesn't exist"
                extra={<Button
                    size="large"
                    type="primary"
                    onClick={() => handleNavigate()}>Go to projects</Button>}
            />
        </div>
    )
}

export default NotFoundPage