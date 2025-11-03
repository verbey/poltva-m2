import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { log } from "console";
type SubmitStageFn = (authDict: Record<string, unknown>) => Promise<unknown> | void;

export default function EmailVerification({
	submitStage,
	requestEmailToken,
}: {
	submitStage: SubmitStageFn;
	requestEmailToken?: () => Promise<{ sid: string; clientSecret: string } | undefined>;
}) {
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
				console.log("Email token requested:", result);
				if (result && result.sid && result.clientSecret) {
					setSid(result.sid);
					setClientSecret(result.clientSecret);
					setIsRequesting(false);
				} else {
					console.error("Failed to request email token or no sid/clientSecret returned.");
				}
			} catch (err) {
				console.error("requestEmailToken failed:", err);
			}
		};

		fetchEmailToken();
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

	return (
		<div>
			<p>Please check your email for a verification link.</p>

			{isRequesting && <p>Requesting verification email…</p>}

			{!isRequesting && sid && (
				<>
					<p>We sent a verification email. Click the button once you have clicked the link in the email.</p>
					<Button type="button" onClick={handleIClicked} disabled={isSubmitting}>
						{isSubmitting ? "Submitting…" : "I clicked the verification link"}
					</Button>
				</>
			)}

			{!isRequesting && !sid && <p>Unable to request email verification. Please try again later.</p>}
		</div>
	);
}
