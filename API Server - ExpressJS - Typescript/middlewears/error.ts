class ErrorParent extends Error {
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.code = code;
	}
}

export class BadrequestError extends ErrorParent {
	constructor(message: string) {
		super(message ? message : "Bad Request", 400);
	}
}

export class UnauthorizedError extends ErrorParent {
	constructor(message: string) {
		super(message ? message : "Unauthorized", 401);
	}
}

export class ForbiddenError extends ErrorParent {
	constructor(message: string) {
		super(message ? message : "Forbidden", 403);
	}
}

export class NotFoundError extends ErrorParent {
	constructor(message: string) {
		super(message ? message : "Not Found", 404);
	}
}

export default ErrorParent;
