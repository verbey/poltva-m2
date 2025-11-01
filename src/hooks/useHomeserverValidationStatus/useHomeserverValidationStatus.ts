import HomeserverValidatorProps from "../../types/HomeserverValidatorProps/HomeserverValidatorProps";

function useHomeserverValidationStatus(props: HomeserverValidatorProps) {
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

export default useHomeserverValidationStatus;
