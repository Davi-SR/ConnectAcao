import React, { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { RootStackParamList } from '../navigation/types';

type DrawerContextValue = { isOpen: boolean; activeRoute: keyof RootStackParamList | null; openDrawer: () => void; closeDrawer: () => void; setActiveRoute: (route: keyof RootStackParamList) => void };

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<keyof RootStackParamList | null>(null);
  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, activeRoute, openDrawer, closeDrawer, setActiveRoute }), [isOpen, activeRoute, openDrawer, closeDrawer]);
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer deve ser usado dentro de DrawerProvider.');
  return context;
}
