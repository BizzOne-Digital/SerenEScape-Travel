"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SiteChromeContextValue {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

const SiteChromeContext = createContext<SiteChromeContextValue>({
  headerHeight: 80,
  setHeaderHeight: () => {},
});

export function SiteChromeProvider({ children }: { children: React.ReactNode }) {
  const [headerHeight, setHeaderHeightState] = useState(80);
  const setHeaderHeight = useCallback((height: number) => {
    setHeaderHeightState(height);
  }, []);

  return (
    <SiteChromeContext.Provider value={{ headerHeight, setHeaderHeight }}>
      {children}
    </SiteChromeContext.Provider>
  );
}

export function useSiteChrome() {
  return useContext(SiteChromeContext);
}

export const NAV_HEIGHT = 100;
