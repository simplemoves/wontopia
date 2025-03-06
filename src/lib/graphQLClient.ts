// src/urqlClient.ts
import { cacheExchange, Client, fetchExchange, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

const wsClient = createWSClient({
  url: 'wss://internal.wontopia.win:9443/query',
});

export const graphQLClient = new Client({
  url: "https://internal.wontopia.win:9443/query",
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