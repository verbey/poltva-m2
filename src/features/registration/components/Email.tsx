import { Button } from "@/components/ui/button";
import useEmailVerification from "../hooks/useEmailVerification";
import type { SubmitStageFn } from "../types/submitStage";

export default function EmailVerification({
	submitStage,
	requestEmailToken,
}: {
	submitStage: SubmitStageFn;
	requestEmailToken?: () => Promise<{ sid: string; clientSecret: string } | undefined>;
}) {
	const { sid, isRequesting, isSubmitting, handleIClicked } = useEmailVerification({
		submitStage,
		requestEmailToken,
	});

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
