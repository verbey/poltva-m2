import { create } from "zustand";
import { createClient, MatrixClient, MatrixError, type IAuthData, type RegisterRequest, type RegisterResponse, type AuthDict } from "matrix-js-sdk";

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
	startRegistration: (
		data: RegisterRequest,
		ctx?: { email?: string | null; registrationToken?: string | null }
	) => Promise<RegisterResponse | MatrixError | undefined>;
	submitStage: (authDict: AuthDict) => Promise<RegisterResponse | undefined>;
}

export const useRegistrationStore = create<RegistrationState>((set, get) => ({
	client: null,

	isSubmitting: false,
	currentStage: null,

	initialAuthData: null,
	baseRegistration: null,

	recaptchaSiteKey: null,
	registrationEmail: null,

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

	startRegistration: async (data, ctx) => {
		const client = get().client;
		if (!client) {
			console.error("startRegistration called but Matrix client not initialized.");
			return undefined;
		}
		get().reset();

		try {
			const resp = await client.registerRequest(data);
			// Success: clear any UIA state
			get().reset();
			return resp as RegisterResponse;
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const uia = error.data as IAuthData;
				const recaptchaSiteKey = uia.params?.["m.login.recaptcha"]?.public_key || null;
				const next = (() => {
					const flows = uia.flows ?? [];
					const completed = uia.completed ?? [];
					const flatStages = flows.flatMap((f) => f.stages ?? []);
					for (const s of flatStages) if (!completed.includes(s)) return s;
					return null;
				})();

				set({
					initialAuthData: uia,
					baseRegistration: data,
					currentStage: next,
					recaptchaSiteKey,
				});
				return undefined;
			}
			console.error("Registration failed:", error);
			if (error instanceof MatrixError) return error;
			else return undefined;
		} finally {
			set({ isSubmitting: false });
		}
	},

	submitStage: async (authDict: AuthDict) => {
		const { baseRegistration, initialAuthData, client } = get();
		if (!baseRegistration) {
			console.error("submitStage called but base registration data not set.");
			return undefined;
		}
		if (!client) {
			console.error("submitStage called but Matrix client not initialized.");
			return undefined;
		}

		set({ isSubmitting: true });
		try {
			const req: RegisterRequest = {
				...baseRegistration,
				auth: {
					...authDict,
					session: initialAuthData?.session,
				} as AuthDict,
			};
			const resp = await client.registerRequest(req);
			get().reset();
			return resp as RegisterResponse;
		} catch (err) {
			if (err instanceof MatrixError && err.httpStatus === 401 && err.data) {
				const nextAuth = err.data as IAuthData;
				const flows = nextAuth.flows ?? [];
				const completed = nextAuth.completed ?? [];
				const flatStages = flows.flatMap((f) => f.stages ?? []);
				const next = flatStages.find((s) => !completed.includes(s)) ?? null;
				set({ initialAuthData: nextAuth, currentStage: next });
				return undefined;
			} else {
				console.error("submitStage error:", err);
				return undefined;
			}
		} finally {
			set({ isSubmitting: false });
		}
	},
}));

export type { RegistrationState };
