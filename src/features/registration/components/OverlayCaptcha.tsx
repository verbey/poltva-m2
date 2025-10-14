import ReCaptcha from "./ReCaptcha";

export default function OverlayCaptcha() {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-lg">
				<h2 className="text-xl font-bold mb-4">Please complete the CAPTCHA</h2>
				<ReCaptcha />
			</div>
		</div>
	);
}
