// src/urqlClient.ts
import { cacheExchange, Client, fetchExchange, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import { testOnly } from "./Constants.ts";

let activeSocket: WebSocket | undefined;
let timedOut: NodeJS.Timeout | undefined;

const host = testOnly ? "internal.wontopia.win" : "wontopia.win"

const wsClient = createWSClient({
  url: `wss://${host}:9443/query`,
  retryAttempts: Infinity,
  shouldRetry: () => true,
  keepAlive: 7500,
  on: {
    connected: (socket) => {
      activeSocket = socket as WebSocket
    },
    ping: (received) => {
      if (!received) {
        timedOut = setTimeout(() => {
          if (activeSocket?.readyState === WebSocket?.OPEN)
            activeSocket?.close(4408, 'Request Timeout');
        }, 7500);
      }
    },
    pong: (received) => {
      if (received) clearTimeout(timedOut);
    },
    opened: () => { console.log("Subscription connected") },
    closed: (event) => { console.log("Subscription disconnected", event) }
  }
});

export const graphQLClient = new Client({
  url: `https://${host}:9443/query`,
  fetch: fetchWithTimeout,
  exchanges: [
      cacheExchange,
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || '' };
          return {
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(input, sink);
              return { unsubscribe };
            },
          };
        }
      }),
  ],

  requestPolicy: "network-only",
});

function fetchWithTimeout(url: RequestInfo | URL, options?: RequestInit, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const customOptions = {
    ...options,
    signal: controller.signal,
  };

  return fetch(url, customOptions)
  .finally(() => {
    clearTimeout(id);
  });
}