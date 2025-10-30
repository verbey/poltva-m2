import ReCaptcha from "./ReCaptcha";

type SubmitStageFn = (authDict: Record<string, unknown>) => Promise<unknown> | void;

export default function Overlay({
	overlayType,
	submitStage,
	recaptchaSiteKey,
}: {
	overlayType: "captcha" | "email" | null;
	submitStage: SubmitStageFn;
	recaptchaSiteKey?: string | null;
}) {
	if (!overlayType) return null;
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-lg">
				{overlayType === "captcha" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please complete the CAPTCHA</h2>
						<ReCaptcha submitStage={submitStage} siteKey={recaptchaSiteKey ?? undefined} />
					</>
				)}
				{overlayType === "email" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please verify your email</h2>
						<p>NOT IMPLEMENTED</p>
					</>
				)}
			</div>
		</div>
	);
}
