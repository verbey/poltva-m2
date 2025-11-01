export default interface LoginFormProps {
  homeserver: string;
  isHsValid: boolean | null;
  isHsLoading: boolean;
  isHsError: boolean;
  canSubmit: boolean;
}
