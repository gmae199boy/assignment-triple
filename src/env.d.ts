declare namespace NodeJS {
	export interface ProcessEnv {
		SERVER_PORT: number;
		SERVER_ADDRESS: string;
		DB_ADDRESS: string;
	}
}
