export default interface registerFormProps {
	homeserver: string;
	isHsValid: boolean | null;
	isHsLoading: boolean;
	isHsError: boolean;
	canSubmit: boolean;
}
