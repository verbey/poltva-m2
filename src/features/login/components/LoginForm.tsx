"use client";

import PasswordInput from "@/components/PasswordInput/PasswordInput";
import useLoginForm from "../hooks/useLoginForm";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";

import type LoginFormProps from "../types/LoginFormProps";

function LoginForm(props: LoginFormProps) {
	const { form, handleSubmit, blocked, submitError, isSubmitting } = useLoginForm(props);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col gap-2">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="m-0">
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="m-0">
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={blocked || isSubmitting}>
					{isSubmitting && <Spinner className="mr-2 h-4 w-4" />} Submit
				</Button>

				{submitError ? <div className="mt-2 text-sm text-red-600">{submitError}</div> : null}
			</form>
			<div className="mt-4 text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link href="/auth/register" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</Form>
	);
}

export default LoginForm;
