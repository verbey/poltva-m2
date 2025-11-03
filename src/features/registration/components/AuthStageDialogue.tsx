import ReCaptcha from "./ReCaptcha";
import EmailVerification from "./Email";

type SubmitStageFn = (authDict: Record<string, unknown>) => Promise<unknown> | void;
type RequestEmailTokenFn = () => Promise<{ sid: string; clientSecret: string } | undefined>;

export default function AuthStageDialogue({
	type,
	submitStage,
	recaptchaSiteKey,
	requestEmailToken,
}: {
	type: "captcha" | "email" | null;
	submitStage: SubmitStageFn;
	recaptchaSiteKey?: string | null;
	requestEmailToken?: RequestEmailTokenFn;
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
