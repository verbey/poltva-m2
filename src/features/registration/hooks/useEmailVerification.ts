import { useEffect, useState, useRef, useCallback } from "react";
import type { SubmitStageFn } from "../types/submitStage";
import type { RequestEmailToken } from "../types/emailVerification";

export default function useEmailVerification(params: { submitStage: SubmitStageFn; requestEmailToken?: RequestEmailToken }) {
	const { submitStage, requestEmailToken } = params;

	const [sid, setSid] = useState<string | null>(null);
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [isRequesting, setIsRequesting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const requestedRef = useRef(false);

	useEffect(() => {
		if (requestedRef.current) return;
		requestedRef.current = true;

		const fetchEmailToken = async () => {
			if (!requestEmailToken) return;
			setIsRequesting(true);
			try {
				const result = await requestEmailToken();
				if (result && result.sid && result.clientSecret) {
					setSid(result.sid);
					setClientSecret(result.clientSecret);
				} else {
					console.error("Failed to request email token or no sid/clientSecret returned.");
				}
			} catch (err) {
				console.error("requestEmailToken failed:", err);
			} finally {
				setIsRequesting(false);
			}
		};

		void fetchEmailToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleIClicked = useCallback(async () => {
		if (!sid) return;
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			await submitStage({
				type: "m.login.email.identity",
				threepid_creds: {
					client_secret: clientSecret ?? "",
					sid,
				},
			});
		} finally {
			setIsSubmitting(false);
		}
	}, [sid, clientSecret, submitStage, isSubmitting]);

	return {
		sid,
		clientSecret,
		isRequesting,
		isSubmitting,
		handleIClicked,
	};
}
