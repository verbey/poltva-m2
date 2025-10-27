async function validateHomeserver(homeserver: string): Promise<boolean> {
  try {
    if (!homeserver) return false;

    const url = homeserver.startsWith("http")
      ? `${homeserver}/.well-known/matrix/client`
      : `https://${homeserver}/.well-known/matrix/client`;

    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export default validateHomeserver;
