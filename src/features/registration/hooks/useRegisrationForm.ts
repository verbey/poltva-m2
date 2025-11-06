import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MatrixError, createClient, RegisterRequest, IAuthData, RegisterResponse, AuthDict, MatrixClient } from "matrix-js-sdk";
import { registerFormSchema } from "../lib/validationSchemas";

import registerFormProps from "../types/registerFormProps";

export function useRegistrationForm(props: registerFormProps) {
	const { homeserver, isHsValid, isHsLoading } = props;

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [availableFlows, setAvailableFlows] = useState<string[]>([]);

	const [dialogueType, setDialogueType] = useState<"captcha" | "email" | null>(null);

	const [currentStage, setCurrentStage] = useState<string | null>(null);

	const [initialAuthData, setInitialAuthData] = useState<IAuthData | null>(null);
	const [baseRegistration, setBaseRegistration] = useState<RegisterRequest | null>(null);

	const [paramRecaptchaSiteKey, setParamRecaptchaSiteKey] = useState<string | null>(null);

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			registration_token: "",
		},
	});

	const clientRef = useRef<MatrixClient | null>(null);

	useEffect(() => {
		if (!isHsValid) return;
		else fetchAuthFlows();

		async function fetchAuthFlows() {
			setAvailableFlows([]);

			const client = createClient({ baseUrl: `https://${homeserver}` });

			try {
				await client.registerRequest({});
			} catch (error) {
				if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
					const data = error.data as IAuthData;
					const stages = (data.flows ?? []).flatMap((f) => f.stages ?? []);
					const uniqueStages = Array.from(new Set(stages));
					setAvailableFlows(uniqueStages);
				} else console.log("Could not connect to the homeserver to get registration info.", error);
			}
		}
	}, [homeserver, isHsValid]);

	function getNextStage(auth: IAuthData | null): string | null {
		if (!auth) return null;
		const flows = auth.flows ?? [];
		const completed = auth.completed ?? [];
		const flatStages = flows.flatMap((f) => f.stages ?? []);
		for (const s of flatStages) if (!completed.includes(s)) return s;
		return null;
	}

	async function submitStage(authDict: AuthDict): Promise<RegisterResponse | undefined> {
		if (!baseRegistration) {
			console.log(baseRegistration);
			console.error("submitStage called but base registration data not set.");
			return undefined;
		}
		if (!clientRef.current) {
			console.error("submitStage called but Matrix client not initialized.");
			return undefined;
		}
		const client = clientRef.current;

		setIsSubmitting(true);
		try {
			const req: RegisterRequest = {
				...baseRegistration,
				auth: {
					...authDict,
					session: initialAuthData?.session,
				} as AuthDict,
			};
			console.log("Submitting registration stage with request:", req);
			const resp = await client.registerRequest(req);
			setInitialAuthData(null);
			setBaseRegistration(null);
			setCurrentStage(null);
			setAvailableFlows([]);
			clientRef.current = client;
			return resp as RegisterResponse;
		} catch (err) {
			if (err instanceof MatrixError && err.httpStatus === 401 && err.data) {
				const nextAuth = err.data as IAuthData;
				setInitialAuthData(nextAuth);
				const next = getNextStage(nextAuth);
				setCurrentStage(next);
				return undefined;
			} else {
				console.error("submitStage error:", err);
				return undefined;
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	useEffect(() => {
		if (currentStage === "m.login.recaptcha") setDialogueType("captcha");
		else if (currentStage === "m.login.email.identity") setDialogueType("email");
		else setDialogueType(null);
	}, [isSubmitting, currentStage]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		setIsSubmitting(true);
		setCurrentStage(null);
		setInitialAuthData(null);
		setBaseRegistration(null);

		const baseUrl = `https://${homeserver}`;
		const client = createClient({ baseUrl });
		clientRef.current = client;

		const registrationData: RegisterRequest = {
			username: values.username,
			password: values.password,
			initial_device_display_name: "Poltva Client",
			inhibit_login: false,
		};

		try {
			const response = await client.registerRequest(registrationData);
			console.log("Registration successful:", response);
			setInitialAuthData(null);
			setBaseRegistration(null);
			setCurrentStage(null);
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const uia = error.data as IAuthData;
				setInitialAuthData(uia);
				setParamRecaptchaSiteKey(uia.params?.["m.login.recaptcha"]?.public_key || null);
				setBaseRegistration(registrationData);
				const next = getNextStage(uia);
				setCurrentStage(next);
			} else {
				console.error("Registration failed:", error);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	// Email logic, separate later:

	const sendAttemptRef = useRef(1);

	async function requestEmailToken(): Promise<{ sid: string; clientSecret: string } | undefined> {
		const email = form.getValues("email");
		if (!email) {
			console.error("requestEmailToken called but email not provided.");
			return undefined;
		}
		if (!clientRef.current) {
			console.error("requestEmailToken called but Matrix client not initialized.");
			return undefined;
		}

		setIsSubmitting(true);
		try {
			const client = clientRef.current;
			const clientSecret = client.generateClientSecret();
			const sendAttempt = sendAttemptRef.current;
			sendAttemptRef.current += 1;

			const tokenResp = await (client as MatrixClient).requestRegisterEmailToken(email, clientSecret, sendAttempt);

			return {
				sid: (tokenResp as { sid: string })?.sid,
				clientSecret,
			};
		} catch (err) {
			throw new Error("Failed to request email token: " + err);
		} finally {
			setIsSubmitting(false);
		}
	}

	return {
		form,
		onSubmit,
		availableFlows,
		dialogueType,
		currentStage,
		initialAuthData,
		submitStage,
		paramRecaptchaSiteKey,
		requestEmailToken,
		isHsLoading,
	};
}
