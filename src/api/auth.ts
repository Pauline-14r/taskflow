import {ApiError} from "../errors/ApiError.ts";
import type {User} from "../types/user.ts";

export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string
    expiresIn: number
    user: User
}

export interface RefreshResponse {
    accessToken: string;
    expiresIn: number;
}

export async function login (values: LoginRequest) {
    const url = 'http://localhost:4000/api/auth/login';
    const options: RequestInit = {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
    }

    const response =  await fetch (url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data : LoginResponse = await response.json();
    return data;
}

export async function refresh () : Promise<RefreshResponse> {
    const url = 'http://localhost:4000/api/auth/refresh';
    const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
    }

    const response =  await fetch (url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data : RefreshResponse = await response.json();
    return data;
}

export async function getMe(accessToken: string): Promise<User> {
    const url = 'http://localhost:4000/api/me';
    const options = {
        method: 'GET',
        headers: {
            authorization: `Bearer ${accessToken}`,
        }
    }

    const response =  await fetch (url, options);
    if (!response.ok) {
        throw new ApiError('Request failed', response.status);
    }
    const data : User = await response.json();
    return data;
}