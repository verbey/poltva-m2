import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MatrixError, createClient, RegisterRequest, IAuthData, RegisterResponse, AuthDict, MatrixClient } from "matrix-js-sdk";
import { registerFormSchema } from "../lib/validationSchemas";

export function useRegistrationForm() {
	const [isValidating, setIsValidating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isLoading = isValidating || isSubmitting;

	const [availableFlows, setAvailableFlows] = useState<string[]>([]);

	const [overlayType, setOverlayType] = useState<"captcha" | "email" | null>(null);

	const [currentStage, setCurrentStage] = useState<string | null>(null);

	const [initialAuthData, setInitialAuthData] = useState<IAuthData | null>(null);
	const [baseRegistration, setBaseRegistration] = useState<RegisterRequest | null>(null);

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			registration_token: "",
			homeserver: "matrix.org",
		},
	});

	const { watch, trigger } = form;
	const homeserverValue = watch("homeserver");
	const clientRef = useRef<MatrixClient | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			trigger("homeserver");
			fetchAuthFlows();
		}, 500);

		return () => clearTimeout(timer);

		async function fetchAuthFlows() {
			const values = form.getValues();
			setIsValidating(true);
			setAvailableFlows([]);

			const client = createClient({ baseUrl: `https://${values.homeserver}` });

			try {
				await client.registerRequest({});
			} catch (error) {
				if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
					const data = error.data as IAuthData;

					const stages = (data.flows ?? []).flatMap((f) => f.stages ?? []);

					const uniqueStages = Array.from(new Set(stages));
					setAvailableFlows(uniqueStages);

					console.log("Available registration stages:", uniqueStages);
				} else {
					console.log("Could not connect to the homeserver to get registration info.", error);
				}
			} finally {
				setIsValidating(false);
			}
		}
	}, [homeserverValue, trigger, form]);

	function getNextStage(auth: IAuthData | null): string | null {
		if (!auth) return null;
		const flows = auth.flows ?? [];
		const completed = auth.completed ?? [];
		const flatStages = flows.flatMap((f) => f.stages ?? []);
		for (const s of flatStages) {
			if (!completed.includes(s)) return s;
		}
		return null;
	}

	async function submitStage(authDict: AuthDict): Promise<RegisterResponse | undefined> {
		if (!baseRegistration) {
			console.error("submitStage called but base registration data not set.");
			return undefined;
		}

		let client = clientRef.current;
		if (!client) {
			const homeserver = form.getValues().homeserver;
			client = createClient({ baseUrl: `https://${homeserver}` });
			clientRef.current = client;
		}

		setIsSubmitting(true);
		try {
			const req: RegisterRequest = {
				...baseRegistration,
				auth: authDict as AuthDict,
			};

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
		if (currentStage === "m.login.recaptcha") setOverlayType("captcha");
		else if (currentStage === "m.login.email.identity") setOverlayType("email");
		else setOverlayType(null);
	}, [isSubmitting, currentStage]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		setIsSubmitting(true);
		setCurrentStage(null);
		setInitialAuthData(null);
		setBaseRegistration(null);

		const baseUrl = `https://${values.homeserver}`;
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

	return {
		form,
		onSubmit,
		isLoading,
		isValidating,
		isSubmitting,
		availableFlows,
		overlayType,
		currentStage,
		initialAuthData,
		submitStage,
	};
}
