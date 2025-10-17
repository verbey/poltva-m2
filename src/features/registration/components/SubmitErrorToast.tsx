import { toast } from "sonner";

export function showSubmitErrorToast(message?: string) {
	toast.error(message || "An error occurred during registration. Please try again.");
}
