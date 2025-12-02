import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createMatrixClient from "@/lib/matrix/createMatrixClient";
import { normalizeLoginMatrixError } from "@/lib/matrix/errors";
import useSessionStore from "@/stores/useSessionStore";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginFormProps from "../types/LoginFormProps";

function useLoginForm(options: LoginFormProps) {
	const router = useRouter();
	const { homeserver, canSubmit, isHsLoading, isHsError, isHsValid } = options;

	const FormSchema = z
		.object({
			username: z.string().nonempty({ message: "Username/email field should not be empty." }),
			password: z.string().nonempty({ message: "Password should not be empty." }),
		})
		.required();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const addClientData = useSessionStore((state) => state.addClientData);
	const setActiveClient = useSessionStore((state) => state.setActiveClient);

	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(data: z.infer<typeof FormSchema> & { homeserver: string }) {
		setSubmitError(null);

		try {
			setIsSubmitting(true);
			const baseUrl = data.homeserver.startsWith("http") ? data.homeserver : `https://${data.homeserver}`;
			const client = createMatrixClient({
				baseUrl,
			});
			const loginRequestParams = {
				identifier: {
					type: "m.id.user",
					user: data.username,
				},
				type: "m.login.password",
				password: data.password,
			};
			const loginResponse = await client.loginRequest(loginRequestParams);
			console.log(loginResponse);
			addClientData({
				baseUrl: client.baseUrl,
				userId: client.getUserId() ?? undefined,
				accessToken: client.getAccessToken() ?? undefined,
				refreshToken: client.getRefreshToken() ?? undefined,
			});
			setActiveClient(client);
			router.push("/home");
		} catch (error) {
			console.error("Login error:", error);
			setSubmitError(normalizeLoginMatrixError(error));
			return;
		} finally {
			setIsSubmitting(false);
		}
	}

	const blocked = !canSubmit || isHsLoading || isHsError || !isHsValid;

	const handleSubmit = form.handleSubmit((data) => {
		if (blocked) return;
		return onSubmit({ ...data, homeserver: homeserver ?? "" });
	});

	return {
		form,
		onSubmit,
		blocked,
		handleSubmit,
		submitError,
		isSubmitting,
	};
}

export default useLoginForm;
