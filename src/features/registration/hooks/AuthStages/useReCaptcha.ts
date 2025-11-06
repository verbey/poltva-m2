import { useCallback } from "react";
import type { SubmitStageFn } from "../../types/submitStage";

export default function useReCaptcha(submitStage: SubmitStageFn) {
	const onChange = useCallback(
		(value: string | null) => {
			if (value) submitStage({ response: value, type: "m.login.recaptcha" });
		},
		[submitStage]
	);

	return { onChange };
}
