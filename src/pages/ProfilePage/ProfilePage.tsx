import {useAuth} from "../../context/useAuth.ts";
import {UserAvatar} from "../../components/UserAvatar/UserAvatar.tsx";
import {Descriptions, Tag} from "antd";
import styles from "../ProfilePage/ProfilePage.module.css";

function ProfilePage() {
    const { user } = useAuth()

    return (
        <div>
            {user !== null && (
                <div className={styles.profilePageWrapper}>
                    <div className={styles.avatarArea}>
                        <UserAvatar src={user.avatar} size="large" />
                        <div className={styles.userName}>{user.name}</div>
                        <div>{user.email}</div>
                        <Tag>role</Tag>
                        <Tag
                            key={user.id}
                            variant="filled"
                            color="blue"
                        >{user.role}</Tag>
                    </div>
                    <Descriptions
                        column={1}
                        bordered={true}
                        items={[
                            {
                                key: "name",
                                label: "Name",
                                children: user.name,
                            },
                            {
                                key: "email",
                                label: "Email",
                                children: user.email,
                            },
                            {
                                key: "role",
                                label: "Role",
                                children: user.role,
                            }
                        ]}
                    />
                </div>
            )}
        </div>
    );
}

export default ProfilePage;