import { z } from 'zod';

const urlRegex = /^((ftp|http|https):\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;

export const registerFormSchema = z
  .object({
    homeserver: z.string().nonempty("Homeserver is required").regex(
    urlRegex,
    "Enter a valid URL"
  ),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long.',
  }),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });