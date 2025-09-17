import { z } from 'zod';

export const loginFormSchema = z.object({
  homeserver: z.string().nonempty("Homeserver is required").regex(
    /^((ftp|http|https):\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/,
    "Enter a valid URL"
  ),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long.',
  }),
    password: z
      .string()
      .nonempty("Password is required")
  })

export const registerFormSchema = z.object({
    homeserver: z.string().nonempty("Homeserver is required").regex(
    /^((ftp|http|https):\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/,
    "Enter a valid URL"
  ),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long.',
  }),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });