import { useCallback } from "react";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "6Lf_SN0rAAAAAP8axSVfjXcm22w6TDJK3l_a1_3r";
export default function useReCaptcha() {
	const siteKey = useRegistrationStore((s) => s.recaptchaSiteKey) ?? NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
	const submitStage = useRegistrationStore((s) => s.submitStage);
	const onChange = useCallback(
		(value: string | null) => {
			if (value) submitStage({ response: value, type: "m.login.recaptcha" });
		},
		[submitStage]
	);

	return { onChange, siteKey };
}
