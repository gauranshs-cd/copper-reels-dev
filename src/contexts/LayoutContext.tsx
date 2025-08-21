import { createContext, useContext, ReactNode } from 'react';

interface LayoutContextType {
  hasSidebar: boolean;
}

const LayoutContext = createContext<LayoutContextType>({ hasSidebar: false });

export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
  children: ReactNode;
  hasSidebar: boolean;
}

export function LayoutProvider({ children, hasSidebar }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{ hasSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}