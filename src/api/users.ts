import type {User} from "../types/user.ts";
import {ApiError} from "../errors/ApiError.ts";

export async function getUsers(accessToken: string, projectId: string): Promise<User[]> {
    const url = `http://localhost:4000/api/projects/${projectId}/users`;
    const options = {
        method: "GET",
        headers: {
            authorization: `Bearer ${accessToken}`,
        }
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: User[] = await response.json();
    return data;
}