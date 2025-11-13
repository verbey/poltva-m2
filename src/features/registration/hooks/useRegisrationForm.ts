import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerFormSchema } from "../lib/validationSchemas";
import registerFormProps from "../types/registerFormProps";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import { MatrixError, type IAuthData, type MatrixClient } from "matrix-js-sdk";

export function useRegistrationForm(props: registerFormProps) {
	const { homeserver, isHsValid, isHsLoading } = props;
	const { initClient, startRegistration, client } = useRegistrationStore();
	const [availableFlows, setAvailableFlows] = useState<string[]>([]);
	const [UIAFetchError, setUIAFetchError] = useState<string | null>(null);
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
		},
	});

	const handleMatrixError = (error: MatrixError) => {
		switch (error.errcode) {
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
		console.log(UIAFetchError);
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

	useEffect(() => {
		setUIAFetchError(null);
	}, [homeserver]);

	useEffect(() => {
		if (!isHsValid) return;
		let cancelled = false;
		(async () => {
			const c = client ?? (await initClient(homeserver));
			if (cancelled) return;
			await fetchAuthFlows(c);
		})();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [homeserver, isHsValid, initClient, client]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		await startRegistration({
			username: values.username,
			password: values.password,
			initial_device_display_name: "Poltva Client",
			inhibit_login: false,
		});
	}

	return {
		form,
		onSubmit,
		availableFlows,
		isHsLoading,
		UIAFetchError,
	};
}
