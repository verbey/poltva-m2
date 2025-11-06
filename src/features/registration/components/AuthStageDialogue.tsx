import ReCaptcha from "./AuthStages/ReCaptcha";
import EmailVerification from "./AuthStages/Email";
import type { SubmitStageFn } from "../types/submitStage";
import type { RequestEmailToken } from "../types/emailVerification";
export default function AuthStageDialogue({
	type,
	submitStage,
	recaptchaSiteKey,
	requestEmailToken,
}: {
	type: "captcha" | "email" | null;
	submitStage: SubmitStageFn;
	recaptchaSiteKey?: string | null;
	requestEmailToken?: RequestEmailToken;
}) {
	if (!type) return null;
	return (
		<div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-lg">
				{type === "captcha" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please complete the CAPTCHA</h2>
						<ReCaptcha submitStage={submitStage} siteKey={recaptchaSiteKey ?? undefined} />
					</>
				)}
				{type === "email" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please verify your email</h2>
						<EmailVerification submitStage={submitStage} requestEmailToken={requestEmailToken} />
					</>
				)}
			</div>
		</div>
	);
}
