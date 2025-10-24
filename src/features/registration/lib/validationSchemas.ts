import { z } from "zod";
import validateHomeserver from "./homserverValidation";

export const registerFormSchema = z
	.object({
		homeserver: z
			.string()
			.min(3, { message: "Homeserver must be at least 3 characters long." })
			.refine((val) => val.includes("."), {
				message: "Homeserver must be a valid domain.",
			})
			.refine(async (val) => await validateHomeserver(val), { message: "Homeserver is not reachable or invalid." }),
		username: z.string().min(3, {
			message: "Username must be at least 3 characters long.",
		}),
		email: z.email("Enter a valid email address").optional(),
		registration_token: z.string().optional(),
		//email: z.email("Enter a valid email address").optional().or(z.literal("")) ?,
		password: z
			.string()
			.nonempty("Password is required")
			.min(8, "Password must be at least 8 characters")
			.regex(/[a-z]/, {
				message: "Password must contain at least one lowercase letter",
			})
			.regex(/[A-Z]/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/\d/, { message: "Password must contain at least one number" })
			.regex(/[^a-zA-Z0-9]/, {
				message: "Password must contain at least one special character",
			}),
		confirmPassword: z.string().nonempty("Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});
