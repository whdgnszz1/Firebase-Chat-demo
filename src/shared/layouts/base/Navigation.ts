"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const NavigationEvents = () => {
  const pathname = usePathname();

  useEffect(() => {
    /** 해쉬 파라미터가 있는 경우 삭제 */
    const isHashPrams = location.href.includes("#?");
    if (isHashPrams) {
      const hashIndex = location.href.indexOf("#");

      window.history.replaceState(null, "", location.href.slice(0, hashIndex));
    }
  }, [pathname]);

  return null;
};
