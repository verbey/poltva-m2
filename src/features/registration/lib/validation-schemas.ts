import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address"),
    password: z
      .string()
      .nonempty("Password is required")
  })

export const registerFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Full name must be at least 3 characters long.',
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