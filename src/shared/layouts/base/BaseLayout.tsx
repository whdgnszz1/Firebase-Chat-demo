"use server";

import { Suspense } from "react";

import { NavigationEvents } from "./Navigation";
import { IParentReactNode } from "@/shared";

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
  interface Window {
    Kakao: any;
  }
}

const BaseLayout = async ({ children }: IParentReactNode) => {
  return (
    <html lang="ko">
      {/* process.env.NODE_ENV === "production" */}
      <Suspense fallback={null}>
        <NavigationEvents />
      </Suspense>

      <body className={"font-body relative"}>{children}</body>
    </html>
  );
};

export default BaseLayout;
