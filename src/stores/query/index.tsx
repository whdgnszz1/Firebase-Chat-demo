"use client";

import { customFetch } from "@/util/api";
import { isClient } from "@/util/envs";
import { isPureObject } from "@/util/type";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type {
  QueryClientConfig,
  QueryKey,
  QueryObserverOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  PersistQueryClientProvider,
  Persister,
} from "@tanstack/react-query-persist-client";
import { ReactNode } from "react";

const makeQueryClient = () => {
  const queries: Omit<
    QueryObserverOptions<unknown, Error, unknown, unknown, QueryKey, never>,
    "queryKey" | "suspense"
  > = {
    retry: false,
    queryFn: ({ queryKey }) => {
      const option = queryKey[1];
      if (isPureObject(option) && "url" in option) {
        return customFetch(option.url as string);
      }
      return customFetch(queryKey[0] as string);
    },
    refetchOnWindowFocus: false,
  };

  const options: QueryClientConfig = {
    defaultOptions: { queries },
  };

  return new QueryClient(options);
};

let clientQuery: QueryClient | undefined;
let sessionStoragePersister: Persister;

const getQueryClient = () => {
  if (!isClient) {
    return makeQueryClient();
  }
  if (!clientQuery) {
    clientQuery = makeQueryClient();
  }
  return clientQuery;
};

interface IQueryProviderProps {
  children: ReactNode;
  devtools?: boolean;
}

export const QueryProvider = ({
  children,
  devtools = true,
}: IQueryProviderProps) => {
  const queryClient: QueryClient = getQueryClient();

  if (isClient) {
    sessionStoragePersister = createSyncStoragePersister({
      storage: window.sessionStorage,
    });
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: sessionStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.options.meta?.persist === true;
          },
        },
      }}
    >
      {children}
      {devtools && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </PersistQueryClientProvider>
  );
};
