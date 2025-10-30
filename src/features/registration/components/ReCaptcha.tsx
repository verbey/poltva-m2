import ReCAPTCHA from "react-google-recaptcha";
const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "6Lf_SN0rAAAAAP8axSVfjXcm22w6TDJK3l_a1_3r";

type SubmitStageFn = (authDict: Record<string, unknown>) => Promise<unknown> | void; //костыль

export default function ReCaptcha({ submitStage, siteKey }: { submitStage: SubmitStageFn; siteKey?: string | null }) {
	const onChange = (value: string | null) => {
		if (value) submitStage({ response: value, type: "m.login.recaptcha" });
	};

	return (
		<div className="flex flex-col items-center justify-center my-6 p-4" style={{ maxWidth: 400, margin: "0 auto" }}>
			<ReCAPTCHA sitekey={siteKey ?? NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onChange} />
		</div>
	);
}
