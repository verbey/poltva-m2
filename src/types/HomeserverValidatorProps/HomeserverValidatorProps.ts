interface HomeserverValidatorProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  isValid: boolean | null;
  errorMessage?: string | null;
}
export default HomeserverValidatorProps;
