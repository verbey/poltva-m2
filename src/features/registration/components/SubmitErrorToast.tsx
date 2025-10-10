import { toast } from "sonner";

export function showSubmitErrorToast() {
	toast.error("Failed to submit the form. Please try again.");
}
