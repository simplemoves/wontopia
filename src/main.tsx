import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './variables.css'
import './fonts.css'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import WebApp from '@twa-dev/sdk'
import eruda from 'eruda'
import { Provider } from 'urql';
import { graphQLClient } from "./lib/graphQLClient.ts";

eruda.init();
WebApp.ready();

const manifestUrl = "https://simplemoves.github.io/wontopia-nft/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider value={graphQLClient}>
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
  </Provider>,
)
