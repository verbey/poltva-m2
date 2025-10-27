"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HomeserverValidatorProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  isValid: boolean | null;
  errorMessage?: string | null;
}

export function useHomeserverValidationStatus(props: HomeserverValidatorProps) {
  const { value, isLoading, isError, isValid, errorMessage } = props;

  let statusText: string | null = null;
  let statusClass = "text-muted-foreground";

  if (value) {
    if (isLoading) {
      statusText = "Validating homeserver…";
    } else if (isError || isValid === false) {
      statusText = errorMessage ?? "Invalid homeserver URL";
      statusClass = "text-destructive";
    } else if (isValid === true) {
      statusText = "Homeserver looks good";
      statusClass = "text-green-600 dark:text-green-500";
    }
  }

  return { statusText, statusClass };
}

function HomeserverValidator(props: HomeserverValidatorProps) {
  const { value, onChange } = props;
  const { statusText, statusClass } = useHomeserverValidationStatus(props);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="homeserver">Homeserver URL</Label>
      <Input
        id="homeserver"
        type="url"
        placeholder="https://matrix.org"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="url"
        autoComplete="off"
      />
      {statusText && <p className={cn("text-sm", statusClass)}>{statusText}</p>}
    </div>
  );
}

export default HomeserverValidator;
