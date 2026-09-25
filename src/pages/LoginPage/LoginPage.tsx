import {Card, Typography, Form, Input, Button} from 'antd';
import {LockOutlined} from '@ant-design/icons';
import styles from './LoginPage.module.css';
import {type LoginRequest} from "../../api/auth.ts";
import {ApiError} from "../../errors/ApiError.ts";
import {useState} from "react";
import {useAuth} from "../../context/useAuth.ts";

function LoginPage() {
    const {login} = useAuth();
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleFinish(values: LoginRequest) {
        try {
            await login(values);
        }
        catch (error) {
            if (error instanceof ApiError) {
                switch (error.status) {
                    case 401: {
                        setError('Invalid email or password');
                        break;
                    }
                    case 403: {
                        setError('Access denied');
                        break;
                    }
                    case 404: {
                        setError('Not found');
                        break;
                    }
                    case 500: {
                        setError('Something went wrong. Please try again.');
                        break;
                    }
                }
            } else if (error instanceof Error) {
                console.log(error);
                setError('Something went wrong. Please try again.');
            }
        }
    }

    return (
        <div className={styles.loginWrapper}>
            <Card className={styles.loginCard}>
                <Typography.Title>TaskFlow</Typography.Title>
                <Form name="login" onFinish={handleFinish}>
                    <Form.Item
                        name="email"
                        rules={[{required:true}, {type: 'email'}]}>
                        <Input placeholder="Email" ></Input>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true}, {min: 6}]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Log in</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default LoginPage;