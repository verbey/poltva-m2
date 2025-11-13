import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerFormSchema } from "../lib/validationSchemas";
import registerFormProps from "../types/registerFormProps";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import useRegistrationStages from "./useRegistrationStages";
import { MatrixError, type IAuthData, type MatrixClient } from "matrix-js-sdk";

export function useRegistrationForm(props: registerFormProps) {
	const { homeserver, isHsValid, isHsLoading, isHsError, canSubmit } = props;
	const { initClient, currentStage, client } = useRegistrationStore();
	const { startRegistration, submitStage } = useRegistrationStages();
	const [availableFlows, setAvailableFlows] = useState<string[]>([]);
	const [UIAFetchError, setUIAFetchError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			registration_token: "",
			terms_accepted: false,
		},
	});

	const handleMatrixError = (error: MatrixError) => {
		switch (error.errcode) {
			case "M_USER_IN_USE": {
				form.setError("username", { type: "server", message: "Username is already taken." });
				break;
			}
			case "M_INVALID_USERNAME": {
				form.setError("username", { type: "server", message: "Username is invalid." });
				break;
			}
			case "M_WEAK_PASSWORD": {
				form.setError("password", { type: "server", message: "Password is too weak." });
				break;
			}
			case "M_THREEPID_IN_USE": {
				form.setError("email", { type: "server", message: "Email is already in use." });
				break;
			}
			case "M_THREEPID_INVALID": {
				form.setError("email", { type: "server", message: "Email is invalid." });
				break;
			}
			case "M_CAPTCHA_INVALID": {
				setUIAFetchError("CAPTCHA was invalid. Please try again.");
				break;
			}
			case "M_FORBIDDEN": {
				setUIAFetchError("Registration is disabled on this homeserver.");
				break;
			}
			case "M_LIMIT_EXCEEDED": {
				setUIAFetchError("Too many requests. Please try again later.");
				break;
			}
			default: {
				setUIAFetchError("Unhandled error occurred while fetching registration info.");
				console.log("Unhandled error occurred while fetching registration info:", error);
			}
		}
	};

	const fetchAuthFlows = async (matrixClient: MatrixClient) => {
		setAvailableFlows([]);
		try {
			await matrixClient.registerRequest({});
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const data = error.data as IAuthData;
				const stages = (data.flows ?? []).flatMap((flows) => flows.stages ?? []);
				setAvailableFlows(Array.from(new Set(stages)));
			} else if (error instanceof MatrixError && error.data && isHsValid) handleMatrixError(error);
			else {
				setUIAFetchError("Could not connect to the homeserver to get registration info.");
				console.log("Could not connect to the homeserver to get registration info.", error);
			}
		}
	};

	const consentUrl = useMemo(() => {
		const base = client?.getHomeserverUrl?.() ?? "";
		if (!base) return null;
		return `${base.replace(/\/$/, "")}/_matrix/consent`;
	}, [client]);

	useEffect(() => {
		if (currentStage === "m.login.registration_token") submitStage({ type: "m.login.registration_token", token: form.getValues("registration_token") });
		else if (currentStage === "m.login.terms") {
			if (form.getValues("terms_accepted")) submitStage({ type: "m.login.terms" });
			else form.setError("terms_accepted", { type: "manual", message: "You must accept the terms to proceed." });
		} else return;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStage]);

	useEffect(() => {
		setUIAFetchError(null); //пофиксить странное оторбажение при смене хомесервера
		if (!isHsValid) return;
		let cancelled = false;
		(async () => {
			const c = await initClient(homeserver);
			if (cancelled) return;
			await fetchAuthFlows(c);
		})();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [homeserver, isHsValid]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		setUIAFetchError(null);
		const response = await startRegistration({
			username: values.username,
			password: values.password,
			initial_device_display_name: "Poltva Client",
			inhibit_login: false,
		});
		if (response instanceof MatrixError) handleMatrixError(response);
	}
	const blocked = !canSubmit || isHsLoading || isHsError || !isHsValid || UIAFetchError !== null;
	return {
		form,
		onSubmit,
		availableFlows,
		isHsLoading,
		UIAFetchError,
		consentUrl,
		blocked,
	};
}
