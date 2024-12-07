import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useTonWallet } from '@tonconnect/ui-react';
import { tonAddress } from './lib/TonUtils';
import { testOnly, useNftsStore } from './store/NftsStore';
import { Disclaimer } from './Disclaimer';
// import { Game } from './Game';

export const App = () => {
  const nftStore = useNftsStore();
  const wallet = useTonWallet();
  const walletAddress = useMemo(() => tonAddress(wallet?.account.address), [ wallet ])
  const [ _, setReady ] = useState(false);
  // const [ ready, setReady ] = useState(false);

  useEffect(() => {
    if (walletAddress) {
        nftStore.store(walletAddress.toString({ testOnly }));
        setReady(true);
    } else {
        setReady(false);
    }
  }, [walletAddress, nftStore]);

  // return !(ready && walletAddress) ? <Disclaimer/> : <Game ready={ready} walletAddress={walletAddress}/>
  return <Disclaimer/>
}
