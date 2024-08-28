import { parseGlobalState } from "@/shared/actions";
import { IParentReactNode } from "@/shared/interfaces";
import { GlobalStoreProvider, QueryProvider } from "@/stores";

export const BaseProvider = async ({ children }: IParentReactNode) => {
  const globalState = await parseGlobalState();

  return (
    <GlobalStoreProvider data={globalState}>
      <QueryProvider>{children}</QueryProvider>
    </GlobalStoreProvider>
  );
};
