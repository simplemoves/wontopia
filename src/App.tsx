import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useTonWallet } from '@tonconnect/ui-react';
import { tonAddress } from './lib/TonUtils';
import { useWontopiaStore } from './store/WontopiaStore.ts';
import { Disclaimer } from './Disclaimer';
import { Game } from './Game';
import { testOnly } from "./lib/Constants.ts";

export const App = () => {
  const wontopiaStore = useWontopiaStore();
  const wallet = useTonWallet();
  const walletAddress = useMemo(() => tonAddress(wallet?.account.address), [ wallet ])
  const [ ready, setReady ] = useState(false);

  useEffect(() => {
    if (walletAddress) {
        wontopiaStore.store(walletAddress.toString({ testOnly }));
        setReady(true);
    } else {
        setReady(false);
    }
  }, [walletAddress, wontopiaStore]);

  return !(ready && walletAddress)
    ? <Disclaimer/>
    : <Game walletAddress={walletAddress}/>
}
