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
	const [submitError, setSubmitError] = useState<string | null>(null);

	const sendAttemptRef = useRef(1);

	useEffect(() => {
		const fetchEmailToken = async () => {
			if (!registrationEmail) return;
			if (!client) return;
			setIsRequesting(true);
			try {
				const secret = client.generateClientSecret();
				const sendAttempt = sendAttemptRef.current;
				sendAttemptRef.current += 1;

				const tokenResp = await client.requestRegisterEmailToken(registrationEmail, secret, sendAttempt);
				console.log("Email token response:", tokenResp);
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
				setIsRequesting(false);
			}
		};
		fetchEmailToken();
	}, [registrationEmail, client]);

	const handleIClicked = useCallback(async () => {
		if (!sid) return;
		if (isSubmittingToken) return;
		setSubmitError(null);
		setisSubmittingToken(true);
		try {
			await submitStage({
				type: "m.login.email.identity",
				threepid_creds: {
					client_secret: clientSecret ?? "",
					sid,
				},
			});
		} catch {
			console.error("Submitting email verification token failed.");
			setSubmitError("We couldn't verify your email. Please make sure you clicked the link in the email.");
		} finally {
			setisSubmittingToken(false);
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
		submitError,
		handleIClicked,
		handleCancel,
	};
}
