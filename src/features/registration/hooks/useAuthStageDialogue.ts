import { useMemo } from "react";
import { useRegistrationStore } from "@/stores/useRegistrationStore";

export type AuthDialogueType = "captcha" | "email" | null;

export default function useAuthStageDialogue() {
	const currentStage = useRegistrationStore((s) => s.currentStage);
	const initialAuthData = useRegistrationStore((s) => s.initialAuthData);
	const recaptchaSiteKey = useRegistrationStore((s) => s.recaptchaSiteKey);

	const type: AuthDialogueType = useMemo(() => {
		if (currentStage === "m.login.recaptcha") return "captcha";
		if (currentStage === "m.login.email.identity") return "email";
		return null;
	}, [currentStage]);

	const siteKey = useMemo<string | null>(() => {
		if (recaptchaSiteKey) return recaptchaSiteKey;
		const key = (initialAuthData?.params?.["m.login.recaptcha"] as { public_key?: string } | undefined)?.public_key ?? null;
		return key ?? null;
	}, [recaptchaSiteKey, initialAuthData]);

	return { type, recaptchaSiteKey: siteKey };
}
