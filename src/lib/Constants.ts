
export const testOnly = (import.meta.env.VITE_TEST_ONLY === undefined) || (import.meta.env.VITE_TEST_ONLY === 'true');
export const devEnv = import.meta.env.VITE_DEV_ENV === 'true';