import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { LoginForm } from "@/features/login/components/LoginForm";

export default function AuthCard() {
  return (
    <Card className="md:w-full md:max-w-xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter credentials to access your Matrix account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div>
          <Label htmlFor="homeserver">Homeserver</Label>
          <Input
            id="homeserver"
            type="text"
            placeholder="matrix.org"
            defaultValue="matrix.org"
          />
        </div>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
