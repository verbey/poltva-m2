import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerFormSchema } from "../lib/validationSchemas";
import registerFormProps from "../types/registerFormProps";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import useRegistrationStages from "./useRegistrationStages";
import { MatrixError, type IAuthData, type MatrixClient } from "matrix-js-sdk";
import { normalizeRegistrationMatrixError, applyRegistrationMatrixError } from "@/lib/matrix/errors";

export function useRegistrationForm(props: registerFormProps) {
	const { homeserver, isHsValid, isHsLoading, isHsError, canSubmit } = props;
	const { initClient, currentStage, client } = useRegistrationStore();
	const { startRegistration, submitStage, setRegistrationEmail } = useRegistrationStages();
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
		const normalized = normalizeRegistrationMatrixError(error);
		applyRegistrationMatrixError(form, normalized);
		if (normalized.uiMessage) setUIAFetchError(normalized.uiMessage);
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
		if (currentStage == "m.login.dummy") submitStage({ type: "m.login.dummy" });
		else if (currentStage === "m.login.registration_token") submitStage({ type: "m.login.registration_token", token: form.getValues("registration_token") });
		else if (currentStage === "m.login.terms") {
			if (form.getValues("terms_accepted")) submitStage({ type: "m.login.terms" });
			else form.setError("terms_accepted", { type: "manual", message: "You must accept the terms to proceed." });
		} else return;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStage]);

	useEffect(() => {
		setUIAFetchError(null);
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
		if (values.email?.trim()) setRegistrationEmail(values.email.trim());
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
