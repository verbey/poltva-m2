"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import LoginForm from "@/features/login/components/LoginForm";
import HomeserverValidator from "../HomeserverValidator/HomeserverValidator";
import useAuthCard from "@/hooks/useAuthCard/useAuthCard";

import { RegisterForm } from "@/features/registration/components/RegistrationForm";

import AuthStageDialogue from "@/features/registration/components/AuthStageDialogue";

interface AuthCardProps {
	authType: string;
}

export default function AuthCard(props: AuthCardProps) {
	const { homeserver, setHomeserver, isHsLoading, isHsError, isHsValid, hsErrorMessage, canSubmit } = useAuthCard();

	return (
		<>
			<Card className="w-full md:max-w-xl flex flex-col gap-2 items-center">
				<CardHeader className="flex flex-col gap-2 sm:w-3/4 w-9/10">
					<CardTitle>{props.authType === "login" ? "Login" : "Register"}</CardTitle>
					<CardDescription>{props.authType === "login" ? "Enter credentials to access your Matrix account" : "Create a new Matrix account"}</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-2 sm:w-3/4 w-9/10">
					<HomeserverValidator
						value={homeserver}
						onChange={setHomeserver}
						isLoading={isHsLoading}
						isError={isHsError}
						isValid={isHsValid}
						errorMessage={hsErrorMessage ?? undefined}
					/>
					{props.authType === "login" && (
						<LoginForm homeserver={homeserver} isHsValid={isHsValid} isHsLoading={isHsLoading} isHsError={isHsError} canSubmit={canSubmit} />
					)}
					{props.authType === "register" && (
						<RegisterForm homeserver={homeserver} isHsValid={isHsValid} isHsLoading={isHsLoading} isHsError={isHsError} canSubmit={canSubmit} />
					)}
				</CardContent>
			</Card>
			<AuthStageDialogue />
		</>
	);
}
