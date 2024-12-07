import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './fonts.css'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import WebApp from '@twa-dev/sdk'
import eruda from 'eruda'
import { init } from '@telegram-apps/sdk';

init();
eruda.init();
WebApp.ready();

const manifestUrl = "https://simplemoves.github.io/wontopia-nft/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
