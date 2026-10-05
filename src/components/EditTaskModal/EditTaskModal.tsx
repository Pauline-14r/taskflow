import type {EditTaskFormValues, Tag, Task, UpdateTaskRequest} from "../../types/task.ts";
import {Form, Input, Modal, Select, DatePicker, Alert} from "antd";
import dayjs from "dayjs";
import {useAuth} from "../../context/useAuth.ts";
import {useEffect, useState} from "react";
import type {User} from "../../types/user.ts";
import {getUsers} from "../../api/users.ts";
import {getTags} from "../../api/tags.ts";
import {updateTask} from "../../api/tasks.ts";
import {useForm} from "antd/es/form/Form";

interface EditTaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: (task: Task) => void;
}

export function EditTaskModal({ task, isOpen, onClose, onUpdated }: EditTaskModalProps) {
    const { accessToken } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [updatingError, setUpdatingError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [form] = useForm<EditTaskFormValues>();

    useEffect(() => {
        async function loadUsers() {
            try {
                if (accessToken === null || !isOpen) {
                    return;
                }
                const usersData = await getUsers(accessToken, task.projectId);
                const tagsData = await getTags(accessToken, task.projectId);
                setUsers(usersData);
                setTags(tagsData);
            } catch (e) {
                if (e instanceof Error) {
                    setError("Something went wrong!");
                }
            }
        }
        loadUsers();
    }, [accessToken, task.projectId, isOpen]);

    async function handleFinish(values: EditTaskFormValues) {
        const updatedTask: UpdateTaskRequest = {
            title: values.title,
            description: values.description ?? null,
            status: values.status ?? undefined,
            priority: values.priority ?? undefined,
            assigneeId: values.assigneeId ?? null,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
            tagIds: values.tags ?? [],
        }
        if (accessToken === null) {
            return;
        }
        try {
            setIsSaving(true);
            const newTask: Task = await updateTask(accessToken, task.id, updatedTask);
            onUpdated(newTask);
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                setUpdatingError("Failed to update task");
            }
        }
        finally {
            setIsSaving(false);
        }
    }

    function handleClose(): void {
        if (form.isFieldsTouched()) {
            Modal.confirm({
                title: "You have unsaved changes. Discard changes?",
                onOk: () => {
                    form.resetFields();
                    onClose();
                }
            });

            return;
        }

        onClose();
    }

    return (
        <Modal
            title="Edit Task"
            open={isOpen}
            onCancel={handleClose}
            confirmLoading={isSaving}
            onOk={() => form.submit()}>
            {updatingError && (
                <Alert type="error" title={updatingError} />
            )}
            <Form<EditTaskFormValues>
                initialValues={{
                title: task.title,
                description: task.description ?? undefined,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assignee ? task.assignee.id : undefined,
                dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
                tags: task.tags.map((tag) => tag.id),
            }}
                onFinish={handleFinish}
                form={form}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        { required: true, message: "Title is required" },
                        { min: 3, message: "Title must contain at least 3 characters"},]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description">
                    <Input.TextArea></Input.TextArea>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status">
                    <Select options={[
                        {value: "TODO", label: "to do"},
                        {value: "IN_PROGRESS", label: "In progress"},
                        {value: "DONE", label: "Done"},
                    ]}/>
                </Form.Item>
                <Form.Item
                    name="priority"
                    label="Priority">
                    <Select options={[
                        {value: "LOW", label: "low"},
                        {value: "MEDIUM", label: "medium"},
                        {value: "HIGH", label: "high"},
                        {value: "CRITICAL", label: "critical"},
                    ]} />
                </Form.Item>
                <Form.Item
                    name="assigneeId"
                    label="Assignee">
                    <Select options={users.map((user) => (
                        { value: user.id, label: user.name }
                    ))} />
                </Form.Item>
                <Form.Item
                    name="dueDate"
                    label="Due date">
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="tags"
                    label="Tags">
                    <Select mode="multiple"
                            options={tags.map((tag) => (
                                { value: tag.id, label: tag.name }
                            ))} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

