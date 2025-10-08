import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { HomeserverValidator } from "./HomeserverInput";

import { LoginForm } from "@/features/login/components/LoginForm";
import { RegisterForm } from "@/features/registration/components/RegistrationForm";
interface AuthCardProps {
	authType: string;
}

export default function AuthCard(props: AuthCardProps) {
	return (
		<Card className="w-full md:max-w-xl flex flex-col gap-2 items-center">
			<CardHeader className="flex flex-col gap-2 sm:w-3/4 w-9/10">
				<CardTitle>{props.authType === "register" ? "Register" : "Login"}</CardTitle>
				<CardDescription>{props.authType === "register" ? "Create a new Matrix account" : "Enter credentials to access your Matrix account"}</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-2 sm:w-3/4 w-9/10">
				<div className="flex flex-col gap-2">
					<Label htmlFor="homeserver">Homeserver</Label>
					<HomeserverValidator />
				</div>
				{props.authType === "login" && <LoginForm />}
				{props.authType === "register" && <RegisterForm />}
			</CardContent>
		</Card>
	);
}
