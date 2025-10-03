import ReCAPTCHA from "react-google-recaptcha";

const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "6Lf_SN0rAAAAAP8axSVfjXcm22w6TDJK3l_a1_3r";

export default function ReCaptcha() {
	const onChange = (value: string | null) => {
		console.log("Captcha value:", value);
	};

	return (
		<div className="flex flex-col items-center justify-center my-6 p-4" style={{ maxWidth: 400, margin: "0 auto" }}>
			<ReCAPTCHA sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={onChange} />
		</div>
	);
}
