import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

type UserAvatarProps = {
    src: string | null;
    size: "small" | "medium" | "large";
}

export function UserAvatar( {src, size}: UserAvatarProps) {
    if (src === null) {
        return <Avatar size={size} icon={<UserOutlined />} />
    }

    return <Avatar size={size} src={src} />
}