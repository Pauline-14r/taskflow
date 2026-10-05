import type {User} from "./user";
import type { Dayjs } from "dayjs";

export type TaskStatus =
    | 'TODO'
    | 'IN_PROGRESS'
    | 'DONE';

export type TaskPriority =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'CRITICAL';

export interface Tag {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    key: string;
    projectId: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: User | null;
    dueDate: string | null;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string | null;
    dueDate?: string | null;
    tagIds: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string | null;
    dueDate?: string | null;
    tagIds?: string[];
}

export interface EditTaskFormValues {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: Dayjs;
    tags?: string[];
}