"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { Spinner } from "@/components/ui/spinner";

import AuthStageDialogue from "./AuthStageDialogue";

import Link from "next/link";

import { useRegistrationForm } from "../hooks/useRegisrationForm";

export function RegisterForm() {
	const { form, onSubmit, availableFlows, isLoading, isValidating, isSubmitting, dialogueType, submitStage, paramRecaptchaSiteKey, requestEmailToken } =
		useRegistrationForm();

	return (
		<div className="w-full max-w-sm">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4">
						<FormField
							control={form.control}
							name="homeserver"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="homeserver">Homeserver</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2">
											<Input id="homeserver" placeholder="matrix.org" {...field} />
											{isValidating && <Spinner className="h-4 w-4" />}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
												<Input id="username" placeholder="JohnDoe" {...field} disabled={isLoading} />
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
													<Input id="email" placeholder="johndoe@mail.com" type="email" autoComplete="email" {...field} disabled={isLoading} />
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
													<Input id="registration_token" placeholder="Token" {...field} disabled={isLoading} />
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
												<PasswordInput id="password" placeholder="******" autoComplete="new-password" {...field} disabled={isLoading} />
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
												<PasswordInput id="confirmPassword" placeholder="******" autoComplete="new-password" {...field} disabled={isLoading} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
							Register
						</Button>
					</div>
				</form>
			</Form>
			<div className="mt-4 text-center text-sm">
				Already have an account?{" "}
				<Link href="/auth/login" className="underline">
					Login
				</Link>
			</div>
			<AuthStageDialogue type={dialogueType} submitStage={submitStage} recaptchaSiteKey={paramRecaptchaSiteKey} requestEmailToken={requestEmailToken} />
		</div>
	);
}
