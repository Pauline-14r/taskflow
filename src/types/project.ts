export interface Project {
id: string;
name: string;
description: string | null;
taskCount: number;
createdAt: string;
}

export interface CreateProjectInput {
    name: string;
    description: string;
}