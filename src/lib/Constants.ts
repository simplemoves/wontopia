import { GameStateLog, INITIAL_GAME } from "./Types.ts";

export const testOnly = (import.meta.env.VITE_TEST_ONLY === undefined) || (import.meta.env.VITE_TEST_ONLY === 'true');
export const devEnv = import.meta.env.VITE_DEV_ENV === 'true';

export const initialUserStates: Record<number, GameStateLog> = Object.fromEntries(
    Array.from({ length: 12 }, (_, power) => [ power, { before: INITIAL_GAME, after: INITIAL_GAME } ]),
);