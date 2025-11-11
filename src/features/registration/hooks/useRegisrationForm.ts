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

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
		},
	});

	const fetchAuthFlows = async (matrixClient: MatrixClient) => {
		setAvailableFlows([]);
		try {
			await matrixClient.registerRequest({});
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const data = error.data as IAuthData;
				const stages = (data.flows ?? []).flatMap((flows) => flows.stages ?? []);
				setAvailableFlows(Array.from(new Set(stages)));
			} else {
				console.log("Could not connect to the homeserver to get registration info.", error);
			}
		}
	};

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
	};
}
