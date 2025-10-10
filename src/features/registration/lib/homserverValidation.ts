export default async function validateHomeserver(homeserver: string): Promise<boolean> {
	if (!homeserver || !homeserver.includes(".")) {
		return false;
	}
	try {
		const response = await fetch(`https://${homeserver}/.well-known/matrix/client`, {
			method: "GET",
			mode: "cors",
		});
		return response.ok;
	} catch {
		return false;
	}
}
