"use client";

import React, { createContext, useRef, useContext } from "react";

import { type StoreApi, useStore } from "zustand";

import type {
  GlobalStore,
  FnInitGlobalStore,
  IGlobalStateEssential,
} from "./interface";
import { createGlobalStore } from "./store";

const GlobalStoreContext = createContext<StoreApi<GlobalStore> | null>(null);

interface IProps {
  children: React.ReactNode;
  onInit?: FnInitGlobalStore;
  data: IGlobalStateEssential;
}

export const GlobalStoreProvider = ({ children, data }: IProps) => {
  const ref = useRef<StoreApi<GlobalStore>>();
  if (!ref.current) {
    ref.current = createGlobalStore(data);
  }

  return (
    <GlobalStoreContext.Provider value={ref.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const context = useContext(GlobalStoreContext);
  // context.user = headers().get(HttpHeader.X_USER) as string

  if (!context) {
    throw new Error("useGlobalStore must be use within GlobalStoreProvider");
  }

  return useStore(context, selector);
};
