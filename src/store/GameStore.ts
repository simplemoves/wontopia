import { create } from 'zustand';
import { Game, INITIAL_GAME, PlayState } from "../lib/Types";
import { StoreApi, UseBoundStore } from "zustand/index";

type GameStoreState = {
  game: Game
  setState: (state: PlayState) => void
  setPlayersToWait: (playersToWait: number) => void
  setPaused: (isPaused: boolean) => void
  setDelayed: (isDelayed: boolean) => void
}

const stores: Record<string, UseBoundStore<StoreApi<GameStoreState>>> = {}

export const useGameStore = (walletAddressStr: string, wontonPower: number) => {
  let store = stores[walletAddressStr+wontonPower];
  if (!store) {
    store = createGameStore();
    stores[walletAddressStr+wontonPower] = store;
  }

  return store;
}

const createGameStore = () => create<GameStoreState>()((set) => ({
    game: INITIAL_GAME,
    setState: (state) => {set((store) => ({ game: { ...store.game, state }}))},
    setPlayersToWait: (playersToWait) => {set((store) => ({ game: { ...store.game, playersToWait }}))},
    setPaused: (isPaused: boolean) => {set((store) => ({ game: { ...store.game, isPaused }}))},
    setDelayed: (isDelayed: boolean) => {set((store) => ({ game: { ...store.game, isDelayed }}))},
}));

