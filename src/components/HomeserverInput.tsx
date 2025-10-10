"use client";

import { Input } from "@/components/ui/input";

async function validateHomeserver(homeserver: string): Promise<boolean> {
	if (!homeserver || !homeserver.includes(".")) {
		return false;
	}

	try {
		const response = await fetch(`https://${homeserver}/.well-known/matrix/client`, {
			method: "GET",
			mode: "cors",
		});
		return response.ok;
	} catch (error) {
		console.error("Homeserver validation error:", error);
		return false;
	}
}

import React from "react";

export function HomeserverValidator() {
	const [isInvalid, setIsInvalid] = React.useState(false);
	const [value, setValue] = React.useState("matrix.org");
	const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
		debounceTimeout.current = setTimeout(async () => {
			if (value) {
				const valid = await validateHomeserver(value);
				setIsInvalid(!valid);
			}
		}, 500);
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, [value]);

	return (
		<div>
			<Input id="homeserver" type="text" placeholder="matrix.org" value={value} aria-invalid={isInvalid} onChange={(e) => setValue(e.target.value)} />
			{isInvalid && <span className="text-destructive text-sm mt-1 block">Invalid homeserver URL</span>}
		</div>
	);
}
