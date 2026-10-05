import type {Task, UpdateTaskRequest} from "../types/task.ts";
import {ApiError} from "../errors/ApiError.ts";

export async function getProjectTasks(accessToken: string, projectId: string) : Promise<Task[]> {
    const url = `http://localhost:4000/api/projects/${projectId}/tasks`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: Task[] = await response.json();
    return data;
}

export async function getTask(accessToken: string, taskId: string) : Promise<Task> {
    const url = `http://localhost:4000/api/tasks/${taskId}`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: Task = await response.json();
    return data;
}

export async function updateTask(accessToken: string, taskId: string, changes: UpdateTaskRequest) : Promise<Task> {
    const url = `http://localhost:4000/api/tasks/${taskId}`;
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(changes),
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: Task = await response.json();
    return data;
}

export async function deleteTask(accessToken: string, taskId: string) : Promise<void> {
    const url = `http://localhost:4000/api/tasks/${taskId}`;
    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    return;
}