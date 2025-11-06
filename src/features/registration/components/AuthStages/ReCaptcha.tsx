import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "../../hooks/useReCaptcha";
import type { SubmitStageFn } from "../../types/submitStage";
const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "6Lf_SN0rAAAAAP8axSVfjXcm22w6TDJK3l_a1_3r";

export default function ReCaptcha({ submitStage, siteKey }: { submitStage: SubmitStageFn; siteKey?: string | null }) {
	const { onChange } = useReCaptcha(submitStage);

	return (
		<div className="flex flex-col items-center justify-center my-6 p-4" style={{ maxWidth: 400, margin: "0 auto" }}>
			<ReCAPTCHA sitekey={siteKey ?? NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onChange} />
		</div>
	);
}
