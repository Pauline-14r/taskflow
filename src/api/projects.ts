import type {Project} from "../types/project.ts";
import type {CreateProjectInput} from "../types/project.ts";
import {ApiError} from "../errors/ApiError.ts";

export async function getProjects(accessToken: string) : Promise<Project[]> {
    const url = 'http://localhost:4000/api/projects';
    const options = {
        method: 'GET',
        headers: {
            authorization: `Bearer ${accessToken}`,
        }
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data = await response.json();
    return data as Project[];
}

export async function createProject(accessToken: string, project: CreateProjectInput) : Promise<Project> {
    const url = 'http://localhost:4000/api/projects';
    const options = {
        method: 'POST',
        headers: {
            authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: Project = await response.json();
    return data;
}

export async function getProject(accessToken: string, projectId: string) : Promise<Project> {
    const url = `http://localhost:4000/api/projects/${projectId}`;
    const options = {
        method: 'GET',
        headers: {
            authorization: `Bearer ${accessToken}`,
        }
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data: Project = await response.json();
    return data;
}