import type { MatrixError } from "matrix-js-sdk";
import { UseFormReturn, Path } from "react-hook-form";

export interface NormalizedRegistrationError {
	fieldErrors: Record<string, string>;
	uiMessage?: string | null;
}

export function normalizeRegistrationMatrixError(error: MatrixError): NormalizedRegistrationError {
	const fieldErrors: Record<string, string> = {};
	let uiMessage: string | null = null;

	switch (error.errcode) {
		case "M_USER_IN_USE":
			fieldErrors.username = "Username is already taken.";
			break;
		case "M_INVALID_USERNAME":
			fieldErrors.username = "Username is invalid.";
			break;
		case "M_WEAK_PASSWORD":
			fieldErrors.password = "Password is too weak.";
			break;
		case "M_THREEPID_IN_USE":
			fieldErrors.email = "Email is already in use.";
			break;
		case "M_THREEPID_INVALID":
			fieldErrors.email = "Email is invalid.";
			break;
		case "M_CAPTCHA_INVALID":
			uiMessage = "CAPTCHA was invalid. Please try again.";
			break;
		case "M_FORBIDDEN":
			uiMessage = "Registration is disabled on this homeserver.";
			break;
		case "M_LIMIT_EXCEEDED":
			uiMessage = "Too many requests. Please try again later.";
			break;
		default:
			uiMessage = "Unhandled error occurred while fetching registration info.";
			break;
	}

	return { fieldErrors, uiMessage };
}

export function applyRegistrationMatrixError<T extends Record<string, unknown>>(form: UseFormReturn<T>, normalized: NormalizedRegistrationError) {
	Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
		form.setError(field as Path<T>, { type: "server", message });
	});
}

export function normalizeLoginMatrixError(error: unknown): string {
	if (error && typeof error === "object" && (error as MatrixError).errcode) {
		const err = error as MatrixError;
		switch (err.errcode) {
			case "M_FORBIDDEN":
				return "Invalid username or password.";
			case "M_LIMIT_EXCEEDED":
				return "Too many login attempts. Please wait and retry.";
			default:
				return "Login failed. Please check credentials or try again.";
		}
	}
	return "Login failed. Please check credentials or try again.";
}
