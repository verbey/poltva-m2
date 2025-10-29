"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import useHomeserverValidationStatus from "@/hooks/useHomeserverValidationStatus/useHomeserverValidationStatus";
import HomeserverValidatorProps from "@/types/HomeserverValidatorProps/HomeserverValidatorProps";

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
