import { useEffect, useState, useRef, useCallback } from "react";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import useRegistrationStages from "../useRegistrationStages";

export default function useEmailVerification() {
	const { submitStage } = useRegistrationStages();
	const client = useRegistrationStore((s) => s.client);
	const registrationEmail = useRegistrationStore((s) => s.registrationEmail);
	const reset = useRegistrationStore((s) => s.reset);

	const [sid, setSid] = useState<string | null>(null);
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	const [isRequesting, setIsRequesting] = useState(false);
	const [isSubmittingToken, setisSubmittingToken] = useState(false);

	const requestedRef = useRef(false);
	const sendAttemptRef = useRef(1);
	const mountedRef = useRef(true);

	useEffect(() => {
		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (requestedRef.current) return;
		requestedRef.current = true;
		const fetchEmailToken = async () => {
			if (!registrationEmail) return;
			if (!client) return;
			setIsRequesting(true);
			try {
				const secret = client.generateClientSecret();
				const sendAttempt = sendAttemptRef.current;
				sendAttemptRef.current += 1;

				const tokenResp = await client.requestRegisterEmailToken(registrationEmail, secret, sendAttempt);
				const returnedSid = (tokenResp as { sid?: string })?.sid;
				if (returnedSid) {
					setSid(returnedSid);
					setClientSecret(secret);
				} else {
					console.error("Failed to request email token or no sid returned.");
				}
			} catch (err) {
				console.error("requestEmailToken failed:", err);
			} finally {
				if (mountedRef.current) setIsRequesting(false);
			}
		};
		void fetchEmailToken();
	}, [registrationEmail, client]);

	const handleIClicked = useCallback(async () => {
		if (!sid) return;
		if (isSubmittingToken) return;
		setisSubmittingToken(true);
		try {
			await submitStage({
				type: "m.login.email.identity",
				threepid_creds: {
					client_secret: clientSecret ?? "",
					sid,
				},
			});
		} finally {
			if (mountedRef.current) setisSubmittingToken(false);
		}
	}, [sid, clientSecret, submitStage, isSubmittingToken]);

	const handleCancel = useCallback(() => {
		reset();
	}, [reset]);

	return {
		sid,
		clientSecret,
		isRequesting,
		isSubmittingToken,
		handleIClicked,
		handleCancel,
	};
}
