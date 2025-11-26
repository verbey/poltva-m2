import ReCaptcha from "./AuthStages/ReCaptcha";
import EmailVerification from "./AuthStages/Email";
import useAuthStageDialogue from "../hooks/useAuthStageDialogue";

export default function AuthStageDialogue() {
	const { type } = useAuthStageDialogue();
	if (!type) return null;
	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-background w-[min(92vw,560px)] rounded-xl border shadow-2xl p-6 sm:p-8">
				{type === "captcha" && (
					<>
						<h2 className="text-xl font-semibold mb-4">Please complete the CAPTCHA</h2>
						<ReCaptcha />
					</>
				)}
				{type === "email" && (
					<>
						<h2 className="text-xl font-semibold mb-4">Please verify your email</h2>
						<EmailVerification />
					</>
				)}
			</div>
		</div>
	);
}
