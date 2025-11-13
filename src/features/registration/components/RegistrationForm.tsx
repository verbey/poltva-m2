"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Link from "next/link";

import { useRegistrationForm } from "../hooks/useRegisrationForm";
import registerFormProps from "../types/registerFormProps";

export function RegisterForm(props: registerFormProps) {
	const { form, onSubmit, availableFlows, isHsLoading, UIAFetchError } = useRegistrationForm(props);
	return (
		<div className="w-full max-w-sm">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4">
						{(availableFlows.includes("m.login.dummy") ||
							availableFlows.includes("m.login.email.identity") ||
							availableFlows.includes("m.login.registration_token")) && (
							<div className="grid gap-2 mt-2">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="username">Username</FormLabel>
											<FormControl>
												<Input id="username" {...field} disabled={isHsLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{availableFlows.includes("m.login.email.identity") && (
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel htmlFor="email">Email</FormLabel>
												<FormControl>
													<Input id="email" type="email" autoComplete="email" {...field} disabled={isHsLoading} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
								{availableFlows.includes("m.login.registration_token") && (
									<FormField
										control={form.control}
										name="registration_token"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel htmlFor="registration_token">Registration Token</FormLabel>
												<FormControl>
													<Input id="registration_token" {...field} disabled={isHsLoading} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="password">Password</FormLabel>
											<FormControl>
												<PasswordInput id="password" autoComplete="new-password" {...field} disabled={isHsLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
											<FormControl>
												<PasswordInput id="confirmPassword" autoComplete="new-password" {...field} disabled={isHsLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{availableFlows.includes("m.login.terms") && (
									<FormField
										control={form.control}
										name="terms_accepted"
										render={({ field }) => (
											<FormItem className="grid gap-2">
												<FormLabel htmlFor="terms_accepted">
													<input
														type="checkbox"
														id="terms_accepted"
														checked={field.value}
														onChange={(e) => field.onChange(e.target.checked)}
														disabled={isHsLoading}
														className="mr-2"
													/>
													I accept the terms and conditions of the server
												</FormLabel>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						)}
						<Button type="submit" className="w-full" disabled={isHsLoading}>
							{isHsLoading && <Spinner className="mr-2 h-4 w-4" />}
							Register
						</Button>
						{UIAFetchError ? <div className="mt-2 text-sm text-red-600">{UIAFetchError}</div> : null}
					</div>
				</form>
			</Form>
			<div className="mt-4 text-center text-sm">
				Already have an account?{" "}
				<Link href="/auth/login" className="underline">
					Login
				</Link>
			</div>
		</div>
	);
}
