import {useParams} from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";
import {useEffect, useState} from "react";
import type {Task} from "../../types/task.ts"
import {getTask} from "../../api/tasks.ts";
import {Button, Descriptions, Avatar, Tag, Spin, Alert} from "antd";
import { UserOutlined } from '@ant-design/icons';
import {formatDate} from "../../utils/formateDate.ts"

function TaskDetailsPage() {
    const { taskId } = useParams();
    const { accessToken } = useAuth();
    const [task, setTask] = useState<Task | null>(null);
    const [error, setError] = useState<string| null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function loadTask() {
            try {
                if (accessToken === null || typeof taskId !== "string") {
                    return;
                }
                setLoading(true);
                const data = await getTask(accessToken, taskId);
                setTask(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError("Failed to load task");
                }
            } finally {
                setLoading(false);
            }
        }
        loadTask();
    }, [accessToken, taskId]);

    return (
        <div>
            {loading && (<Spin />)}
            {typeof error === "string" && (<Alert type="error" title={error} />)}
            {task !== null && (
                <div>
                    <div>
                        <Descriptions
                            column={1}
                            title={
                                <div>
                                    <div>{task.key}</div>
                                    <div>{task.title}</div>
                                </div>
                            }
                            extra={
                            <div>
                                <Button type="primary">Edit</Button>
                                <Button>Delete</Button>
                            </div>}
                            items={[
                                {
                                    key: "status",
                                    label: "Status",
                                    children: task.status,
                                },
                                {
                                    key: "priority",
                                    label: "Priority",
                                    children: task.priority,
                                },
                                {
                                    key: "assignee",
                                    label: "Assignee",
                                    children: (
                                        task.assignee ?
                                            <div>
                                                <Avatar
                                                    icon={task.assignee.avatar ? null : <UserOutlined/>}
                                                    src={task.assignee.avatar ? task.assignee.avatar : null}
                                                />
                                                {task.assignee.name}
                                            </div>
                                            : "Unassigned"
                                    ),
                                },
                                {
                                    key: "tags",
                                    label: "Tags",
                                    children: (
                                        task.tags.map((tag) => (
                                            <Tag key={tag.id}>{tag.name}</Tag>
                                        ))
                                    ),
                                },
                                {
                                    key: "due date",
                                    label: "Due date",
                                    children: (
                                        task.dueDate ? formatDate(task.dueDate) : "Not set"
                                    ),
                                },
                                {
                                    key: "description",
                                    label: "Description",
                                    children: task.description,
                                },
                                {
                                    key: "createdAt",
                                    label: "Created",
                                    children: formatDate(task.createdAt),
                                },
                                {
                                    key: "updatedAt",
                                    label: "Updated",
                                    children: formatDate(task.updatedAt),
                                }
                            ]}
                        ></Descriptions>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskDetailsPage;