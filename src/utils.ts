import {
	createCipheriv,
	createDecipheriv,
	createHash,
	randomBytes
} from "crypto";

export const reduceQueryObject = <T extends object>(query?: T) => {
	if (!query) {
		return "";
	}

	return (
		`?` +
		Object.keys(query)
			.map((key) => `${key}=${query[key as keyof T]}`)
			.join("&")
	);
};

export const atLeastOneOf = <T extends object>(
	object: T,
	keys: Array<keyof T>
) => {
	const atleastOne = keys.some((key) => object[key] !== undefined);

	if (!atleastOne) {
		throw new Error(
			`At least one of the following keys must be provided: ${keys.join(", ")}`
		);
	}

	return object;
};

export const reduceCookiesObject = <T extends object>(cookies: T) => {
	return Object.keys(cookies)
		.filter(
			(key) =>
				cookies[key as keyof T] !== undefined &&
				cookies[key as keyof T] !== null
		)
		.map((key) => `${key}=${cookies[key as keyof T]}`)
		.join("; ");
};

// thx @AndresSweeneyRios for this sweet trick I learned from you back at Amihan
export interface PromiseLock {
	promise: Promise<void>;
	resolve: () => void;
	reject: (error: Error) => void;
}

export const promiseLock = (): PromiseLock => {
	let resolve: () => void;
	let reject: (error: Error) => void;

	const promise = new Promise<void>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return {
		promise,
		reject: reject!,
		resolve: resolve!
	};
};

interface CookieResponse {
	value: string;
	expires: Date;
}

export function cookieFromArray(
	cookies: Array<string>,
	key: string
): CookieResponse | undefined {
	const cookie = cookies.find((cookie) => cookie.startsWith(key));
	if (!cookie) {
		return;
	}

	const [content, ...options] = cookie.split("; ");
	if (!content) {
		return;
	}
	const value = content.split("=")[1];
	if (!value) {
		return;
	}

	const maxAge = options
		.find((option) => option.startsWith("Max-Age"))
		?.split("=")[1];
	if (!maxAge) {
		return;
	}

	const expires = new Date(Date.now() + Number(maxAge) * 1000 - 5000);

	return { expires, value };
}

// Helper function to hash the secret key using SHA-256
function hashKey(secret: string): Buffer {
	return createHash("sha256").update(secret).digest();
}

// Function to encrypt a string using AES-256-CBC
export function encryptString(value: string, secret: string): string {
	try {
		const iv = randomBytes(16); // AES block size is 16 bytes
		const key = hashKey(secret); // Ensure the key is 32 bytes long
		const cipher = createCipheriv("aes-256-cbc", key, iv);
		let encrypted = cipher.update(value, "utf8", "hex");
		encrypted += cipher.final("hex");
		return `${iv.toString("hex")}:${encrypted}`;
	} catch {
		throw new Error("Encryption process failed!");
	}
}

// Function to decrypt a previously encrypted string
export function decryptString(value: string, secret: string): string {
	try {
		const parts = value.split(":");
		if (parts.length !== 2) {
			throw new Error("Invalid encrypted string");
		}

		const iv = Buffer.from(parts[0]!, "hex");
		const encryptedText = parts[1];
		const key = hashKey(secret);
		const decipher = createDecipheriv("aes-256-cbc", key, iv);
		let decrypted = decipher.update(encryptedText!, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	} catch {
		throw new Error("Decryption process failed!");
	}
}
