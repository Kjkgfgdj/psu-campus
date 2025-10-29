"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PlaceDialogState = {
  isOpen: boolean;
  building: string;
  floor: string | number;
  zoneId: string;
  label: string;
};

type PlaceDialogContextType = {
  state: PlaceDialogState | null;
  openDialog: (building: string, floor: string | number, zoneId: string, label: string) => void;
  closeDialog: () => void;
};

const PlaceDialogContext = createContext<PlaceDialogContextType | undefined>(undefined);

export function PlaceDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaceDialogState | null>(null);

  const openDialog = useCallback((building: string, floor: string | number, zoneId: string, label: string) => {
    setState({
      isOpen: true,
      building,
      floor,
      zoneId,
      label,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState(null);
  }, []);

  return (
    <PlaceDialogContext.Provider value={{ state, openDialog, closeDialog }}>
      {children}
    </PlaceDialogContext.Provider>
  );
}

export function usePlaceDialog() {
  const context = useContext(PlaceDialogContext);
  if (!context) {
    throw new Error("usePlaceDialog must be used within PlaceDialogProvider");
  }
  return context;
}

