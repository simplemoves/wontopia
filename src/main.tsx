import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './fonts.css'
import './index.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import WebApp from '@twa-dev/sdk'

WebApp.ready();

const manifestUrl = "https://simplemoves.github.io/wonton-nft/tonconnect-manifest.json";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
