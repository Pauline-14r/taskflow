import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";
import {useEffect, useState} from "react";
import type {Task} from "../../types/task.ts"
import {deleteTask, getTask} from "../../api/tasks.ts";
import {Button, Descriptions, Tag, Spin, Alert, Modal} from "antd";
import {formatDate} from "../../utils/formateDate.ts"
import {UserAvatar} from "../../components/UserAvatar/UserAvatar.tsx";
import {EditTaskModal} from "../../components/EditTaskModal/EditTaskModal.tsx";
import {ApiError} from "../../errors/ApiError.ts";

function TaskDetailsPage() {
    const { taskId } = useParams();
    const { accessToken } = useAuth();
    const  navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [error, setError] = useState<string| null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    function handleDelete() {
        Modal.confirm({
            title: "Are you sure?",
            onOk: async () => {
                if (accessToken === null || task === null) {
                    return;
                }
                try {
                    await deleteTask(accessToken, task.id);
                    navigate( `/projects/${task.projectId}`);
                } catch (e) {
                    if (e instanceof ApiError && e.status === 403) {
                        setError("You don't have permission to delete this task");
                    } else if (e instanceof Error) {
                        setError("Failed to delete task");
                    }
                }
            }
        })
    }

    return (
        <div>
            {loading && (<Spin />)}
            {typeof error === "string" && (<Alert type="error" title={error} />)}
            {task !== null && (
                <div>
                    <EditTaskModal
                        task={task}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdated={(updatedTask) => setTask(updatedTask)} />
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
                                <Button
                                    type="primary"
                                    onClick={() => setIsEditModalOpen(true)}>Edit</Button>
                                <Button onClick={handleDelete}>Delete</Button>
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
                                                <UserAvatar src={task.assignee.avatar} size="small" />
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
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskDetailsPage;