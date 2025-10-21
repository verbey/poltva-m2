import { useState } from "react";
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

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
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
				const nextStage = uiaData.flows?.flatMap((flow) => flow.stages ?? []).find((stage) => !(uiaData.completed ?? []).includes(stage));
				setCurrentStage(nextStage || null);
			} else {
				showSubmitErrorToast("Server has no available registration flows.");
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
