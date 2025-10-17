import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICreateClientOpts, MatrixClient } from "matrix-js-sdk";

interface SessionStore {
  clientData: ICreateClientOpts[];
  addClientData: (newClientData: ICreateClientOpts) => void;
  activeClientIndex: number;
  setActiveClientIndex: (newActiveClientUserId: string) => void;
  activeClient: MatrixClient | null;
  setActiveClient: (newActiveClient: MatrixClient) => void;
}

const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      clientData: [],
      addClientData: (newClientData) =>
        set((state) => ({
          clientData: [...state.clientData, newClientData],
        })),
      activeClientIndex: 0,
      setActiveClientIndex: (newActiveClientUserId) => {
        set((state) => ({
          activeClientIndex: state.clientData.findIndex(
            (MatrixClient) => MatrixClient.userId === newActiveClientUserId
          ),
        }));
      },
      activeClient: null,
      setActiveClient: (newActiveClient) => {
        set((state) => ({
          activeClient: newActiveClient,
          activeClientIndex: state.clientData.findIndex(
            (MatrixClient) =>
              MatrixClient.userId === (newActiveClient.getUserId() ?? undefined)
          ),
        }));
      },
    }),
    {
      name: "session-store",
      partialize: (state) => ({
        clientData: state.clientData,
        activeClientIndex: state.activeClientIndex,
      }),
    }
  )
);

export default useSessionStore;
