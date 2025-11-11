import ReCaptcha from "./AuthStages/ReCaptcha";
import EmailVerification from "./AuthStages/Email";
import useAuthStageDialogue from "../hooks/useAuthStageDialogue";

export default function AuthStageDialogue() {
	const { type } = useAuthStageDialogue();
	if (!type) return null;
	return (
		<div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-lg">
				{type === "captcha" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please complete the CAPTCHA</h2>
						<ReCaptcha />
					</>
				)}
				{type === "email" && (
					<>
						<h2 className="text-xl font-bold mb-4">Please verify your email</h2>
						<EmailVerification />
					</>
				)}
			</div>
		</div>
	);
}
