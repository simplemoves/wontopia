import './App.css'
import { useMemo } from 'react'
import { useTonWallet } from '@tonconnect/ui-react';
import { tonAddress } from './lib/TonUtils';
import { Disclaimer } from './Disclaimer';
import { Game } from './Game';
import { testOnly } from "./lib/Constants.ts";

export const App = () => {
    const wallet = useTonWallet();
    const walletAddress = useMemo(() => tonAddress(wallet?.account.address), [ wallet ])
    const walletAddressStr = useMemo(() => walletAddress?.toString({ testOnly }), [ walletAddress ]);
    const isReady = useMemo(() => !!walletAddressStr, [ walletAddressStr ]);

    return !(isReady && walletAddress)
           ? <Disclaimer/>
           : <Game key={walletAddressStr} walletAddress={walletAddress}/>
}
