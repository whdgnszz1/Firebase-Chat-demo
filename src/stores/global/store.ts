import { createStore } from "zustand/vanilla";

import { IGlobalState, GlobalStore, IGlobalStateEssential } from "./interface";

export const defaultInitState: IGlobalStateEssential = {
  user: null,
};

export const parseGlobalStoreData = (
  data: IGlobalStateEssential
): IGlobalState => {
  return {
    ...data,
    authorized: data.user != null,
  };
};

export const createGlobalStore = (
  initState: IGlobalStateEssential = defaultInitState
) => {
  return createStore<GlobalStore>()((set) => {
    return {
      ...parseGlobalStoreData(initState),

      setUser: (user: any | null) => {
        set(() => ({ user, authorized: user != null }));
      },
    };
  });
};
