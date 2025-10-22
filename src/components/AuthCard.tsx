import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "@/features/login/components/LoginForm";

interface AuthCardProps {
  authType: string;
}

export default function AuthCard(props: AuthCardProps) {
  return (
    <Card className="w-full md:max-w-xl flex flex-col gap-2 items-center">
      <CardHeader className="flex flex-col gap-2 sm:w-3/4 w-9/10">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter credentials to access your Matrix account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 sm:w-3/4 w-9/10">
        {props.authType === "login" && <LoginForm />}
      </CardContent>
    </Card>
  );
}
