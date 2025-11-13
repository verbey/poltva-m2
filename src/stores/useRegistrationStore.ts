import { create } from "zustand";
import { createClient, MatrixClient, type IAuthData, type RegisterRequest } from "matrix-js-sdk";

interface RegistrationState {
	client: MatrixClient | null;

	isSubmitting: boolean;
	currentStage: string | null;

	initialAuthData: IAuthData | null;
	baseRegistration: RegisterRequest | null;

	recaptchaSiteKey: string | null;
	registrationEmail: string | null;

	initClient: (homeserver: string) => Promise<MatrixClient>;
	reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
	client: null,

	isSubmitting: false,
	currentStage: null,

	initialAuthData: null,
	baseRegistration: null,

	recaptchaSiteKey: null,
	registrationEmail: null,
	registrationTermsParams: null,

	initClient: async (homeserver: string) => {
		const baseUrl = homeserver.startsWith("http") ? homeserver : `https://${homeserver}`;
		const client = createClient({ baseUrl });
		set({ client });
		return client;
	},

	reset: () =>
		set({
			isSubmitting: false,
			currentStage: null,
			initialAuthData: null,
			baseRegistration: null,
			recaptchaSiteKey: null,
			registrationEmail: null,
		}),
}));

export type { RegistrationState };
