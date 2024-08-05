export class RefreshError extends Error {
	public name = "RefreshError";
	public constructor(public readonly message: string) {
		super(message);
	}
}

export class RequestError extends Error {
	public name = "RequestError";
	public constructor(
		public readonly response?: Response,
		public readonly at?: string
	) {
		super(
			`Request failed ${response ? `with status: ${response.status}` : "with no response"} ${at}.`
		);
	}

	public hintsRefreshSession() {
		return this.response?.status === 401;
	}
}
