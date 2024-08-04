import { atLeastOneOf, reduceQueryObject } from "./utils";

export const Routes = {
	/**
	 * Route for:
	 * - GET `/auth/exists`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	checkUserExists: (query: CheckUserExistsQuery) =>
		`/auth/exists?${reduceQueryObject(atLeastOneOf(query, ["username", "displayName", "email"]))}` as const,

	/**
	 * Route for:
	 * - GET `/auth/login`
	 *
	 * If a valid session cookie is present, the current user will be returned. Otherwise it will act like the `login` route.
	 */
	currentUser: () => "/auth/login" as const,

	/**
	 * Route for:
	 * - PUT `/users/:userId/delete`
	 *
	 * Normal users only have permission to delete their own account.
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	deleteUser: (userId: string) => `/users/${userId}/delete` as const,

	/**
	 * Route for:
	 * - GET `/auth/login`
	 *
	 * With no valid session cookie is present you must pass the username and password in the Authorization header.
	 * `Authorization: Basic base64(urlencode(username):urlencode(password))`
	 */
	login: () => "/auth/login" as const,

	/**
	 * Route for:
	 * - PUT `/logout`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	logout: () => "/logout" as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/totp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACode: () => "/auth/twofactorauth/totp/verify" as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/emailotp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACodeEmail: () => "/auth/twofactorauth/emailotp/verify" as const,

	/**
	 * Route for:
	 * - POST `/auth/twofactorauth/otp/verify`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verify2FACodeRecovery: () => " /auth/twofactorauth/otp/verify" as const,

	/**
	 * Route for:
	 * - GET `/auth`
	 *
	 * *Requires the session cookie to be present in the request.*
	 */
	verifyAuthToken: () => "/auth" as const
} as const;

export interface CheckUserExistsQuery {
	email?: string;
	displayName?: string;
	username?: string;
	exludeUserId?: string;
}

export interface Verify2FACodeRequest {
	code: string;
}
