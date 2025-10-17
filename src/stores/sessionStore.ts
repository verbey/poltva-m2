import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICreateClientOpts } from "matrix-js-sdk";

interface SessionStore {
  clientData: ICreateClientOpts[];
  activeClientIndex: number;
}

const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      clientData: [],
      addClientData: (newClientData: ICreateClientOpts) =>
        set((state) => ({
          clientData: [...state.clientData, newClientData],
        })),
      activeClientIndex: 0,
      setActiveClientIndex: (newActiveClientUserId: string) => {
        set((state) => ({
          activeClientIndex: state.clientData.findIndex(
            (MatrixClient) => MatrixClient.userId === newActiveClientUserId
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
