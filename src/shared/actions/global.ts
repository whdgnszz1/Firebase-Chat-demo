"use server";

import { IGlobalState, parseGlobalStoreData } from "@/stores";
import { authorize } from "./user";

export async function parseGlobalState(): Promise<IGlobalState> {
  const user = await authorize();

  return parseGlobalStoreData({ user });
}
