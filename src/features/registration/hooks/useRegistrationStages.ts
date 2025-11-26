"use client";

import { useCallback, useMemo } from "react";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import { MatrixError, type IAuthData, type AuthDict, type RegisterRequest, type RegisterResponse } from "matrix-js-sdk";

export default function useRegistrationStages() {
	const currentStage = useRegistrationStore((s) => s.currentStage);
	const isSubmitting = useRegistrationStore((s) => s.isSubmitting);
	const recaptchaSiteKey = useRegistrationStore((s) => s.recaptchaSiteKey);
	const registrationEmail = useRegistrationStore((s) => s.registrationEmail);

	const setRegistrationEmail = useCallback((email: string | null) => {
		useRegistrationStore.setState({ registrationEmail: email });
	}, []);

	const startRegistration = useCallback(async (data: RegisterRequest): Promise<RegisterResponse | MatrixError | undefined> => {
		const { client } = useRegistrationStore.getState();
		if (!client) {
			console.error("startRegistration called but Matrix client not initialized.");
			return undefined;
		}
		useRegistrationStore.getState().reset();

		try {
			const resp = await client.registerRequest(data);
			// Success: clear any UIA state
			useRegistrationStore.getState().reset();
			return resp as RegisterResponse;
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const uia = error.data as IAuthData;
				const siteKey = uia.params?.["m.login.recaptcha"]?.public_key || null;
				const next = (() => {
					const flows = uia.flows ?? [];
					const completed = uia.completed ?? [];
					const flatStages = flows.flatMap((f) => f.stages ?? []);
					for (const s of flatStages) if (!completed.includes(s)) return s;
					return null;
				})();

				useRegistrationStore.setState({
					initialAuthData: uia,
					baseRegistration: data,
					currentStage: next,
					recaptchaSiteKey: siteKey,
				});
				return undefined;
			}
			console.error("Registration failed:", error);
			if (error instanceof MatrixError) return error;
			else return undefined;
		} finally {
			useRegistrationStore.setState({ isSubmitting: false });
		}
	}, []);

	const submitStage = useCallback(async (authDict: AuthDict): Promise<RegisterResponse | undefined> => {
		const { baseRegistration, initialAuthData, client } = useRegistrationStore.getState();
		if (!baseRegistration) {
			console.error("submitStage called but base registration data not set.");
			return undefined;
		}
		if (!client) {
			console.error("submitStage called but Matrix client not initialized.");
			return undefined;
		}

		useRegistrationStore.setState({ isSubmitting: true });
		try {
			const req: RegisterRequest = {
				...baseRegistration,
				auth: {
					...authDict,
					session: initialAuthData?.session,
				} as AuthDict,
			};
			const resp = await client.registerRequest(req);
			useRegistrationStore.getState().reset();
			return resp as RegisterResponse;
		} catch (err) {
			if (err instanceof MatrixError && err.httpStatus === 401 && err.data) {
				if (err.data.error == "Unable to get validated threepid") throw err; // хз насчет валидности
				const nextAuth = err.data as IAuthData;
				const flows = nextAuth.flows ?? [];
				const completed = nextAuth.completed ?? [];
				const flatStages = flows.flatMap((f) => f.stages ?? []);
				const next = flatStages.find((s) => !completed.includes(s)) ?? null;
				useRegistrationStore.setState({ initialAuthData: nextAuth, currentStage: next });
				return undefined;
			} else {
				console.error("submitStage error:", err);
				return undefined;
			}
		} finally {
			useRegistrationStore.setState({ isSubmitting: false });
		}
	}, []);

	return {
		currentStage,
		isSubmitting,
		recaptchaSiteKey,
		registrationEmail,
		startRegistration,
		submitStage,
		setRegistrationEmail,
	} as const;
}
