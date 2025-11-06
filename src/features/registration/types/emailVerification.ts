export interface EmailToken {
	sid: string;
	clientSecret: string;
}

export interface RequestEmailToken {
	(): Promise<EmailToken | undefined>;
}
