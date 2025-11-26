import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";
import useEmailVerification from "../../hooks/AuthStages/useEmailVerification";

export default function EmailVerification() {
	const { sid, isRequesting, isSubmittingToken, submitError, handleIClicked, handleCancel } = useEmailVerification();

	return (
		<div className="w-[28rem] max-w-[90vw]">
			{isRequesting && (
				<div className="flex items-start gap-3 rounded-md border bg-muted/40 p-3 text-sm">
					<Spinner className="h-4 w-4 mt-0.5" />
					<div>
						<p className="font-medium">Sending verification email…</p>
						<p className="text-muted-foreground">This may take a few seconds.</p>
					</div>
				</div>
			)}

			{!isRequesting && sid && (
				<div className="space-y-4">
					{submitError && (
						<div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
							<AlertTriangleIcon className="h-4 w-4 mt-0.5" />
							<div>
								<p className="font-medium">Verification failed</p>
								<p className="text-red-800/80">{submitError}</p>
							</div>
						</div>
					)}
					{!submitError && (
						<div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
							<CheckCircle2Icon className="h-4 w-4 mt-0.5" />
							<div>
								<p className="font-medium">Verification email sent</p>
								<p className="text-green-800/80">Click the link in your email, then confirm below.</p>
							</div>
						</div>
					)}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<Button type="button" onClick={handleIClicked} disabled={isSubmittingToken} className="w-full sm:w-auto">
							{isSubmittingToken && <Spinner className="mr-2" />} I clicked the verification link
						</Button>
						<Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmittingToken} className="w-full sm:w-auto">
							Cancel
						</Button>
					</div>
				</div>
			)}

			{!isRequesting && !sid && (
				<div className="space-y-4">
					<div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
						<AlertTriangleIcon className="h-4 w-4 mt-0.5" />
						<div>
							<p className="font-medium">We couldn&#39;t send the email</p>
							<p className="text-amber-800/80">Please try again later or cancel and re-enter your address.</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button type="button" variant="ghost" onClick={handleCancel}>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
