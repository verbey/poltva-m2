import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "../../hooks/AuthStages/useReCaptcha";

export default function ReCaptcha() {
	const { onChange, siteKey } = useReCaptcha();
	return (
		<div className="flex flex-col items-center justify-center my-6 p-4" style={{ maxWidth: 400, margin: "0 auto" }}>
			<ReCAPTCHA sitekey={siteKey} onChange={onChange} />
		</div>
	);
}
