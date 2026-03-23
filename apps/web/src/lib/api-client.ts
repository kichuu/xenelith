import { env } from "@interior-design-ai/env/web";

let getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
	getToken = fn;
}

export class ApiError extends Error {
	status: number;
	code?: string;

	constructor(message: string, status: number, code?: string) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = await getToken?.();

	const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/v1${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (res.status === 204) return undefined as T;

	const data: T & { error?: string; code?: string } = await res.json();

	if (!res.ok) {
		throw new ApiError(
			data.error || "Request failed",
			res.status,
			data.code,
		);
	}

	return data as T;
}

export const api = {
	get: <T>(path: string) => request<T>(path),

	post: <T>(path: string, body?: unknown) =>
		request<T>(path, {
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		}),

	patch: <T>(path: string, body: unknown) =>
		request<T>(path, {
			method: "PATCH",
			body: JSON.stringify(body),
		}),

	delete: (path: string) => request(path, { method: "DELETE" }),
};
