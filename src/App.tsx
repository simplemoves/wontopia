import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useTonWallet } from '@tonconnect/ui-react';
import { tonAddress } from './lib/TonUtils';
import { useNftsStore } from './store/NftsStore';
import { Disclaimer } from './Disclaimer';
import { Game } from './Game';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// window.Buffer = window.Buffer || require("buffer").Buffer;

export const testOnly = import.meta.env.VITE_TEST_ONLY === 'true' || true;

export const App = () => {
  const nftStore = useNftsStore();
  const wallet = useTonWallet();
  const walletAddress = useMemo(() => tonAddress(wallet?.account.address), [ wallet ])
  const [ ready, setReady ] = useState(false);

  useEffect(() => {
    if (walletAddress) {
        nftStore.store(walletAddress.toString({ testOnly }));
        setReady(true);
    } else {
        setReady(false);
    }
  }, [walletAddress]);

  return !(ready && walletAddress) ? <Disclaimer/> : <Game/>
}
