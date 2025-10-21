import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MatrixError, createClient, RegisterRequest, IAuthData } from "matrix-js-sdk";
import { registerFormSchema } from "../lib/validationSchemas";
import { showSubmitErrorToast } from "../components/SubmitErrorToast";

export function useRegistrationForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [currentStage, setCurrentStage] = useState<string | null>(null);
	const [availableFlows, setAvailableFlows] = useState<string[]>([]); //hz

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			homeserver: "matrix.org",
		},
	});

	const { watch, trigger } = form;
	const homeserverValue = watch("homeserver");
	useEffect(() => {
		async function fetchAuthFlows() {
			setIsLoading(true);
			const values = form.getValues();
			console.log("Fetching auth flows for homeserver:", values.homeserver);
			const client = createClient({ baseUrl: `https://${values.homeserver}` });
			try {
				const flows = await client.registerRequest({});
				console.log("Available registration flows:", flows);
			} catch (error) {
				if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
					const IAuthData = error.data as IAuthData;
					if (IAuthData.flows && IAuthData.flows.length > 0) {
						setAvailableFlows(IAuthData.flows.flatMap((flow) => flow.stages)); // Не до конца понял этот момент, надо бы перечитать доку
						console.log("Available registration flows:", IAuthData.flows);
					} else {
						showSubmitErrorToast("Server has no available registration flows.");
					}
				} else {
					showSubmitErrorToast("Could not connect to the homeserver to get registration info.");
				}
			} finally {
				setIsLoading(false);
			}
		}

		const timer = setTimeout(() => {
			trigger("homeserver");
			fetchAuthFlows();
		}, 500);

		return () => clearTimeout(timer);
	}, [homeserverValue, trigger, form]);

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		console.log("Submitting registration for homeserver:", values.homeserver);
		setIsLoading(true);
		const client = createClient({ baseUrl: `https://${values.homeserver}` });

		const registrationData: RegisterRequest = {
			username: values.username,
			password: values.password,
			initial_device_display_name: "My Web Client",
			inhibit_login: false,
		};

		try {
			const response = await client.registerRequest(registrationData);
			console.log("Registration successful!", response);
			// Handle success
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 401 && error.data) {
				const uiaData = error.data as IAuthData;
				console.log("Registration requires additional authentication.", uiaData);
				const nextStage = uiaData.flows?.flatMap((flow) => flow.stages ?? []).find((stage) => !(uiaData.completed ?? []).includes(stage));
				console.log("Next required stage:", nextStage);
				setCurrentStage(nextStage || null);
			} else {
				console.log("Server has no available registration flows.", error);
			}
		} finally {
			setIsLoading(false);
		}
	}

	return {
		form,
		onSubmit,
		isLoading,
		currentStage,
		availableFlows,
	};
}
