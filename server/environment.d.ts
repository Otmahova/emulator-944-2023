declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HOST?: string;
            PORT?: string;
            TCP?: string;
        }
    }
}

export {}