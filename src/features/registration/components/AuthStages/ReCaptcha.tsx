import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "../../hooks/AuthStages/useReCaptcha";
import { Button } from "@/components/ui/button";

export default function ReCaptcha() {
	const { onChange, siteKey, onCancel } = useReCaptcha();
	return (
		<div className="flex flex-col items-center justify-center my-6 p-4" style={{ maxWidth: 400, margin: "0 auto" }}>
			<ReCAPTCHA sitekey={siteKey} onChange={onChange} />
			<div className="mt-4">
				<Button type="button" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
