"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "@/features/login/components/LoginForm";
import HomeserverValidator from "../HomeserverValidator/HomeserverValidator";
import useAuthCard from "@/hooks/useAuthCard/useAuthCard";

interface AuthCardProps {
  authType: string;
}

export default function AuthCard(props: AuthCardProps) {
  const {
    homeserver,
    setHomeserver,
    isHsLoading,
    isHsError,
    isHsValid,
    hsErrorMessage,
    canSubmit,
  } = useAuthCard();

  return (
    <Card className="w-full md:max-w-xl flex flex-col gap-2 items-center">
      <CardHeader className="flex flex-col gap-2 sm:w-3/4 w-9/10">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter credentials to access your Matrix account
        </CardDescription>
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
          <LoginForm
            homeserver={homeserver}
            isHsValid={isHsValid}
            isHsLoading={isHsLoading}
            isHsError={isHsError}
            canSubmit={canSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}
