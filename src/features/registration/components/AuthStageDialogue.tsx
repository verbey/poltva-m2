import ReCaptcha from "./ReCaptcha";

type SubmitStageFn = (authDict: Record<string, unknown>) => Promise<unknown> | void;

export default function AuthStageDialogue({
	type,
	submitStage,
	recaptchaSiteKey,
}: {
	type: "captcha" | "email" | null;
	submitStage: SubmitStageFn;
	recaptchaSiteKey?: string | null;
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
						<p>NOT IMPLEMENTED</p>
					</>
				)}
			</div>
		</div>
	);
}
