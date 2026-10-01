import type {Tag} from "../types/task.ts";
import {ApiError} from "../errors/ApiError.ts";

export async function getTags(accessToken: string, projectId: string): Promise<Tag[]> {
    const url = `http://localhost:4000/api/projects/${projectId}/tags`;
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
    const data: Tag[] = await response.json();
    return data;
}