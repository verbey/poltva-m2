import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerFormSchema } from "../lib/validationSchemas";
import { registerWithMatrix } from "../lib/registrationProcessing";
import { showSubmitErrorToast } from "../components/SubmitErrorToast";
export function useRegistrationForm() {
	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			homeserver: "synapse-local.kagutsuchi.duckdns.org",
		},
	});

	async function onSubmit(values: z.infer<typeof registerFormSchema>) {
		try {
			console.log(registerWithMatrix(values, values.homeserver));
		} catch (error) {
			console.error("Form submission error", error);
			showSubmitErrorToast();
		}
	}
	return { form, onSubmit };
}
