import { IUserPayload } from "@/shared/interfaces/user";

export interface IGlobalStateEssential {
  user: any | null;
}

export interface IGlobalState extends IGlobalStateEssential {
  authorized: boolean;
}

export interface IGlobalActions {
  setUser: (user: IUserPayload | null) => void;
}

export type GlobalStore = IGlobalState & IGlobalActions;

export type FnInitGlobalStore = () => Promise<IGlobalState | null>;
