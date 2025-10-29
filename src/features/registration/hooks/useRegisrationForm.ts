import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MatrixError, createClient, RegisterRequest, IAuthData, RegisterResponse } from "matrix-js-sdk";
import { registerFormSchema } from "../lib/validationSchemas";

export function useRegistrationForm() {
	const [isValidating, setIsValidating] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isLoading = isValidating || isSubmitting;

	const [availableFlows, setAvailableFlows] = useState<string[]>([]);
	const [stageError, setStageError] = useState<string | null>(null);

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

	useEffect(() => {
		const timer = setTimeout(() => {
			trigger("homeserver");
			fetchAuthFlows();
		}, 500);

		return () => clearTimeout(timer);
	}, [homeserverValue]);

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

				const stages = (data.flows ?? []).flatMap((f) => f.stages ?? []).filter(Boolean);

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

	async function processUIAStages(
		client: ReturnType<typeof createClient>,
		initialAuth: IAuthData,
		baseRegisterRequest: RegisterRequest
	): Promise<RegisterResponse | undefined> {
		let uia = initialAuth;
		setStageError(null);

		while (true) {
			const nextStage = uia.flows?.flatMap((f) => f.stages ?? []).find((stage) => !(uia.completed ?? []).includes(stage)) ?? null;

			if (!nextStage) {
				setStageError("No next UIA stage found.");
				return undefined;
			}

			try {
				const values = form.getValues();

				let authDict: Record<string, unknown> = {
					type: nextStage,
					session: uia.session,
				};

				switch (nextStage) {
					case "m.login.email.identity":
						authDict = {
							type: "m.login.email.identity",
							session: uia.session,
							// TODO: replace with real threepid_creds after doing /requestToken flow
							email: values.email,
						};
						break;

					case "m.login.recaptcha":
						authDict = {
							type: "m.login.recaptcha",
							session: uia.session,
							// TODO: include the recaptcha response token
							response: "RECAPTCHA_PLACEHOLDER",
						};
						break;

					default:
						authDict = {
							type: nextStage,
							session: uia.session,
						};
						break;
				}

				const req: RegisterRequest = {
					...baseRegisterRequest,
					auth: authDict,
				};

				const resp = await client.registerRequest(req);
				setStageError(null);
				return resp as RegisterResponse;
			} catch (err) {
				if (err instanceof MatrixError && err.httpStatus === 401 && err.data) {
					uia = err.data as IAuthData;
					continue;
				} else {
					setStageError("Registration failed");
					console.log("Registration error:", err);
					return undefined;
				}
			}
		}
	}

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		setIsSubmitting(true);
		setStageError(null);

		const baseUrl = `https://${values.homeserver}`;
		const client = createClient({ baseUrl });

		const registrationData: RegisterRequest = {
			username: values.username,
			password: values.password,
			initial_device_display_name: "Poltva Client",
			inhibit_login: false,
		};

		try {
			const response = await client.registerRequest(registrationData);
			console.log("Registration successful:", response);
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const uiaData = error.data as IAuthData;
				const result = await processUIAStages(client, uiaData, registrationData);
				if (result) console.log("Registration completed after UIA:", result);
				else console.log("UIA processing ended without a successful registration.");
			} else console.error("Registration failed:", error);
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
		stageError,
		processUIAStages,
	};
}
